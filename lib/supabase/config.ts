// The browser never calls Supabase directly, so these settings have no
// NEXT_PUBLIC_ prefix and the session cookies can be hidden from JavaScript.
export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const

export function supabaseEnv() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error('The server is missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY.')
  }
  return { url, key }
}
