import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { withFirestore } from './lib/firestore-loader';

/** Blog posts: src/content/blog/*.md(x)  +  Firestore "posts" (published only). */
const blog = defineCollection({
  loader: withFirestore({
    local: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    collection: 'posts',
    where: { field: 'draft', value: false },
    bodyField: 'body',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    source: z.enum(['local', 'firebase']).default('local'),
  }),
});

/** Projects: src/content/projects/*.md — problem → approach → result. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    link: z.url().optional(),
    repo: z.url().optional(),
    image: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    /** Lower comes first among featured projects. */
    order: z.number().default(100),
    private: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

/** Certifications: src/data/certifications.json  +  Firestore "certifications". */
const certifications = defineCollection({
  loader: withFirestore({
    local: file('src/data/certifications.json'),
    collection: 'certifications',
  }),
  schema: z.object({
    name: z.string(),
    /** Short code shown on the card when there is no badge image, e.g. "CPTS". */
    abbr: z.string(),
    issuer: z.string(),
    date: z.coerce.date().optional(),
    credentialUrl: z.union([z.url(), z.literal('')]).optional(),
    description: z.string().optional(),
    /** Public path of a badge image in /public, e.g. "/certs/cpts.webp". */
    badge: z.string().optional(),
    /** Badge uploaded from /admin (a small WebP data: URL). Served as /badges/<id>.webp at build. */
    badgeData: z.string().optional(),
    /** Lower comes first. */
    order: z.number().default(100),
    source: z.enum(['local', 'firebase']).default('local'),
  }),
});

export const collections = { blog, projects, certifications };
