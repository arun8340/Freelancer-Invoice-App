import { createClient } from '@supabase/supabase-js'

// Server-only client — never import this in 'use client' files.
// Prefers non-public env vars; falls back to NEXT_PUBLIC_ ones if not set.
const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseServer = createClient(url, key)
