/**
 * About-page data: timeline, skills, languages, awards.
 * Edit freely — these are plain arrays.
 */

export interface TimelineItem {
  period: string;
  title: string;
  org: string;
  kind: 'work' | 'education' | 'award';
  points?: string[];
}

export const timeline: TimelineItem[] = [
  {
    period: 'Jul 2026 – Aug 2026',
    title: 'Application Security Intern',
    org: 'ProgressSoft Corporation · Jordan',
    kind: 'work',
    points: [
      'Hands-on training across 6 security tracks: web app pentesting, digital forensics, AI security, DevOps, SAST/DAST and Bash.',
      'Ran web application penetration tests in lab environments and documented findings with remediation guidance.',
      'Integrated SAST and DAST tooling into CI/CD pipelines to catch vulnerabilities earlier in the SDLC.',
      'Automated recurring security checks and log analysis with Bash.',
    ],
  },
  {
    period: 'Feb 2026 – Aug 2026',
    title: 'Instructor',
    org: 'ITera Academy · Jordan',
    kind: 'work',
    points: [
      'Delivered 5+ cybersecurity workshops reaching 60+ students across schools and universities.',
      'Built hands-on labs covering fundamentals, ethical hacking, web security and CTF challenges.',
    ],
  },
  {
    period: 'Apr 2026',
    title: '1st place — BRK-CYS CTF 2026',
    org: 'Out of 120 teams · 24-hour infrastructure challenge',
    kind: 'award',
  },
  {
    period: 'Mar 2026 – Jun 2026',
    title: 'Cybersecurity Specialist',
    org: 'Zarqa University · Zarqa, Jordan',
    kind: 'work',
    points: [
      'Redeveloped the cybersecurity curriculum to align with industry standards and emerging threats.',
      'Trained and mentored 40+ students across 10 CTF teams.',
      'Managed the Cybersecurity Laboratory and led practical pentest, network security and research projects.',
    ],
  },
  {
    period: 'Feb 2026',
    title: 'B.Sc. in Cyber Security',
    org: 'Zarqa University',
    kind: 'education',
    points: [
      'Coursework: Advanced Cryptography, Offensive Security, Network Defense, Digital Forensics, Secure SDLC.',
    ],
  },
  {
    period: 'Dec 2025',
    title: 'Finalist — Black Hat MEA',
    org: 'Qualified from thousands of competitors worldwide',
    kind: 'award',
  },
  {
    period: 'Feb 2025',
    title: '3rd place — Elite Agents Competition',
    org: 'Attack/defense scenarios against international teams',
    kind: 'award',
  },
  {
    period: 'Jul 2024',
    title: '2nd place — ZUCTF',
    org: 'Out of 45 teams · 24-hour infrastructure challenge',
    kind: 'award',
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Offensive security',
    items: ['Active Directory (Kerberoasting, BloodHound)', 'Web app pentesting (SQLi, XSS, SSRF)', 'Wireless auditing (WPA3, Enterprise)', 'Cloud assessment'],
  },
  {
    group: 'Post-exploitation',
    items: ['Windows/Linux privesc', 'Lateral movement', 'Kerberos attacks', 'Persistence', 'EDR evasion'],
  },
  {
    group: 'Tooling',
    items: ['Burp Suite Pro', 'Metasploit', 'Impacket', 'Mimikatz', 'PowerShell Empire', 'Nmap'],
  },
  {
    group: 'Application security',
    items: ['SAST', 'DAST', 'Secure SDLC', 'DevSecOps', 'CI/CD integration'],
  },
  {
    group: 'Scripting',
    items: ['Python', 'Bash', 'PowerShell', 'OSINT automation'],
  },
  {
    group: 'Analysis',
    items: ['Digital & network forensics', 'Nessus', 'OpenVAS', 'Qualys'],
  },
];

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'Full professional proficiency' },
];

/** Highlight numbers shown on the home page. */
export const stats = [
  { value: '9', label: 'certifications' },
  { value: '1st', label: 'of 120 teams · BRK-CYS CTF' },
  { value: '25+', label: 'lab & exam environments' },
];
