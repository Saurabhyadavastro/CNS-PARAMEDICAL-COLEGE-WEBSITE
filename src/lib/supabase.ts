import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'CRITICAL DATABASE CONFIGURATION ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing from environment variables. All mock data, demo mode, and local fallbacks have been removed. Configure these variables in your deployment dashboard (or .env file) to connect to Supabase.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
