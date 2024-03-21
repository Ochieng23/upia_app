import React from 'react'
import { groq } from 'next-sanity'
import { client } from '../components/createClient'

export default async function Blog() {
  try {
    const query = groq`
      *[_type == 'post'] | order(_createdAt desc) [0...3] {
        _id,
        _createdAt,
        title,
        description,
        "mainImage": mainImage.asset->url,
        body,
        author-> {
          ..., // Include all fields of the author
          "image": image.asset->url
        },
        "slug": slug.current,
        categories[]->
      }
    `
    const posts = await client.fetch(query)

    return (
      <div className="min-h-screen bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our <span className="text-red-500">Recent News </span>&{' '}
              <span className="text-green-600">Press</span>
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Leaving no one behind
            </p>
          </div>
          <div className=" mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                href={{
                  pathname: `/post/${post && post.slug}`, // Add null check for post.slug
                  query: { slug: post && post.slug }, // Add null check for post.slug
                }}
                key={post._id}
                className=" flex flex-col items-start justify-between"
              >
                <div className="relative w-full">
                  <img
                    src={post?.mainImage}
                    alt=""
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="max-w-xl">
                  <div className="mt-8 flex items-center gap-x-4 text-xs">
                    <time dateTime={post._createdAt} className="text-gray-500">
                      {new Date(post._createdAt).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    {post.category}
                  </div>
                  <div className="group relative">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900  group-hover:text-red-600">
                      <a href={`/post/${post.slug}`}>
                        <span className="absolute inset-0 " />
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                      {post.description}
                    </p>
                  </div>
                  <div className="relative mt-8 flex items-center gap-x-4">
                    <img
                      src={post.author.image}
                      alt=""
                      className="h-10 w-10 rounded-full bg-gray-100"
                    />
                    <div className="text-sm leading-6">
                      <p className="font-semibold text-gray-900">
                        <a href={post.author.href}>
                          <span className="absolute inset-0" />
                          {post.author.name}
                        </a>
                      </p>
                      <p className="text-gray-600">{post.author.role}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching data:', error)
    return <div>Error fetching data</div>
  }
}
