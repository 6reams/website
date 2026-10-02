# 00000 — personal security site

A fast, fully static personal site for a cybersecurity portfolio: projects, a blog, browser-based
security tools, certifications and an about/contact section. Built with **Astro**, Markdown/MDX
content collections, plain CSS and a little TypeScript. No UI framework, no trackers, strict CSP.

- **Live:** https://00000.rest
- **Lighthouse:** 100 / 100 / 100 / 100 (performance · accessibility · best-practices · SEO)
- **Tools run 100% in the browser.** Nothing is ever sent to a server.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + static build into dist/  (also writes security headers)
npm run preview    # serve the production build locally
```

Node 22+ recommended (`.nvmrc` is provided).

---

## Edit this first

Everything about *you* lives in **`site.config.ts`** — name, brand, bio, domain, email, social
links, CV path and the accent color. Change it there and it updates across the whole site.

Then review:

| What | Where |
| --- | --- |
| Experience, education, awards (timeline) | `src/data/profile.ts` |
| Skills, languages, home-page stats | `src/data/profile.ts` |
| Certifications | `src/data/certifications.json` |
| Your CV (PDF) | `public/cv/Ahmad_Bilaidi_CV.pdf` |
| Open Graph image | `public/og-default.png` |
| Favicon | `public/favicon.svg` |

The two sample blog posts and the sample project are marked **"Sample"** in their text — edit or
delete them.

---

## How to…

### Add a blog post

Create `src/content/blog/my-post.md` (or `.mdx`):

```md
---
title: 'My post title'
description: 'One-line summary used in listings and meta tags.'
date: 2026-10-02
tags: ['active-directory', 'web']
draft: false          # true = visible in `npm run dev`, hidden from the build
---

## Heading

Write in Markdown. Code blocks are syntax-highlighted.
```

Reading time, the tag pages, the RSS feed and the sitemap update automatically. `updated:` is an
optional extra frontmatter date.

### Add a project

Create `src/content/projects/my-project.md`. The house style is **problem → approach → result**:

```md
---
title: 'Project title'
description: 'Short description for the card.'
tags: ['Python', 'OSINT']
repo: 'https://github.com/you/project'     # optional
link: 'https://demo.example.com'           # optional
date: 2026-10-02
featured: true     # show on the home page
order: 1           # lower = earlier among featured
---

## Problem
## Approach
## Result
```

### Add a certification

Add an object to `src/data/certifications.json`:

```json
{ "id": "oscp", "name": "Offensive Security Certified Professional", "abbr": "OSCP",
  "issuer": "OffSec", "credentialUrl": "https://...", "order": 1,
  "description": "Optional one-liner.", "badge": "/certs/oscp.webp" }
```

`badge` is optional — drop an image in `public/certs/` and point to it, or leave it out to show a
clean text badge with the `abbr`.

### Add a tool

Each tool is one self-contained component. All logic is client-side.

1. Create `src/tools/MyTool.astro` (see the existing tools for the pattern).
2. Register the component in `src/tools/components.ts`.
3. Add an entry to the `tools` array in `src/tools/registry.ts`.

The card on `/tools`, the page at `/tools/<slug>`, routing and SEO are all generated from the
registry. The built-in tools: hash generator, encoder/decoder, JWT decoder, password tools, CIDR
calculator and regex tester.

---

## Optional: manage content from the browser (Firebase)

You can add blog posts and certifications from a private `/admin` page instead of editing files.
This is **optional** — the site builds from local Markdown without it.

**How it works:** Firebase is used *only at build time and in `/admin`*. Visitors never contact
Firebase. The build reads published content from Firestore over its REST API and bakes it into
static HTML. A Firestore document replaces a local entry with the same `id`.

**Setup:**

1. Create a Firebase project and enable **Firestore** and **Email/Password Authentication**.
2. Create your admin user under Authentication → Users.
3. Copy your web config into environment variables (see `.env.example`). These values are **not
   secrets** — Firebase web config is public by design; access is controlled by the rules file.
4. Publish the security rules: `firebase deploy --only firestore:rules` (uses `firestore.rules`).
5. Deploy. Visit `/admin`, sign in, and add content. It appears on the site on the next build.
6. *(Optional)* Set `PUBLIC_DEPLOY_HOOK` to a Cloudflare/Netlify deploy-hook URL so the admin page
   can trigger a rebuild with one button. Otherwise, redeploy manually.

`firestore.rules` makes published posts and certifications world-readable and everything else
admin-only; drafts are never exposed to anonymous readers. `/admin` is `noindex` and excluded from
the sitemap.

---

## Security

This is a security portfolio, so it practices what it preaches:

- **Strict Content-Security-Policy** in `public/_headers`: `default-src 'self'`, no
  `unsafe-inline`, no `unsafe-eval`, no third-party origins, `frame-ancestors 'none'`. Inline
  `<script>`/`<style>` are allowed only by **SHA-256 hash**, computed automatically at build time by
  `src/integrations/csp-hashes.mjs`. The build warns if any markup uses an inline `style=` attribute
  that the CSP would block.
- **Other headers:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, a locked-down `Permissions-Policy`, `Strict-Transport-Security` and
  cross-origin isolation headers.
- **No cookies, no trackers, no third-party scripts.**

### Analytics (off by default)

No analytics are included. If you want some, use a privacy-friendly, cookieless option:

- **Cloudflare Web Analytics** — free, no cookies; enable it in the Cloudflare dashboard (no code).
- **Plausible** or **Umami** (self-hosted) — add the domain to `connect-src`/`script-src` in
  `public/_headers` if you include their script.

---

## Deploy

### Cloudflare Pages (recommended — supports the security headers)

1. Push this repo to GitHub and connect it in the Cloudflare Pages dashboard.
2. Build command: `npm run build` · Output directory: `dist`.
3. Add your `PUBLIC_FIREBASE_*` variables (only if you use Firebase).
4. Add your custom domain `00000.rest` under the project's **Custom domains** tab.

`public/_headers` is applied automatically, so the full CSP and security headers go live.

### GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. Enable Pages (Settings → Pages → Source:
GitHub Actions) and push to `main`. For the custom domain, add a `public/CNAME` file containing
`00000.rest`.

> **Caveat:** GitHub Pages cannot send custom HTTP headers, so the CSP and other headers in
> `_headers` are **not** applied there. The site works, but without those response headers. Use
> Cloudflare Pages if you want them.

---

## Project structure

```
site.config.ts            Identity, links, accent color (edit this first)
astro.config.mjs          Astro config, Shiki theme, integrations
public/
  _headers                Security headers (CSP hashes injected at build)
  robots.txt  favicon.svg  og-default.png
  cv/                     Your CV PDF
  certs/                  Certification badge images (optional)
src/
  content.config.ts       Content collection schemas (blog, projects, certifications)
  content/{blog,projects} Markdown content
  data/                   certifications.json, profile.ts
  lib/                    Firestore reader, content helpers, Firebase client
  layouts/  components/    Base layout, header/footer, cards, SEO
  tools/                  One component per tool + registry.ts + components.ts
  pages/                  Routes (home, blog, projects, tools, certs, about, contact, admin)
  integrations/           Build-time CSP hashing + Shiki-to-classes
  styles/global.css       Design tokens + all styling
firestore.rules           Firestore access rules (optional Firebase)
```

---

Built with [Astro](https://astro.build). Fonts: Inter + JetBrains Mono (self-hosted).
