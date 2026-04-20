import { Inter } from 'next/font/google'
import clsx from 'clsx'
import '../styles/tailwind.css'
import { AuthProvider } from '../context/AuthContext'

export const metadata = {
  title: {
    template: '%s - UPIA KENYA',
    default: 'UPIA - The best political party in Kenya',
  },
  description: 'A political party bringing about change in Kenya.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx('h-full scroll-smooth antialiased', inter.variable)}
    >
      <body className="flex h-full flex-col bg-[#F8F5F3]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
