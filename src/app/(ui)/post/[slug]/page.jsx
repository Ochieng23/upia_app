import Link from 'next/link'
import { Header } from '../../../../components/Header'
import { Footer } from '../../../../components/Footer'
import { notFound } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const res = await fetch(`${API}/api/posts/slug/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return {}
    const { data } = await res.json()
    return {
      title: data.title,
      description: data.description,
      openGraph: data.coverImage ? { images: [data.coverImage] } : {},
    }
  } catch {
    return {}
  }
}

async function getPost(slug) {
  const res = await fetch(`${API}/api/posts/slug/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.data || null
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden bg-[#14321e]">
          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
              style={{ filter: 'blur(3px) brightness(0.55)' }}
            />
          )}
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.40) 100%)' }} />
          <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
          <div className="absolute -top-10 right-0 h-[200px] w-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />

          <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
            <div className="mx-auto max-w-4xl">
              {post.categories && post.categories.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white"
                      style={{ background: '#C25757' }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-[32px] font-semibold text-white sm:text-4xl lg:text-5xl leading-tight">
                {post.title}
              </h1>
              {post.description && (
                <p className="mt-4 text-[15px] leading-[1.75] text-white/60 max-w-2xl">{post.description}</p>
              )}
              <div className="mt-6 flex items-center gap-3">
                {post.author?.imageUrl ? (
                  <img
                    src={post.author.imageUrl}
                    alt={post.author.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white/30"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {post.author?.name?.[0] || 'U'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white">{post.author?.name || 'UPIA'}</p>
                  {post.author?.title && (
                    <p className="text-xs text-white/60">{post.author.title}</p>
                  )}
                  <time className="text-xs text-white/50">
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex h-1">
            <div className="flex-1 bg-[#C25757]" />
            <div className="flex-1 bg-[#236331]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#111111]" />
          </div>
        </section>

        {/* Content + sidebar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Article body */}
            <article className="lg:col-span-2">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-semibold prose-headings:text-[#111111]
                  prose-p:text-[#5A5450] prose-p:leading-relaxed
                  prose-a:text-[#C25757] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[#111111]
                  prose-blockquote:border-[#C25757] prose-blockquote:text-[#5A5450]
                  prose-img:rounded-[12px]"
                dangerouslySetInnerHTML={{ __html: post.body || '' }}
              />

              {post.categories && post.categories.length > 0 && (
                <div className="mt-12 pt-8 border-t border-[#E2DCDA]">
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-3">Filed Under</p>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="rounded-full px-4 py-1.5 text-sm font-medium text-[#C25757]"
                        style={{ background: '#FBF0F0', border: '0.5px solid #E2DCDA' }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-10">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#C25757] hover:text-[#A84545] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to All News
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author card */}
                <div className="rounded-[12px] bg-white p-6" style={{ border: '0.5px solid #E2DCDA' }}>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450] mb-4">About the Author</p>
                  <div className="flex flex-col items-center text-center">
                    {post.author?.imageUrl ? (
                      <img
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        className="h-20 w-20 rounded-full object-cover ring-4 ring-[#FBF0F0] mb-4"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-[#236331] flex items-center justify-center text-white text-2xl font-semibold mb-4">
                        {post.author?.name?.[0] || 'U'}
                      </div>
                    )}
                    <h3 className="text-[17px] font-medium text-[#111111]">{post.author?.name || 'UPIA Kenya'}</h3>
                    {post.author?.title && (
                      <p className="mt-2 text-sm text-[#5A5450]">{post.author.title}</p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="rounded-[12px] bg-[#6B2626] p-6 text-center">
                  <p className="text-sm font-medium text-white mb-1">Join the Movement</p>
                  <p className="text-xs text-white/50 mb-4">Become a UPIA member today</p>
                  <Link
                    href="/register"
                    className="block w-full rounded-[6px] bg-[#236331] py-3 text-sm font-medium text-white hover:bg-[#2B753A] transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
