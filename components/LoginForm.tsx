'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'

import { logIn } from '@/app/actions/auth'
import { FIELD_CLASSES, LINK_CLASSES } from '@/components/classNames'

const INPUT_CLASSES = clsx('mt-2', FIELD_CLASSES)

const ERROR_MESSAGES = {
  'invalid-email': 'Enter a valid email address.',
  'wrong-credentials': 'Incorrect email or password.',
  unavailable: "Sign-in isn't available right now. Please try again in a few minutes.",
}

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
  const [state, action, isPending] = useActionState(logIn, null)

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
        autoComplete="username"
        defaultValue={state?.email}
        className={INPUT_CLASSES}
      />
      <label
        htmlFor="password"
        className="mt-4 block text-sm/6 font-bold text-slate-900"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className={INPUT_CLASSES}
      />
      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-full bg-pink-500 px-6 py-3 text-base/6 font-bold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 active:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Please wait…' : 'Sign in'}
      </button>
      {state && state.status !== 'link-sent' && (
        <p role="alert" className="mt-4 text-sm/6 font-medium text-red-600">
          {ERROR_MESSAGES[state.status]}
        </p>
      )}
      {state?.status === 'link-sent' && (
        <p role="status" className="mt-4 text-sm/6 text-slate-700">
          If this email has access, a sign-in link is on its way. It works once
          and expires in an hour.
        </p>
      )}
      <p className="mt-6 text-sm/6 text-slate-500">
        Forgot your password?{' '}
        <button
          type="submit"
          name="intent"
          value="link"
          formNoValidate
          disabled={isPending}
          className={clsx(LINK_CLASSES, 'disabled:cursor-not-allowed disabled:opacity-60')}
        >
          Email me a sign-in link
        </button>
      </p>
    </form>
  )
}
