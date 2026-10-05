import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Supabase environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  ''
).trim();

// Determine if valid Supabase credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project.supabase.co'
);

// Create and export singleton client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

/**
 * Helper to get active Supabase client with graceful runtime error if not configured
 */
export function getSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env.local file.');
  }
  return supabase;
}
