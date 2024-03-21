import Image from 'next/image'
import Link from 'next/link'

export const RichText = {
  types: {
    image: ({ value }) => {
      return (
        <div className="flex items-center justify-center">
          <Image
            src={value}
            alt="Post image"
            width={500}
            height={500}
            className="object-contain py-6"
          />
        </div>
      )
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-10 list-disc space-y-5 py-5">{children}</ul>
    ),
  },
  number: ({ children }) => <ol className="mt-lg list-decimal">{children}</ol>,
  block: {
    h1: ({ children }) => (
      <h1 className="py-10 text-4xl font-bold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="py-10 text-3xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="py-10 text-2xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="py-10 text-2xl font-bold">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-5 border-l-4 border-l-blue-600 py-5 pl-5 ">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startWith('/') ? 'noreferrer noopener' : undefined
      return (
        <Link href={value.href} rel={rel} className="underline">
          {children}
        </Link>
      )
    },
  },
}
