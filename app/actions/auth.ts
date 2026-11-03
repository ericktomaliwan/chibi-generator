'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export type LoginState = { status: 'sent' | 'invalid' } | null

const MAX_EMAIL_LENGTH = 254
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function sendLoginLink(
  _previousState: LoginState,
  form: FormData,
): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim()
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { status: 'invalid' }
  }

  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? undefined
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: origin },
  })

  // Uninvited addresses end up here too. Always answer the same way so the form
  // can't be used to find out who has access. Rejections log only their code,
  // because their messages can quote the address.
  if (error) {
    const isRejection = error.status && error.status < 500
    console.error(
      'Login link request failed',
      error.status,
      isRejection ? error.code : error.message,
    )
  }
  return { status: 'sent' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
