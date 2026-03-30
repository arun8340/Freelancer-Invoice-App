import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// SSR-aware server client — reads/writes session from cookies.
// Use this in server components, layouts, and API routes that need the user session.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies can't be set.
            // Session refresh is handled by middleware instead.
          }
        },
      },
    }
  )
}
