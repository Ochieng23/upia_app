import Link from 'next/link'

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?limit=4`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function AuthorChip({ post }) {
  return (
    <div className="flex items-center gap-2">
      {post.author?.imageUrl ? (
        <img
          src={post.author.imageUrl}
          alt={post.author.name}
          className="h-7 w-7 rounded-full object-cover ring-2 ring-[#FBF0F0]"
        />
      ) : (
        <div className="h-7 w-7 rounded-full bg-[#236331] flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0">
          {post.author?.name?.[0] || 'U'}
        </div>
      )}
      <span className="text-[12px] font-medium text-[#5A5450]">{post.author?.name || 'UPIA'}</span>
    </div>
  )
}

export default async function Blog() {
  const posts = await getPosts()
  const [featured, ...briefs] = posts

  return (
    <section id="news" className="bg-white py-20 sm:py-28 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
          <div>
            <span className="inline-block rounded-full bg-[#FBF0F0] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#C25757] mb-4">
              Latest Updates
            </span>
            <h2 className="text-[32px] font-semibold tracking-tight text-[#111111]">News &amp; Press</h2>
            <p className="mt-2 text-[15px] text-[#5A5450]">Stay informed on UPIA&apos;s latest developments</p>
          </div>
          <Link
            href="/news"
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-[6px] border border-[#E2DCDA] px-5 py-2.5 text-sm font-medium text-[#5A5450] hover:border-[#C25757] hover:text-[#C25757] transition-all duration-150"
          >
            All Articles
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-[#5A5450] py-12">No articles published yet.</p>
        ) : briefs.length === 0 ? (
          /* Only one post — show it wide */
          <FeaturedCard post={featured} wide />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-rows-1">
            {/* Featured — takes 2 of 3 columns */}
            <div className="lg:col-span-2">
              <FeaturedCard post={featured} />
            </div>
            {/* Brief list — 1 of 3 columns */}
            <div className="flex flex-col gap-4">
              {briefs.slice(0, 3).map((post) => (
                <BriefCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedCard({ post, wide }) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden bg-white h-full rounded-[12px]"
      style={{ border: '0.5px solid #E2DCDA' }}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '52%' }}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B2626]/15 to-[#236331]/10 flex items-center justify-center">
            <span className="text-5xl opacity-40">📰</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111]/60 via-transparent to-transparent" />
        {post.categories?.[0] && (
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-[#C25757] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-white">
              {post.categories[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <time className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">
          {formatDate(post.publishedAt || post.createdAt)}
        </time>
        <h3 className="mt-3 text-[20px] sm:text-[22px] font-semibold leading-snug text-[#111111] group-hover:text-[#C25757] transition-colors">
          <Link href={`/post/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-[1.75] text-[#5A5450] line-clamp-3">
          {post.description}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-[#E2DCDA] pt-4">
          <AuthorChip post={post} />
          <span className="flex items-center gap-1 text-[12px] font-semibold text-[#C25757]">
            Read more
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  )
}

function BriefCard({ post }) {
  return (
    <article
      className="group relative flex gap-4 bg-white rounded-[12px] p-4 transition-all duration-150 hover:border-[#D46868]"
      style={{ border: '0.5px solid #E2DCDA' }}
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-[8px] bg-[#F8F5F3]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-2xl opacity-30">📰</div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col min-w-0">
        <time className="text-[10px] font-medium uppercase tracking-[0.07em] text-[#5A5450]">
          {formatDate(post.publishedAt || post.createdAt)}
        </time>
        <h3 className="mt-1 text-[14px] font-semibold leading-snug text-[#111111] group-hover:text-[#C25757] transition-colors line-clamp-2">
          <Link href={`/post/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden />
            {post.title}
          </Link>
        </h3>
        <p className="mt-1 text-[12px] leading-[1.6] text-[#5A5450] line-clamp-2">
          {post.description}
        </p>
      </div>
    </article>
  )
}
