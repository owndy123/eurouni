import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// In development without Supabase configured, we use mock data
// This allows the app to work without any Supabase setup
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Only create client if configured - but don't create at module load time
// to avoid SSR issues
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null
  }
  
  if (!_supabase) {
    _supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  
  return _supabase
}

// For backward compatibility - returns null if not configured
export const supabase = isSupabaseConfigured ? getSupabase() : null

export default supabase
