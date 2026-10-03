import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { withSupabase } from './lib/supabase-loader';

/** Blog posts: src/content/blog/*.md(x)  +  Supabase "posts" (published only). */
const blog = defineCollection({
  loader: withSupabase({
    local: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    table: 'posts',
    where: { column: 'draft', value: false },
    bodyField: 'body',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    source: z.enum(['local', 'supabase']).default('local'),
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

/** Certifications: src/data/certifications.json  +  Supabase "certifications". */
const certifications = defineCollection({
  loader: withSupabase({
    local: file('src/data/certifications.json'),
    table: 'certifications',
  }),
  schema: z.object({
    name: z.string(),
    abbr: z.string(),
    issuer: z.string(),
    date: z.coerce.date().optional(),
    credentialUrl: z.union([z.url(), z.literal('')]).optional(),
    description: z.string().optional(),
    badge: z.string().optional(),
    badgeData: z.string().optional(),
    order: z.number().default(100),
    source: z.enum(['local', 'supabase']).default('local'),
  }),
});

export const collections = { blog, projects, certifications };
