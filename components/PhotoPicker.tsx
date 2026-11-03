'use client'

import { useState } from 'react'
import clsx from 'clsx'

import { LINK_CLASSES } from '@/components/classNames'

export type Photo = { file: File; url: string }

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

export function PhotoPicker({
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
          className={clsx('flex-none', LINK_CLASSES)}
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
