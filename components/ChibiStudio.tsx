'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { signOut } from '@/app/actions/auth'
import { ChibiEntry, type Chibi } from '@/components/ChibiEntry'
import { FIELD_CLASSES, LINK_CLASSES } from '@/components/classNames'
import { Container } from '@/components/Container'
import { PendingEntry } from '@/components/PendingEntry'
import { PhotoPicker, type Photo } from '@/components/PhotoPicker'
import { TinyPetalIcon } from '@/components/TinyPetalIcon'
import { MAX_PHOTO_BYTES, shrinkPhoto } from '@/lib/photos'
import {
  MAX_CUSTOM_STYLE_LENGTH,
  MAX_DETAILS_LENGTH,
  QUALITIES,
  STYLES,
  type QualityId,
  type StyleId,
} from '@/lib/styles'

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

    try {
      if (photo && photo.file.size > MAX_PHOTO_BYTES) {
        throw new Error('Photos must be 10 MB or smaller.')
      }

      const body = new FormData()
      if (photo) body.append('photo', await shrinkPhoto(photo.file))
      body.append('style', styleId)
      if (styleId === 'custom') body.append('customStyle', customStyle)
      body.append('quality', qualityId)
      body.append('details', details)

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
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="text-2xl/7 font-bold text-slate-900">Create your chibi</h1>
          <form action={signOut}>
            <button type="submit" className={LINK_CLASSES}>
              Sign out
            </button>
          </form>
        </div>
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
                  className={clsx('mt-3', FIELD_CLASSES)}
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
              maxLength={MAX_DETAILS_LENGTH}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder={
                photo
                  ? 'Holding an iced coffee, wearing a yellow raincoat'
                  : 'A sleepy wizard in purple robes holding a tiny lantern'
              }
              className={clsx('mt-3', FIELD_CLASSES)}
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
