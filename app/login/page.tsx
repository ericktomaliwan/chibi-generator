import { Suspense } from 'react'
import type { Metadata } from 'next'

import { LinkError, LoginForm } from '@/components/LoginForm'
import { PetalBanner } from '@/components/PetalBanner'

export const metadata: Metadata = {
  title: 'Sign in - Chibi Generator',
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <PetalBanner className="absolute top-0 left-0 h-24 w-full" />
      <div className="relative w-full max-w-sm">
        <h1 className="text-2xl/7 font-bold text-slate-900">Chibi Generator</h1>
        <p className="mt-3 text-base/7 text-slate-700">
          This app is invite-only. Enter your email and we&apos;ll send you a
          sign-in link.
        </p>
        <Suspense>
          <LinkError />
        </Suspense>
        <LoginForm />
      </div>
    </main>
  )
}
