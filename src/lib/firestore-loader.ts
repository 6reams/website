import type { Loader, LoaderContext } from 'astro/loaders';
import { firebaseConfigured, queryCollection, type FsDoc } from './firestore-rest';

interface Options {
  /** Loader for the local files (glob/file). Runs first. */
  local: Loader;
  /** Firestore collection to merge in. */
  collection: string;
  /** Only fetch documents where this field equals this value (e.g. draft == false). */
  where?: { field: string; value: boolean | string };
  /** Field holding Markdown to render (blog posts). */
  bodyField?: string;
}

/**
 * Loads local Markdown/JSON entries, then merges in documents from Firestore.
 * A Firestore document with the same id as a local entry REPLACES it.
 *
 * - Firebase not configured → local content only (with a notice).
 * - Firebase configured but unreachable → the build FAILS, so a broken fetch
 *   never silently deploys a site with missing posts.
 */
export function withFirestore({ local, collection, where, bodyField }: Options): Loader {
  return {
    name: `local+firestore:${collection}`,
    load: async (ctx: LoaderContext) => {
      await local.load(ctx);

      if (!firebaseConfigured()) {
        ctx.logger.info(`Firebase not configured — "${ctx.collection}" uses local files only.`);
        return;
      }

      const docs: FsDoc[] = await queryCollection(collection, where);
      for (const doc of docs) {
        const { [bodyField ?? '']: body, ...rest } = doc.data;
        const data = await ctx.parseData({ id: doc.id, data: { ...rest, source: 'firebase' } });
        const markdown = typeof body === 'string' ? body : undefined;
        ctx.store.set({
          id: doc.id,
          data,
          body: markdown,
          rendered: markdown !== undefined ? await ctx.renderMarkdown(markdown) : undefined,
          digest: ctx.generateDigest({ ...doc.data, date: String(doc.data.date) }),
        });
      }
      ctx.logger.info(`Merged ${docs.length} document(s) from Firestore "${collection}".`);
    },
  };
}
