import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Free tier public client. If credentials are empty during development or preview,
// it gracefully logs a warning rather than throwing an unhandled exception.
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id')
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-cns-paramedical.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
