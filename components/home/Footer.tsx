import Link from 'next/link'

import { Button } from '@/components/home/Button'
import { Container } from '@/components/home/Container'
import { Gradient } from '@/components/home/Gradient'
import { GridItem, GridRow } from '@/components/home/GridLines'
import { Logo } from '@/components/home/Logo'
import { Subheading } from '@/components/home/Text'

const links = [
  { href: '#styles', label: 'Styles' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '/login', label: 'Sign in' },
]

function CallToAction() {
  return (
    <div className="relative pt-20 pb-16 text-center sm:py-24">
      <hgroup>
        <Subheading>Invite-only</Subheading>
        <p className="mt-6 text-3xl font-medium tracking-tight text-gray-950 sm:text-5xl">
          Got an invite?
          <br />
          Go make your chibi.
        </p>
      </hgroup>
      <div className="mt-8">
        <Button className="w-full sm:w-auto" href="/login">
          Sign in
        </Button>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer>
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-4xl bg-white/80" />
        <Container>
          <CallToAction />
          <div className="pb-16">
            <GridRow className="flex flex-col justify-between gap-x-8 sm:flex-row">
              <GridItem className="py-3">
                <Logo />
              </GridItem>
              <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 py-3 text-sm/6">
                {links.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="font-medium text-gray-950 hover:text-gray-950/75"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </GridRow>
          </div>
        </Container>
      </Gradient>
    </footer>
  )
}
