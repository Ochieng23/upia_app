import clsx from 'clsx'
import { useId } from 'react'

const formClasses =
  'block w-full appearance-none rounded-md border border-[#E2DCDA] bg-[#F8F5F3] px-3 py-2 text-[#111111] placeholder-[#5A5450] focus:border-[#C25757] focus:bg-white focus:outline-none focus:ring-[#C25757] sm:text-sm'

function Label({ id, children }) {
  return (
    <label
      htmlFor={id}
      className="mb-3 block text-sm font-medium text-[#5A5450]"
    >
      {children}
    </label>
  )
}

export function TextField({ label, type = 'text', className, ...props }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input id={id} type={type} {...props} className={formClasses} />
    </div>
  )
}

export function SelectField({ label, className, ...props }) {
  let id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}
