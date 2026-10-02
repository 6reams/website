/**
 * Tool registry — the single list that drives /tools and /tools/[slug].
 *
 * To add a tool:
 *   1. Create src/tools/YourTool.astro (all logic client-side, nothing leaves the browser).
 *   2. Add an entry below with a matching `component` key.
 *   3. Register the component in src/tools/components.ts.
 * That's it — the index card, the page, routing and SEO are generated from this list.
 */

export interface ToolMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Monospace glyph shown on the card. */
  icon: string;
  tags: string[];
  /** Key into the map in components.ts. */
  component: string;
}

export const tools: ToolMeta[] = [
  {
    slug: 'hash',
    name: 'Hash Generator',
    tagline: 'MD5, SHA-1, SHA-256, SHA-512',
    description:
      'Hash text or a file with MD5, SHA-1, SHA-256 and SHA-512. SHA family uses the Web Crypto API; MD5 runs locally too.',
    icon: '#',
    tags: ['crypto', 'hashing'],
    component: 'HashGenerator',
  },
  {
    slug: 'encoder',
    name: 'Encoder / Decoder',
    tagline: 'Base64 · URL · HTML · Hex',
    description: 'Encode and decode Base64, URL percent-encoding, HTML entities and hexadecimal, both directions.',
    icon: '<>',
    tags: ['encoding'],
    component: 'Encoder',
  },
  {
    slug: 'jwt',
    name: 'JWT Decoder',
    tagline: 'Decode header & payload',
    description:
      'Decode a JSON Web Token to inspect its header and claims. Decode only — signatures are never verified and nothing is stored.',
    icon: '{}',
    tags: ['tokens', 'web'],
    component: 'JwtDecoder',
  },
  {
    slug: 'password',
    name: 'Password Tools',
    tagline: 'Generate & check strength',
    description:
      'Generate strong random passwords with the Web Crypto API and estimate strength (entropy and crack-time) as you type.',
    icon: '*',
    tags: ['passwords', 'crypto'],
    component: 'PasswordTool',
  },
  {
    slug: 'cidr',
    name: 'CIDR / Subnet Calculator',
    tagline: 'IPv4 network math',
    description: 'Work out network and broadcast addresses, usable host range, mask and host count from any IPv4 CIDR.',
    icon: '/',
    tags: ['networking'],
    component: 'CidrCalculator',
  },
  {
    slug: 'regex',
    name: 'Regex Tester',
    tagline: 'Test & highlight matches',
    description: 'Test JavaScript regular expressions against sample text with live match highlighting and capture groups.',
    icon: '.*',
    tags: ['regex', 'text'],
    component: 'RegexTester',
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
