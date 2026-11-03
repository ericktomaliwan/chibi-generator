import Link from 'next/link'
import clsx from 'clsx'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-full border border-transparent bg-gray-950 shadow-md',
    'text-base font-medium whitespace-nowrap text-white',
    'hover:bg-gray-800',
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-full border border-transparent bg-white/15 shadow-md ring-1 ring-[#D15052]/15',
    'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_#ffffff4d]',
    'text-base font-medium whitespace-nowrap text-gray-950',
    'hover:bg-white/20',
  ),
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: {
  variant?: keyof typeof variants
} & React.ComponentPropsWithoutRef<typeof Link>) {
  return <Link {...props} className={clsx(className, variants[variant])} />
}
