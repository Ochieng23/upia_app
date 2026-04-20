import BlogContent from './BlogContent'

async function getPosts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/posts?limit=50`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch {
    return []
  }
}

export default async function Posts() {
  const posts = await getPosts()
  return (
    <div className="min-h-screen">
      <BlogContent posts={posts} />
    </div>
  )
}
