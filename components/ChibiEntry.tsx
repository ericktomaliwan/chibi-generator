import Image from 'next/image'

import { LINK_CLASSES } from '@/components/classNames'
import { Container } from '@/components/Container'
import { styleTitle, type StyleId } from '@/lib/styles'

export type Chibi = {
  id: string
  createdAt: Date
  styleId: StyleId
  customStyle: string
  details: string
  photoName: string | null
  image: string
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function ChibiEntry({
  chibi,
  onRemove,
}: {
  chibi: Chibi
  onRemove: () => void
}) {
  const title = styleTitle(chibi.styleId)
  const summary = [
    chibi.photoName ? `From ${chibi.photoName}` : 'From a text description',
    chibi.customStyle && `Style: ${chibi.customStyle}`,
    chibi.details,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="py-10 sm:py-12">
      <Container>
        <div className="flex flex-col items-start">
          <h3 className="mt-2 text-lg font-bold text-slate-900">{title}</h3>
          <time
            dateTime={chibi.createdAt.toISOString()}
            className="order-first font-mono text-sm/7 text-slate-500"
          >
            {formatTime(chibi.createdAt)}
          </time>
          <p className="mt-1 text-base/7 text-slate-700">{summary}</p>
          <div className="relative mt-6 w-full max-w-md overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-200">
            <Image
              src={chibi.image}
              alt={`Chibi ${title.toLowerCase()}`}
              width={1024}
              height={1024}
              unoptimized
              className="w-full"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 ring-inset" />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <a
              href={chibi.image}
              download={`chibi-${chibi.styleId}-${chibi.createdAt.getTime()}.png`}
              className={LINK_CLASSES}
            >
              Download
            </a>
            <span aria-hidden="true" className="text-sm font-bold text-slate-400">
              /
            </span>
            <button type="button" onClick={onRemove} className={LINK_CLASSES}>
              Remove
            </button>
          </div>
        </div>
      </Container>
    </article>
  )
}
