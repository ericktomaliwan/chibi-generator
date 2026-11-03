'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { LINK_CLASSES } from '@/components/classNames'
import { TinyPetalIcon } from '@/components/TinyPetalIcon'

export function AboutSection(props: React.ComponentPropsWithoutRef<'section'>) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section {...props}>
      <h2 className="flex items-center font-mono text-sm/7 font-medium text-slate-900">
        <TinyPetalIcon
          colors={['fill-violet-300', 'fill-pink-300']}
          className="h-3 w-3"
        />
        <span className="ml-2.5">About</span>
      </h2>
      <p
        className={clsx(
          'mt-2 text-base/7 text-slate-700',
          !isExpanded && 'lg:line-clamp-4',
        )}
      >
        Remember when everyone turned themselves into tiny anime figures? Upload
        a photo and get your own chibi back in under a minute: big head, small
        body, sparkly eyes. Pick a capsule toy, sticker, boxed figure, or
        keychain, or describe a style of your own. Photos are sent to OpenAI to make your image and aren&apos;t
        stored here. Your chibis stay in this tab, so download the ones you
        like before you close it.
      </p>
      {!isExpanded && (
        <button
          type="button"
          className={clsx('mt-2 hidden', LINK_CLASSES, 'lg:inline-block')}
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      )}
    </section>
  )
}
