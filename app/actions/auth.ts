'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { AuthError } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'

export type LoginState = {
  status: 'link-sent' | 'invalid-email' | 'wrong-credentials' | 'unavailable'
  email: string
} | null

const MAX_EMAIL_LENGTH = 254
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Rejections log only their code, because their messages can quote the address.
function logAuthError(label: string, error: AuthError) {
  const isRejection = error.status && error.status < 500
  console.error(
    label,
    error.status,
    isRejection ? (error.code ?? error.name) : error.message,
  )
}

export async function logIn(
  _previousState: LoginState,
  form: FormData,
): Promise<LoginState> {
  const email = String(form.get('email') ?? '').trim()
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { status: 'invalid-email', email }
  }

  return form.get('intent') === 'link'
    ? sendLoginLink(email)
    : signIn(email, String(form.get('password') ?? ''))
}

async function signIn(email: string, password: string): Promise<LoginState> {
  if (!password) return { status: 'wrong-credentials', email }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    logAuthError('Sign-in failed', error)
    const isOutage = !error.status || error.status >= 500 || error.status === 429
    return { status: isOutage ? 'unavailable' : 'wrong-credentials', email }
  }

  redirect('/studio')
}

async function sendLoginLink(email: string): Promise<LoginState> {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') ?? undefined
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: origin },
  })

  // Uninvited addresses end up here too. Always answer the same way so the form
  // can't be used to find out who has access.
  if (error) logAuthError('Login link request failed', error)
  return { status: 'link-sent', email }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
