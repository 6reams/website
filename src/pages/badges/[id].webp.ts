import type { APIContext, GetStaticPaths } from 'astro';
import { getCerts } from '@/lib/content';

export const getStaticPaths = (async () => {
  const certs = await getCerts();
  return certs
    .filter((c) => typeof c.data.badgeData === 'string' && c.data.badgeData.startsWith('data:'))
    .map((c) => ({ params: { id: c.id }, props: { data: c.data.badgeData as string } }));
}) satisfies GetStaticPaths;

export function GET({ props }: APIContext) {
  const dataUrl = (props as { data: string }).data;
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const bytes = Buffer.from(base64, 'base64');
  const mime = dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/webp';
  return new Response(new Uint8Array(bytes), {
    headers: { 'Content-Type': mime, 'Cache-Control': 'public, max-age=3600' },
  });
}
