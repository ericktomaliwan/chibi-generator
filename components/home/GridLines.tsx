import clsx from 'clsx'

export function GridRow({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={clsx(
        className,
        'group/row relative isolate pt-[calc(--spacing(2)+1px)] last:pb-[calc(--spacing(2)+1px)]',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"
      >
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
        <div className="absolute inset-x-0 bottom-0 hidden border-b border-black/5 group-last/row:block" />
        <div className="absolute inset-x-0 bottom-2 hidden border-b border-black/5 group-last/row:block" />
      </div>
      {children}
    </div>
  )
}

export function GridItem({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={clsx(className, 'group/item relative')}>
      <GridMark
        placement="top left"
        className="hidden group-first/item:block"
      />
      <GridMark placement="top right" />
      <GridMark
        placement="bottom left"
        className="hidden group-first/item:group-last/row:block"
      />
      <GridMark
        placement="bottom right"
        className="hidden group-last/row:block"
      />
      {children}
    </div>
  )
}

function GridMark({
  className,
  placement,
}: {
  className?: string
  placement: `${'top' | 'bottom'} ${'right' | 'left'}`
}) {
  const [yAxis, xAxis] = placement.split(' ')

  return (
    <svg
      viewBox="0 0 15 15"
      aria-hidden="true"
      className={clsx(
        className,
        'absolute size-[15px] fill-black/10',
        yAxis === 'top' ? '-top-2' : '-bottom-2',
        xAxis === 'left' ? '-left-2' : '-right-2',
      )}
    >
      <path d="M8 0H7V7H0V8H7V15H8V8H15V7H8V0Z" />
    </svg>
  )
}
