import Link from 'next/link'

export function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-[6px] px-2 py-1 text-sm font-medium text-[#5A5450] hover:bg-[#FBF0F0] hover:text-[#C25757] transition-colors duration-150"
    >
      {children}
    </Link>
  )
}
