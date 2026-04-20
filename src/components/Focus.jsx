'use client'
import { cn } from '../../utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <section className="relative bg-white py-20 sm:py-28 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-block rounded-full bg-[#EBF5EC] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-4">
            Our Agenda
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
            Focus Areas
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Six pillars driving our commitment to a prosperous Kenya
          </p>
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
            className,
          )}
        >
          {items.map((item, idx) => (
            <Link
              href={item?.link}
              key={`${item?.link}-${idx}`}
              className="group relative block h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 block h-full w-full rounded-[12px] bg-[#FBF0F0]"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                  />
                )}
              </AnimatePresence>
              <Card>
                {/* Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#FBF0F0] text-[#C25757] ring-1 ring-[#E2DCDA] group-hover:bg-[#C25757] group-hover:text-white transition-all duration-150">
                  {item.icon}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#C25757] opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  Learn more
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        'relative z-10 h-full w-full overflow-hidden rounded-[12px] p-[20px] bg-white transition-all duration-150 group-hover:border-[#D46868]',
        className,
      )}
      style={{ border: '0.5px solid #E2DCDA' }}
    >
      {children}
    </div>
  )
}

export const CardTitle = ({ className, children }) => {
  return (
    <h4 className={cn('text-[17px] font-medium tracking-tight text-[#111111] mb-3', className)}>
      {children}
    </h4>
  )
}

export const CardDescription = ({ className, children }) => {
  return (
    <p className={cn('text-[15px] leading-[1.75] text-[#5A5450]', className)}>
      {children}
    </p>
  )
}
