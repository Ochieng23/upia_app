import Link from 'next/link'
import clsx from 'clsx'

/**
 * Variants:   primary | secondary | green | ghost | danger
 * All: 14px / 500 / radius 6px / transition 150ms ease / active:scale-[0.98]
 */
const base =
  'inline-flex items-center justify-center rounded-[6px] px-6 py-[10px] text-[14px] font-medium transition-all duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

const variants = {
  primary:
    'bg-[#C25757] text-white hover:bg-[#A84545] focus-visible:ring-[#C25757]',
  secondary:
    'bg-transparent text-[#C25757] border border-[#C25757] hover:bg-[#FBF0F0] focus-visible:ring-[#C25757]',
  green:
    'bg-[#236331] text-white hover:bg-[#2B753A] focus-visible:ring-[#236331]',
  ghost:
    'bg-transparent text-white border border-white/30 hover:border-white/60 hover:bg-white/8 focus-visible:ring-white',
  danger:
    'bg-transparent text-[#A32D2D] border border-[#A32D2D] hover:bg-[#fdeaea] focus-visible:ring-[#A32D2D]',
}

export function Button({ variant = 'primary', className, href, ...props }) {
  const classes = clsx(base, variants[variant], className)

  if (href !== undefined) {
    return <Link href={href} className={classes} {...props} />
  }
  return <button className={classes} {...props} />
}
