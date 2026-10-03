import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | undefined;

export function isConfigured(): boolean {
  return Boolean(url && key);
}

export function supabase(): SupabaseClient {
  if (!isConfigured()) throw new Error('Supabase is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your environment.');
  client ??= createClient(url!, key!);
  return client;
}
