import Link from 'next/link'

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?limit=3`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export default async function Blog() {
  const posts = await getPosts()

  return (
    <section className="bg-[#F8F5F3] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
            Latest Updates
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">
            News &amp; Press
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-[#5A5450]">
            Leaving no one behind — stay informed on UPIA&apos;s latest developments
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-[#5A5450]">No articles published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group relative flex flex-col overflow-hidden bg-white transition-all duration-150 hover:border-[#D46868]"
                style={{ border: '0.5px solid #E2DCDA', borderRadius: '12px' }}
              >
                <div className="relative overflow-hidden h-52">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-[#6B2626]/10 flex items-center justify-center">
                      <span className="text-4xl">📰</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111]/50 to-transparent" />
                  {post.categories && post.categories[0] && (
                    <div className="absolute top-4 left-4">
                      <span className="rounded-full bg-[#C25757] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white">
                        {post.categories[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-[22px]">
                  <time
                    dateTime={post.publishedAt || post.createdAt}
                    className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]"
                  >
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>

                  <h3 className="mt-3 text-[17px] font-medium leading-snug text-[#111111] group-hover:text-[#C25757] transition-colors duration-150">
                    <Link href={`/post/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>

                  <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-[#5A5450] line-clamp-3">
                    {post.description}
                  </p>

                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-[#E2DCDA]">
                    {post.author?.imageUrl ? (
                      <img
                        src={post.author.imageUrl}
                        alt={post.author.name}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[#FBF0F0]"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#236331] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {post.author?.name?.[0] || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{post.author?.name || 'UPIA'}</p>
                      {post.author?.title && (
                        <p className="text-xs text-[#5A5450]">{post.author.title}</p>
                      )}
                    </div>
                    <div className="ml-auto">
                      <span className="flex items-center gap-1 text-xs font-medium text-[#C25757]">
                        Read
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-[6px] border border-[#E2DCDA] px-8 py-3 text-sm font-medium text-[#5A5450] hover:border-[#C25757] hover:text-[#C25757] transition-all duration-150"
          >
            View All News &amp; Articles
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
