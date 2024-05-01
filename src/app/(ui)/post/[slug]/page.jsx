import { client } from '../../../../components/createClient'
import { groq } from 'next-sanity'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import RichText from '../../../../components/RichText'
import { Container } from '../../../../components/Container'
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa'
import {Header} from '../../../../components/Header'
import {Footer} from '../../../../components/Footer'

export const generateStaticParams = async () => {
  const query = groq`*[_type =='post']{
        slug
    }`
  const slugs = await client.fetch(query)
  const slugRoutes = slugs.map((slug) => slug?.slug.current)
  return slugRoutes.map((slug) => ({
    params: { slug },
  }))
}

async function SlugPage({ params: { slug } }) {
  const query = groq`
    *[_type == 'post' && slug.current == $slug] {
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
    } | order(_createdAt desc) [0]
  `

  const post = await client.fetch(query, { slug })
  console.log(post)
  return (
    <>
    <Header/>
      <main className="mb-10    bg-white">
        <Container className="mb-10 flex   items-center">
          <div className="relative w-full md:w-2/3">
            <Image
              src={post.mainImage}
              width={500}
              height={500}
              alt="main image"
              className="w-full object-cover opacity-70"
            />
            <div className="absolute  bottom-0 left-0 right-0 top-0 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-black">{post.title}</h1>
            </div>
          </div>

          <div className="hidden w-1/3 flex-col items-center gap-5 px-4 md:inline-flex">
            <Image
              src={post.author.image}
              width={200}
              height={200}
              alt="author image"
              className="h-32 w-32 rounded-full object-cover"
            />
            <p className="text-2xl font-semibold  text-[#5442ae]">
              {post.author.name}
            </p>
            <p className="text-center text-sm tracking-wide text-black">
              {post.author.description}
            </p>
            <div className="flex items-center gap-3">
              <Link
                href={
                  'https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA'
                }
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-xl text-white duration-200 hover:bg-[#5442ae]"
              >
                <FaYoutube />
              </Link>
              <Link
                href={
                  'https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA'
                }
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-xl text-white duration-200 hover:bg-[#5442ae]"
              >
                <FaGithub />
              </Link>
              <Link
                href={
                  'https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA'
                }
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3e5b98] text-xl text-white duration-200 hover:bg-[#5442ae]"
              >
                <FaFacebookF />
              </Link>
              <Link
                href={
                  'https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA'
                }
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#bc1888] text-xl text-white duration-200 hover:bg-[#5442ae]"
              >
                <FaInstagram />
              </Link>
              <Link
                href={
                  'https://www.youtube.com/channel/UChkOsij0dhgft0GhHRauOAA'
                }
                target="blank"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-xl text-white duration-200 hover:bg-[#5442ae]"
              >
                <FaLinkedin />
              </Link>
            </div>
          </div>
        </Container>
        <Container className="">
          <PortableText value={post.body} components={RichText} />
        </Container>
      </main>
      <Footer/>
    </>
  )
}

export default SlugPage
