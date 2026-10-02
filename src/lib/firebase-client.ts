/**
 * Browser-side Firebase, used ONLY by /admin.
 * The public site never imports this — it reads Firestore at build time over REST.
 *
 * Firebase web config values are not secrets (they identify the project, they don't
 * authorise anything). Access control lives in firestore.rules.
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;

export function isConfigured(): boolean {
  return Boolean(config.apiKey && config.projectId);
}

export function firebase(): { app: FirebaseApp; auth: Auth; db: Firestore } {
  if (!isConfigured()) throw new Error('Firebase is not configured. Set PUBLIC_FIREBASE_* in your environment.');
  app ??= initializeApp(config);
  return { app, auth: getAuth(app), db: getFirestore(app) };
}

/** Optional: a Cloudflare Pages / Netlify deploy hook URL to trigger a rebuild after publishing. */
export const DEPLOY_HOOK: string = import.meta.env.PUBLIC_DEPLOY_HOOK ?? '';
