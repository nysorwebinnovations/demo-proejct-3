import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder')
);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!isSupabaseConfigured) {
      // Fallback dummy client for SSR/unconfigured environments
      client = createClient(
        'https://placeholder-aura-ceylon.supabase.co',
        'placeholder-anon-key',
        {
          auth: { persistSession: false, autoRefreshToken: false },
        }
      );
    } else {
      client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: true, autoRefreshToken: true },
      });
    }
  }
  return client;
}

export const supabase = getSupabase();
