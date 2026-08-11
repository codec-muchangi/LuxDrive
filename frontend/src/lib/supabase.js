/**
 * LUXDRIVE — Supabase Client
 *
 * This is the frontend Supabase client.
 * It uses ONLY the public anon key — never the service role key.
 * The service role key lives exclusively in the FastAPI backend.
 *
 * Usage:
 *   import { supabase } from '@/lib/supabase'
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: VITE_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage between page refreshes
    persistSession: true,
    // Auto-refresh the JWT token before it expires
    autoRefreshToken: true,
    // Detect session from URL hash (used for email confirmation/password reset links)
    detectSessionInUrl: true,
    // Storage key prefix
    storageKey: 'luxdrive-auth',
  },
  global: {
    headers: {
      'x-application': 'luxdrive-frontend',
    },
  },
})
