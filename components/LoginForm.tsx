'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'

import { sendLoginLink } from '@/app/actions/auth'

export function LinkError() {
  const searchParams = useSearchParams()
  if (searchParams.get('error') !== 'link') return null

  return (
    <p role="alert" className="mt-4 text-sm/6 font-medium text-red-600">
      That sign-in link is invalid or has expired. Request a new one below.
    </p>
  )
}

export function LoginForm() {
  const [state, action, isPending] = useActionState(sendLoginLink, null)

  return (
    <form action={action} className="mt-8">
      <label htmlFor="email" className="block text-sm/6 font-bold text-slate-900">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-base/7 text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-full bg-pink-500 px-6 py-3 text-base/6 font-bold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 active:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending…' : 'Email me a sign-in link'}
      </button>
      {state?.status === 'invalid' && (
        <p role="alert" className="mt-4 text-sm/6 font-medium text-red-600">
          Enter a valid email address.
        </p>
      )}
      {state?.status === 'sent' && (
        <p role="status" className="mt-4 text-sm/6 text-slate-700">
          If this email has access, a sign-in link is on its way. It works once
          and expires in an hour.
        </p>
      )}
    </form>
  )
}
