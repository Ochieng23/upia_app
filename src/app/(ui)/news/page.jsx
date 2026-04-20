import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import Posts from '../../../components/News'

export const metadata = { title: 'News & Press' }

export default function NewsPage() {
  return (
    <>
      <Header />
      <main>
        <Posts />
      </main>
      <Footer />
    </>
  )
}
