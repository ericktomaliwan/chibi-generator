import { PETAL_PATH, SPARKLE_PATH } from '@/components/shapes'

export function TinyPetalIcon({
  colors,
  ...props
}: React.ComponentPropsWithoutRef<'svg'> & {
  colors: Array<string>
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" {...props}>
      <path
        d={PETAL_PATH}
        transform="translate(0 3) rotate(-25 4 4.5) scale(0.85)"
        className={colors[0]}
      />
      <path
        d={SPARKLE_PATH}
        transform="translate(6.5 0) scale(0.55)"
        className={colors[1]}
      />
    </svg>
  )
}
