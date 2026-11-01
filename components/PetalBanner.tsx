import { useId } from 'react'
import clsx from 'clsx'

import { PETAL_PATH, SPARKLE_PATH } from '@/components/shapes'

// Deterministic so the server and client render the same layout.
function seededRandom(seed = 1) {
  return () => {
    const rand = Math.sin(seed++) * 10000
    return rand - Math.floor(rand)
  }
}

export function PetalBanner({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) {
  const id = useId()
  const random = seededRandom(7)
  const tile = { width: 420, height: 96 }

  const shapes = Array.from({ length: 18 }, (_, index) => {
    const isSparkle = index % 3 === 0
    return {
      path: isSparkle ? SPARKLE_PATH : PETAL_PATH,
      x: 16 + random() * (tile.width - 32),
      y: 10 + random() * (tile.height - 30),
      size: isSparkle ? 9 + random() * 7 : 11 + random() * 9,
      rotate: isSparkle ? 0 : random() * 360,
    }
  })

  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'mask-[linear-gradient(to_bottom,black_35%,transparent)]',
        className,
      )}
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-gradient`}>
          <stop offset="0%" stopColor="#4989E8" />
          <stop offset="50%" stopColor="#6159DA" />
          <stop offset="100%" stopColor="#FF54AD" />
        </linearGradient>
        <pattern
          id={`${id}-pattern`}
          width={tile.width}
          height={tile.height}
          patternUnits="userSpaceOnUse"
        >
          {shapes.map((shape, index) => (
            <path
              key={index}
              d={shape.path}
              fill="white"
              transform={`translate(${shape.x} ${shape.y}) rotate(${shape.rotate}) scale(${shape.size / 10}) translate(-5 -5)`}
            />
          ))}
        </pattern>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-pattern)`} />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-gradient)`}
        mask={`url(#${id}-mask)`}
        opacity="0.45"
      />
    </svg>
  )
}
