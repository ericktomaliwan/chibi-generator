import { TinyPetalIcon } from '@/components/TinyPetalIcon'

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-950">
      <TinyPetalIcon
        colors={['fill-gray-950', 'fill-gray-950']}
        className="size-6"
      />
      Chibi Generator
    </span>
  )
}
