import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function BlogContent({ posts }) {
  function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
      return text
    }
    const words = text.split(' ')
    const truncatedText = words.slice(0, maxLength).join(' ')
    return truncatedText + '...'
  }

  return (
    <div className="mt-10 flex-col gap-10 bg-slate-100 px-10 py-10  ">
      <span className="hidden font-extrabold text-black">News</span>
      {posts &&
        Array.isArray(posts) &&
        posts.map((post) => (
          <Link
            href={{
              pathname: `/post/${post && post.slug}`, // Add null check for post.slug
              query: { slug: post && post.slug }, // Add null check for post.slug
            }}
            key={post._id}
          >
            <div className="mt-2 flex flex-col gap-10   rounded-md  rounded-br-md rounded-tr-md bg-white duration-200 hover:shadow-md md:flex-row">
              <div className="group relative w-full overflow-hidden rounded-bl-md rounded-tl-md md:w-3/5">
                <Image
                  src={post.mainImage}
                  width={500}
                  height={500}
                  className="max-h-[500px] w-full rounded-bl-md rounded-tl-md object-cover duration-500 group-hover:scale-105"
                  alt="main blog image"
                />
                <div className="absolute left-0 top-0 h-full w-full bg-black/20 duration-200 group-hover:hidden" />
                <div className="absolute bottom-0 left-0 hidden w-full justify-center rounded bg-black bg-opacity-20 p-5 text-white drop-shadow-lg backdrop-blur-lg duration-200 group-hover:inline-flex">
                  <p className="text-lg font-semibold">click to read</p>
                </div>
              </div>
              <div className="flex w-full flex-col justify-between px-8 py-10 md:w-2/5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {post.categories &&
                      post.categories.map((item) => (
                        <p className="text-xs text-green-600" key={item?._id}>
                          {item.title}
                        </p>
                      ))}
                  </div>

                  <h2 className="cursor-pointer text-2xl font-semibold text-black duration-200 hover:text-red-600">
                    {post.title}
                  </h2>

                  <p className="text-gray-500">
                    {truncateText(post.description, 50)}
                  </p>

                  <p className="text-sm font-semibold text-gray-500">
                    {new Date(post._createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex flex-row gap-5">
                    <div>
                      <Image
                        src={post?.author.image}
                        width={200}
                        height={200}
                        alt="author image"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="mt-2 text-sm font-semibold text-red-600">
                        By: {post.author.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default BlogContent
