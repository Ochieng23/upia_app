import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'
import '../styles/tailwind.css'
import {Footer} from '../components/Footer'
import {Header} from '../components/Header'

export const metadata = {
  title: {
    template: '%s - UPIA KENYA',
    default: 'UPIA -The best political party in Kenya',
  },
  description: 'A political party bringing about change in Kenya.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      
      <body className="flex h-full flex-col">{children}</body>
      
    </html>
  )
}