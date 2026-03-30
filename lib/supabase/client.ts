import { createBrowserClient } from '@supabase/ssr'

// Browser client — safe to use in 'use client' components for auth operations.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
