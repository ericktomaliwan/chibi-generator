import Link from 'next/link'
import clsx from 'clsx'

import { GridItem, GridRow } from '@/components/home/GridLines'
import { Logo } from '@/components/home/Logo'

const links = [
  { href: '#styles', label: 'Styles' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '/login', label: 'Sign in' },
]

export function Navbar() {
  return (
    <header className="pt-12 sm:pt-16">
      <GridRow className="relative flex justify-between">
        <GridItem className="py-3">
          <Link href="/" title="Home">
            <Logo />
          </Link>
        </GridItem>
        <nav className="relative flex">
          {links.map(({ href, label }) => (
            <GridItem
              key={href}
              // Only "Sign in" fits next to the logo on small screens.
              className={clsx('flex', href.startsWith('#') && 'max-lg:hidden')}
            >
              <Link
                href={href}
                className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply hover:bg-black/2.5"
              >
                {label}
              </Link>
            </GridItem>
          ))}
        </nav>
      </GridRow>
    </header>
  )
}
