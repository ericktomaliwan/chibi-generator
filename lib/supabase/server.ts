import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import { cookieOptions, supabaseEnv } from '@/lib/supabase/config'

// For Route Handlers and Server Actions, which are allowed to write cookies.
export async function createClient() {
  const cookieStore = await cookies()
  const { url, key } = supabaseEnv()

  return createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options),
        )
      },
    },
  })
}
