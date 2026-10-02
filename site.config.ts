/**
 * site.config.ts — the one file to edit for identity, links and colors.
 * Everything here is used across the whole site (header, footer, SEO, home, about, contact).
 */

export const site = {
  /** Production URL (no trailing slash). Used for canonical URLs, sitemap, RSS and Open Graph. */
  url: 'https://00000.rest',

  /** Brand shown in the header, page titles and the terminal prompt. */
  brand: '00000',

  /** Your real name — used on About, in meta tags and structured data. */
  name: 'Ahmad Bilaidi',

  /** One-line role shown under your name. */
  role: 'Penetration Tester · Offensive Security Specialist',

  /** The one-line intro on the home page. */
  intro: 'I break into systems — with permission — and write about how to keep them shut.',

  /** Short bio (home page + default meta description). Keep it to 2–3 sentences. */
  bio:
    'Penetration tester based in Amman, Jordan, focused on Active Directory and web application security. ' +
    'I hold 9 offensive-security certifications including CPTS, CRTE, CRTP, eMAPT and OSWP, ' +
    'and I like turning complex findings into reports people actually read.',

  location: 'Amman, Jordan',

  /** Contact + social links. Leave a value empty ('') to hide it everywhere. */
  email: 'ahmadbilaidi2@gmail.com',
  socials: {
    github: 'https://github.com/kerbrute',
    linkedin: 'https://www.linkedin.com/in/ahmadbilaidi/',
  },

  /** Path to your CV in /public. Replace the file to update it. */
  cv: '/cv/Ahmad_Bilaidi_CV.pdf',

  /**
   * Optional PGP key. Put your armored public key in /public/pgp.asc and fill these in.
   * The Contact page hides the PGP section while `fingerprint` is empty.
   */
  pgp: {
    fingerprint: '',
    keyUrl: '/pgp.asc',
  },

  /** Terminal prompt on the home page: `${terminalUser}@${brand}:~$` */
  terminalUser: 'ahmad',

  /**
   * Accent color — the only color besides neutrals. Use a darker shade for light mode
   * and a lighter shade for dark mode so both pass WCAG AA contrast.
   */
  accent: {
    light: '#7c3aed',
    dark: '#a78bfa',
  },

  /** Default locale for <html lang> and RSS. */
  lang: 'en',
} as const;

export type SiteConfig = typeof site;
