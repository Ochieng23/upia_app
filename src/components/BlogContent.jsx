import Link from 'next/link'

function truncate(text, words = 40) {
  if (!text) return ''
  const parts = text.split(' ')
  return parts.length <= words ? text : parts.slice(0, words).join(' ') + '…'
}

export default function BlogContent({ posts }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#14321e] pt-[60px]">
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, rgba(35,99,49,0.18) 0%, rgba(35,99,49,0.14) 50%, rgba(20,60,30,0.16) 100%)' }} />
        <div className="absolute -bottom-16 -left-16 h-[280px] w-[280px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(107,38,38,0.50) 0%, transparent 70%)' }} />
        <div className="absolute -top-10 right-0 h-[200px] w-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(194,87,87,0.25) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-white/60 mb-4">
            News &amp; Press
          </span>
          <h1 className="text-[32px] font-semibold text-white sm:text-5xl">All Articles</h1>
          <p className="mt-3 text-[15px] leading-[1.75] text-white/55">
            Stay up to date with the latest from UPIA Kenya
          </p>
        </div>
        <div className="flex h-1">
          <div className="flex-1 bg-[#C25757]" />
          <div className="flex-1 bg-[#236331]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#111111]" />
        </div>
      </section>

      {/* Posts list */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-[#5A5450] py-16">No articles published yet.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <Link href={`/post/${post.slug}`} key={post._id} className="group block">
                <div
                  className="flex flex-col overflow-hidden bg-white transition-all duration-150 hover:border-[#D46868] md:flex-row"
                  style={{ borderRadius: '12px', border: '0.5px solid #E2DCDA' }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden md:h-auto md:w-72 lg:w-96 flex-shrink-0">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-[#6B2626]/10 flex items-center justify-center">
                        <span className="text-5xl">📰</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 hidden items-center justify-center bg-[#C25757]/90 py-3 group-hover:flex">
                      <span className="text-sm font-medium text-white">Read Article</span>
                      <svg className="ml-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col justify-between p-[22px] lg:p-8">
                    <div>
                      {post.categories && post.categories.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {post.categories.map((cat) => (
                            <span
                              key={cat}
                              className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757]"
                              style={{ background: '#FBF0F0' }}
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      <h2 className="text-[22px] font-medium leading-snug text-[#111111] group-hover:text-[#C25757] transition-colors duration-150">
                        {post.title}
                      </h2>

                      <p className="mt-3 text-[15px] leading-[1.75] text-[#5A5450]">
                        {truncate(post.description)}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E2DCDA]">
                      <div className="flex items-center gap-3">
                        {post.author?.imageUrl ? (
                          <img
                            src={post.author.imageUrl}
                            alt={post.author.name}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-[#FBF0F0]"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-[#236331] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {post.author?.name?.[0] || 'U'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{post.author?.name || 'UPIA'}</p>
                          <p className="text-xs text-[#5A5450]">
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#C25757]">
                        Continue Reading
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
