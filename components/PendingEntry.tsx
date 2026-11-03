import { Container } from '@/components/Container'
import { styleTitle, type StyleId } from '@/lib/styles'

export function PendingEntry({ styleId }: { styleId: StyleId }) {
  return (
    <article className="py-10 sm:py-12" aria-live="polite">
      <Container>
        <div className="flex flex-col items-start">
          <p className="font-mono text-sm/7 text-slate-500">Generating…</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {styleTitle(styleId)}
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
