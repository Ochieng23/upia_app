'use client'
import { cn } from '../../utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { Container } from './Container'
export const HoverEffect = ({ items, className }) => {
  let [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <Container className=" bg-slate-100">
      <h1 className="py-5 text-center text-2xl font-extrabold text-red-600">
        {' '}
        <span className="">Focus</span> Areas
      </h1>
      <div
        className={cn(
          'grid grid-cols-1 py-7  md:grid-cols-2  lg:grid-cols-3',
          className,
        )}
      >
        {items.map((item, idx) => (
          <Link
            href={item?.link}
            key={item?.link}
            className="group relative  block h-full w-full p-2"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 block h-full w-full rounded-3xl bg-neutral-200  dark:bg-red-600/[0.8]"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>
            <Card>
              <div className="flex items-center gap-5">
                <p>{item.icon}</p>
                <CardTitle>{item.title}</CardTitle>
              </div>

              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}

export const Card = ({ className, children }) => {
  return (
    <div
      className={cn(
        'dark:border-gray/[0.2] relative z-10 h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 group-hover:border-slate-700',
        className,
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
export const CardTitle = ({ className, children }) => {
  return (
    <h4
      className={cn('mt-4 font-extrabold tracking-wide text-black', className)}
    >
      {children}
    </h4>
  )
}
export const CardDescription = ({ className, children }) => {
  return (
    <p
      className={cn(
        'mt-8 text-sm leading-relaxed tracking-wide text-black',
        className,
      )}
    >
      {children}
    </p>
  )
}

export const CardIcon = ({ className, children }) => {
  return (
    <p
      className={cn(
        'mt-8 text-sm leading-relaxed tracking-wide text-white',
        className,
      )}
    >
      {children}
    </p>
  )
}
