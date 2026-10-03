import type { Loader, LoaderContext } from 'astro/loaders';
import { createClient } from '@supabase/supabase-js';

interface Options {
  local: Loader;
  table: string;
  where?: { column: string; value: boolean | string };
  bodyField?: string;
}

const env = (key: string): string =>
  ((import.meta.env?.[key] as string | undefined) ?? process.env[key] ?? '').trim();

function configured(): boolean {
  return Boolean(env('PUBLIC_SUPABASE_URL') && env('PUBLIC_SUPABASE_ANON_KEY'));
}

export function withSupabase({ local, table, where, bodyField }: Options): Loader {
  return {
    name: `local+supabase:${table}`,
    load: async (ctx: LoaderContext) => {
      await local.load(ctx);

      if (!configured()) {
        ctx.logger.info(`Supabase not configured — "${ctx.collection}" uses local files only.`);
        return;
      }

      const sb = createClient(env('PUBLIC_SUPABASE_URL'), env('PUBLIC_SUPABASE_ANON_KEY'));

      let query = sb.from(table).select('*');
      if (where) {
        query = query.eq(where.column, where.value);
      }

      const { data: rows, error } = await query;
      if (error) {
        throw new Error(`Supabase query on "${table}" failed: ${error.message}`);
      }

      for (const row of rows ?? []) {
        const { id, [bodyField ?? '']: body, ...rest } = row;
        const docId = String(id);
        const data = await ctx.parseData({ id: docId, data: { ...rest, source: 'supabase' } });
        const markdown = typeof body === 'string' ? body : undefined;
        ctx.store.set({
          id: docId,
          data,
          body: markdown,
          rendered: markdown !== undefined ? await ctx.renderMarkdown(markdown) : undefined,
          digest: ctx.generateDigest({ ...row, date: String(row.date) }),
        });
      }
      ctx.logger.info(`Merged ${(rows ?? []).length} row(s) from Supabase "${table}".`);
    },
  };
}
