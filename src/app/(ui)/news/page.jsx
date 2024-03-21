
import { createClient, groq } from 'next-sanity'
import { client } from '../../../components/createClient' // Assuming `client` is exported correctly from `createClient`
import React from 'react'
import BlogContent from '../../../components/BlogContent'
import {Header} from '../../../components/Header'
import Posts from '../../../components/News'
import {Footer} from '../../../components/Footer'
export default function News() {
  return (
    <>
    <Header/>
      <main>
        <Posts />
      </main>
      <Footer />
    </>
  )
}
