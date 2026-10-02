import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;
export type Project = CollectionEntry<'projects'>;
export type Cert = CollectionEntry<'certifications'>;

/** Drafts show up in `astro dev` but never in production builds. */
const visible = (draft: boolean) => import.meta.env.DEV || !draft;

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => visible(data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => visible(data.draft));
  return projects.sort((a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getCerts(): Promise<Cert[]> {
  const certs = await getCollection('certifications');
  return certs.sort((a, b) => a.data.order - b.data.order || (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0));
}

/** Public URL of a certification's badge image, if any. */
export function badgeUrl(cert: Cert): string | undefined {
  if (cert.data.badge) return cert.data.badge;
  if (cert.data.badgeData) return `/badges/${cert.id}.webp`;
  return undefined;
}

export function readingTime(markdown = ''): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, (block) => block.split(/\s+/).slice(0, 40).join(' ')) // code reads faster
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~\-[\]()!]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export function allTags(posts: Post[]): { tag: string; slug: string; count: number }[] {
  const map = new Map<string, { tag: string; count: number }>();
  for (const p of posts) {
    for (const tag of p.data.tags) {
      const slug = slugify(tag);
      const cur = map.get(slug);
      map.set(slug, { tag: cur?.tag ?? tag, count: (cur?.count ?? 0) + 1 });
    }
  }
  return [...map.entries()].map(([slug, v]) => ({ slug, ...v })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
