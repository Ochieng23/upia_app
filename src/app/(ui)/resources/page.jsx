import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Link from 'next/link'

const documents = [
  {
    title: 'UPIA Annual Report & Financial Statements — FY Ended 30th June 2023',
    description:
      'Comprehensive financial statements and annual report for the fiscal year ended 30th June 2023, audited and approved by the party board.',
    href: 'https://drive.google.com/uc?export=download&id=1hhbeMv9xkCgPZtvp71q8mhrq0da5WQQ-',
    type: 'PDF',
    date: 'June 2023',
    size: 'Annual Report',
  },
]

const categories = [
  { name: 'Financial Reports', icon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ), count: 1 },
  { name: 'Party Manifesto', icon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ), count: 0 },
  { name: 'Party Constitution', icon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ), count: 0 },
  { name: 'Press Releases', icon: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ), count: 0 },
]

export default function Resources() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
        <div className="absolute -top-10 right-0 h-[200px] w-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">
            Transparency
          </span>
          <h1 className="text-[32px] font-semibold text-white sm:text-5xl">
            Party Resources
          </h1>
          <p className="mt-4 text-[15px] leading-[1.75] text-white/55 max-w-xl mx-auto">
            Official documents, financial statements, and publications from UPIA Kenya — open to all citizens.
          </p>
        </div>
        <div className="flex h-1">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#111111]" />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="rounded-[12px] bg-white p-5 sm:p-6 md:sticky md:top-20" style={{ border: '0.5px solid #E2DCDA' }}>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-4">Categories</h2>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.name}>
                    <button className="flex w-full items-center justify-between gap-3 rounded-[6px] px-3 py-2.5 text-left text-sm font-medium text-[#5A5450] hover:bg-[#FBF0F0] hover:text-[#C25757] transition-colors duration-150">
                      <span className="flex items-center gap-2">
                        <span className="text-[#5A5450]">{cat.icon}</span>
                        {cat.name}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cat.count > 0 ? 'bg-[#FBF0F0] text-[#C25757]' : 'bg-[#F8F5F3] text-[#5A5450]/50'}`}>
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-[6px] bg-[#EBF5EC] p-4" style={{ border: '0.5px solid #236331' }}>
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#236331] mb-2">Need more?</p>
                <p className="text-xs text-[#184824] mb-3">
                  Contact us to request specific documents or publications.
                </p>
                <Link
                  href="/contact"
                  className="block w-full rounded-[6px] bg-[#236331] px-3 py-2 text-center text-xs font-medium text-white hover:bg-[#2B753A] transition-colors duration-150"
                >
                  Request Document
                </Link>
              </div>
            </div>
          </aside>

          {/* Documents list */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[22px] font-medium text-[#111111]">Financial Statements</h2>
                <p className="text-sm text-[#5A5450] mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} available</p>
              </div>
            </div>

            <div className="space-y-4">
              {documents.map((doc) => (
                <a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-4 rounded-[12px] bg-white p-[20px] transition-all duration-150 hover:border-[#D46868] sm:flex-row sm:items-center"
                  style={{ border: '0.5px solid #E2DCDA' }}
                >
                  {/* File icon */}
                  <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-[8px] bg-[#FBF0F0] ring-1 ring-[#E2DCDA] group-hover:bg-[#C25757] transition-all duration-150">
                    <svg className="h-7 w-7 text-[#C25757] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-[#F8F5F3] px-2.5 py-0.5 text-[11px] font-medium uppercase text-[#5A5450]">
                        {doc.type}
                      </span>
                      <span className="rounded-full bg-[#EBF5EC] px-2.5 py-0.5 text-[11px] font-medium text-[#236331]">
                        {doc.date}
                      </span>
                      <span className="text-xs text-[#5A5450]">{doc.size}</span>
                    </div>
                    <h3 className="text-[15px] font-medium text-[#111111] group-hover:text-[#C25757] transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#5A5450] line-clamp-2">{doc.description}</p>
                  </div>

                  {/* Download icon */}
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#F8F5F3] group-hover:bg-[#C25757] transition-colors duration-150">
                    <svg className="h-5 w-5 text-[#5A5450] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>

            {/* Coming soon */}
            <div className="mt-8 rounded-[12px] border-2 border-dashed border-[#E2DCDA] p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F5F3] mb-4">
                <svg className="h-6 w-6 text-[#5A5450]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-[15px] font-medium text-[#5A5450]">More documents coming soon</h3>
              <p className="mt-1 text-sm text-[#5A5450]/70">
                Additional party publications and reports will be uploaded here as they become available.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
