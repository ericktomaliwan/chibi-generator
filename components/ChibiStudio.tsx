'use client'

import { useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import { TinyPetalIcon } from '@/components/TinyPetalIcon'
import {
  MAX_CUSTOM_STYLE_LENGTH,
  QUALITIES,
  STYLES,
  type QualityId,
  type StyleId,
} from '@/lib/styles'

type Chibi = {
  id: string
  createdAt: Date
  styleId: StyleId
  customStyle: string
  details: string
  photoName: string | null
  image: string
}

type Photo = { file: File; url: string }

function UploadIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SectionHeading({
  colors,
  children,
}: {
  colors: Array<string>
  children: React.ReactNode
}) {
  return (
    <h2 className="flex items-center font-mono text-sm/7 font-medium text-slate-900">
      <TinyPetalIcon colors={colors} className="h-3 w-3" />
      <span className="ml-2.5">{children}</span>
    </h2>
  )
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function PhotoPicker({
  photo,
  onChange,
}: {
  photo: Photo | null
  onChange: (file: File | null) => void
}) {
  const [isDragging, setIsDragging] = useState(false)

  if (photo) {
    return (
      <div className="mt-3 flex items-center gap-4 rounded-2xl border border-slate-200 p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
        <img
          src={photo.url}
          alt="Your uploaded photo"
          className="h-20 w-20 flex-none rounded-xl object-cover ring-1 ring-black/10"
        />
        <div className="min-w-0 flex-auto">
          <p className="truncate text-sm/6 font-bold text-slate-900">
            {photo.file.name}
          </p>
          <p className="font-mono text-sm/6 text-slate-500">
            {(photo.file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="flex-none text-sm/6 font-bold text-pink-500 hover:text-pink-700 active:text-pink-900"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        onChange(event.dataTransfer.files[0] ?? null)
      }}
      className={clsx(
        'mt-3 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition',
        isDragging
          ? 'border-pink-400 bg-pink-50'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
      )}
    >
      <UploadIcon className="h-8 w-8 stroke-slate-400" />
      <span className="mt-3 text-base/7 font-bold text-slate-900">
        Drop a photo here, or click to choose one
      </span>
      <span className="mt-1 text-sm/6 text-slate-500">
        PNG, JPEG, or WebP up to 10 MB. A clear, full-body shot works best.
      </span>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
  )
}

function ChibiEntry({
  chibi,
  onRemove,
}: {
  chibi: Chibi
  onRemove: () => void
}) {
  const style = STYLES.find((s) => s.id === chibi.styleId)!
  const title = chibi.customStyle ? 'Custom style' : style.name
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
              download={`chibi-${style.id}-${chibi.createdAt.getTime()}.png`}
              className="text-sm/6 font-bold text-pink-500 hover:text-pink-700 active:text-pink-900"
            >
              Download
            </a>
            <span aria-hidden="true" className="text-sm font-bold text-slate-400">
              /
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="text-sm/6 font-bold text-pink-500 hover:text-pink-700 active:text-pink-900"
            >
              Remove
            </button>
          </div>
        </div>
      </Container>
    </article>
  )
}

function PendingEntry({ styleId }: { styleId: StyleId }) {
  const style = STYLES.find((s) => s.id === styleId)!

  return (
    <article className="py-10 sm:py-12" aria-live="polite">
      <Container>
        <div className="flex flex-col items-start">
          <p className="font-mono text-sm/7 text-slate-500">Generating…</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {style.id === 'custom' ? 'Custom style' : style.name}
          </h3>
          <p className="mt-1 text-base/7 text-slate-700">
            This usually takes 30 to 60 seconds.
          </p>
          <div className="mt-6 aspect-square w-full max-w-md animate-pulse rounded-2xl bg-linear-to-br from-indigo-100 via-violet-100 to-pink-100" />
        </div>
      </Container>
    </article>
  )
}

export function ChibiStudio() {
  const [photo, setPhoto] = useState<Photo | null>(null)
  const [styleId, setStyleId] = useState<StyleId>('capsule')
  const [customStyle, setCustomStyle] = useState('')
  const [qualityId, setQualityId] = useState<QualityId>('medium')
  const [details, setDetails] = useState('')
  const [pendingStyleId, setPendingStyleId] = useState<StyleId | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [chibis, setChibis] = useState<Array<Chibi>>([])

  function selectPhoto(file: File | null) {
    if (photo) URL.revokeObjectURL(photo.url)
    setPhoto(file ? { file, url: URL.createObjectURL(file) } : null)
  }

  async function generate(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPendingStyleId(styleId)

    const body = new FormData()
    if (photo) body.append('photo', photo.file)
    body.append('style', styleId)
    if (styleId === 'custom') body.append('customStyle', customStyle)
    body.append('quality', qualityId)
    body.append('details', details)

    try {
      const response = await fetch('/api/generate', { method: 'POST', body })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result?.image) {
        throw new Error(result?.error ?? 'Something went wrong. Please try again.')
      }
      setChibis((current) => [
        {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          styleId,
          customStyle: styleId === 'custom' ? customStyle.trim() : '',
          details: details.trim(),
          photoName: photo?.file.name ?? null,
          image: result.image,
        },
        ...current,
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setPendingStyleId(null)
    }
  }

  const isPending = pendingStyleId !== null

  return (
    <div className="pt-16 pb-12 sm:pb-4 lg:pt-12">
      <Container>
        <h1 className="text-2xl/7 font-bold text-slate-900">Create your chibi</h1>
        <form onSubmit={generate} className="mt-8 space-y-10">
          <section>
            <SectionHeading colors={['fill-indigo-300', 'fill-blue-300']}>
              Photo
            </SectionHeading>
            <p className="mt-1 text-sm/6 text-slate-500">
              Optional. Skip it to create an original character from your
              description.
            </p>
            <PhotoPicker photo={photo} onChange={selectPhoto} />
          </section>

          <fieldset>
            <legend>
              <SectionHeading colors={['fill-violet-300', 'fill-pink-300']}>
                Style
              </SectionHeading>
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {STYLES.map((style) => (
                <label
                  key={style.id}
                  className={clsx(
                    'cursor-pointer rounded-2xl border p-4 transition has-focus-visible:ring-2 has-focus-visible:ring-pink-400',
                    styleId === style.id
                      ? 'border-pink-400 bg-pink-50/60'
                      : 'border-slate-200 hover:border-slate-300',
                  )}
                >
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={styleId === style.id}
                    onChange={() => setStyleId(style.id)}
                    className="sr-only"
                  />
                  <span className="block text-base/7 font-bold text-slate-900">
                    {style.name}
                  </span>
                  <span className="block text-sm/6 text-slate-600">
                    {style.description}
                  </span>
                </label>
              ))}
            </div>
            {styleId === 'custom' && (
              <div className="mt-4">
                <label
                  htmlFor="custom-style"
                  className="block text-sm/6 font-bold text-slate-900"
                >
                  Your style
                </label>
                <p className="text-sm/6 text-slate-500">
                  How should your chibi look? Describe the material, scene, or
                  art style.
                </p>
                <textarea
                  id="custom-style"
                  rows={5}
                  required
                  maxLength={MAX_CUSTOM_STYLE_LENGTH}
                  value={customStyle}
                  onChange={(event) => setCustomStyle(event.target.value)}
                  placeholder="Knitted plush doll sitting on a wooden shelf, warm cozy lighting"
                  className="mt-3 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-base/7 text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                />
                <p className="mt-2 text-right font-mono text-xs text-slate-500">
                  {customStyle.length} / {MAX_CUSTOM_STYLE_LENGTH}
                </p>
              </div>
            )}
          </fieldset>

          <section>
            <label htmlFor="details">
              <SectionHeading colors={['fill-blue-300', 'fill-indigo-300']}>
                Details
              </SectionHeading>
            </label>
            <p className="mt-1 text-sm/6 text-slate-500">
              {photo
                ? 'Optional extras, like a pose, outfit, or accessory.'
                : 'Describe your character: who they are, what they wear, what they hold.'}
            </p>
            <textarea
              id="details"
              rows={3}
              maxLength={300}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder={
                photo
                  ? 'Holding an iced coffee, wearing a yellow raincoat'
                  : 'A sleepy wizard in purple robes holding a tiny lantern'
              }
              className="mt-3 block w-full rounded-2xl border border-slate-200 px-4 py-3 text-base/7 text-slate-900 placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </section>

          <fieldset>
            <legend>
              <SectionHeading colors={['fill-pink-300', 'fill-violet-300']}>
                Quality
              </SectionHeading>
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {QUALITIES.map((quality) => (
                <label
                  key={quality.id}
                  className={clsx(
                    'flex cursor-pointer items-baseline gap-2 rounded-full border px-4 py-2 transition has-focus-visible:ring-2 has-focus-visible:ring-pink-400',
                    qualityId === quality.id
                      ? 'border-pink-400 bg-pink-50/60'
                      : 'border-slate-200 hover:border-slate-300',
                  )}
                >
                  <input
                    type="radio"
                    name="quality"
                    value={quality.id}
                    checked={qualityId === quality.id}
                    onChange={() => setQualityId(quality.id)}
                    className="sr-only"
                  />
                  <span className="text-sm/6 font-bold text-slate-900">
                    {quality.name}
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    {quality.price}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-pink-500 px-6 py-3 text-base/6 font-bold text-white shadow-lg shadow-pink-500/20 hover:bg-pink-600 active:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? 'Generating…' : 'Generate chibi'}
            </button>
            {error && (
              <p role="alert" className="text-sm/6 font-medium text-red-600">
                {error}
              </p>
            )}
          </div>
        </form>
      </Container>

      {(isPending || chibis.length > 0) && (
        <div className="mt-16">
          <Container>
            <h2 className="text-2xl/7 font-bold text-slate-900">Your chibis</h2>
          </Container>
          <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
            {pendingStyleId && <PendingEntry styleId={pendingStyleId} />}
            {chibis.map((chibi) => (
              <ChibiEntry
                key={chibi.id}
                chibi={chibi}
                onRemove={() =>
                  setChibis((current) => current.filter((c) => c.id !== chibi.id))
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
