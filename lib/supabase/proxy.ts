import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import { cookieOptions, supabaseEnv } from '@/lib/supabase/config'

const PUBLIC_PATHS = ['/', '/login', '/auth/confirm']
const CACHE_HEADERS = ['cache-control', 'expires', 'pragma']

// Refreshes the session and sends signed-out visitors to the login page. This
// only guards page navigation: /api/generate does its own check.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, key } = supabaseEnv()

  const supabase = createServerClient(url, key, {
    cookieOptions,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
        Object.entries(headers).forEach(([name, value]) =>
          response.headers.set(name, value),
        )
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const isSignedIn = Boolean(data?.claims)
  const { pathname } = request.nextUrl

  if (!isSignedIn && !PUBLIC_PATHS.includes(pathname)) {
    return redirectWithSession(request, response, '/login')
  }
  if (isSignedIn && pathname === '/login') {
    return redirectWithSession(request, response, '/studio')
  }
  return response
}

// A redirect is a new response, so it has to carry over any refreshed cookies.
function redirectWithSession(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const redirect = NextResponse.redirect(new URL(pathname, request.url))
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
  CACHE_HEADERS.forEach((name) => {
    const value = response.headers.get(name)
    if (value) redirect.headers.set(name, value)
  })
  return redirect
}
