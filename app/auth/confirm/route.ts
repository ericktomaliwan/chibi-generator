import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

// The sign-in link in the email lands here.
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type')

  if (tokenHash && type === 'email') {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    })
    if (!error) {
      return NextResponse.redirect(new URL('/studio', request.url))
    }
    console.error('Login link rejected', error.status, error.code ?? error.message)
  }

  return NextResponse.redirect(new URL('/login?error=link', request.url))
}
