import Link from 'next/link'
import NewsletterCard from './NewsletterCard'

const GUTTER = 'clamp(18px, 5vw, 72px)'
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Georgia, 'Times New Roman', Times, serif"

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
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function Blog() {
  const posts = await getPosts()
  const [featured, ...briefs] = posts

  return (
    <section id="news" style={{ scrollMarginTop: 106, maxWidth: 1240, margin: '0 auto', padding: `clamp(60px, 7.5vw, 108px) ${GUTTER}` }}>

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between" style={{ gap: '12px 24px', marginBottom: 'clamp(36px, 5vw, 56px)' }}>
        <div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#8A6520', marginBottom: 18 }}>
            News &amp; Press
          </div>
          <h2 style={{ margin: 0, fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(30px, 3.8vw, 50px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#161A14' }}>
            Latest Updates
          </h2>
        </div>
        <Link href="/news" style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: '#0F4D2E', textDecoration: 'none', flexShrink: 0, alignSelf: 'flex-end' }}>
          View all articles →
        </Link>
      </div>

      {posts.length === 0 ? (
        <p style={{ fontFamily: SANS, fontSize: 15, color: '#5C6157', textAlign: 'center', padding: '48px 0' }}>No articles published yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]" style={{ gap: 0 }}>

          {/* Featured article */}
          {featured && (
            <div style={{ paddingRight: 'clamp(24px, 4vw, 48px)', borderRight: '2px solid #161A14' }} className="md:pr-[clamp(24px,4vw,48px)]">
              <article style={{ position: 'relative' }} className="group">
                {featured.coverImage && (
                  <div style={{ aspectRatio: '3/2', overflow: 'hidden', background: '#F1EEE6', marginBottom: 24 }}>
                    <img src={featured.coverImage} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }} className="group-hover:scale-105" />
                  </div>
                )}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                  <time style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#5C6157' }}>
                    {formatDate(featured.publishedAt || featured.createdAt)}
                  </time>
                  {featured.categories?.[0] && (
                    <>
                      <span style={{ color: '#DFDCD1' }}>·</span>
                      <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#B8862B' }}>{featured.categories[0]}</span>
                    </>
                  )}
                </div>
                <h3 style={{ margin: '0 0 14px', fontFamily: SERIF, fontWeight: 400, fontSize: 'clamp(22px, 2.4vw, 28px)', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#161A14' }} className="group-hover:text-[#0F4D2E] transition-colors">
                  <Link href={`/post/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className="absolute inset-0" aria-hidden />
                    {featured.title}
                  </Link>
                </h3>
                {featured.description && (
                  <p style={{ margin: '0 0 20px', fontFamily: SANS, fontSize: 15, lineHeight: 1.68, color: '#3C423A' }} className="line-clamp-3">
                    {featured.description}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: '1px solid #E4E1D6' }}>
                  {featured.author?.imageUrl ? (
                    <img src={featured.author.imageUrl} alt={featured.author.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0F4D2E', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 600, color: '#FBFAF7' }}>{(featured.author?.name?.[0] || 'U').toUpperCase()}</span>
                    </div>
                  )}
                  <span style={{ fontFamily: SANS, fontSize: 12.5, color: '#5C6157' }}>{featured.author?.name || 'UPIA'}</span>
                </div>
              </article>
            </div>
          )}

          {/* Right: briefs + newsletter */}
          <div style={{ paddingLeft: 'clamp(24px, 4vw, 48px)', display: 'flex', flexDirection: 'column', gap: 0 }} className="mt-8 md:mt-0">
            {briefs.slice(0, 3).map((post, i) => (
              <article key={post._id} style={{ position: 'relative', paddingTop: 20, paddingBottom: 20, borderTop: i > 0 ? '1px solid #E4E1D6' : 'none' }} className="group">
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {post.coverImage && (
                    <div style={{ width: 72, height: 60, flexShrink: 0, overflow: 'hidden', background: '#F1EEE6' }}>
                      <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  <div>
                    <time style={{ fontFamily: SANS, fontSize: 10.5, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#5C6157' }}>
                      {formatDate(post.publishedAt || post.createdAt)}
                    </time>
                    <h3 style={{ margin: '5px 0 0', fontFamily: SERIF, fontWeight: 400, fontSize: 16, lineHeight: 1.3, color: '#161A14' }} className="group-hover:text-[#0F4D2E] transition-colors line-clamp-2">
                      <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className="absolute inset-0" aria-hidden />
                        {post.title}
                      </Link>
                    </h3>
                  </div>
                </div>
              </article>
            ))}

            {/* Newsletter card */}
            <div style={{ marginTop: 24 }}>
              <NewsletterCard />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
