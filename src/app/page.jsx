import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import StatsStrip from '../components/StatsStrip'
import AboutHome from '../components/About'
import FocusAreas from '../components/Focus'
import QuoteBand from '../components/QuoteBand'
import { CallToAction } from '../components/CallToAction'
import Blog from '../components/Blog'
import Location from '../components/location'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsStrip />
        <AboutHome />
        <FocusAreas />
        <QuoteBand />
        <CallToAction />
        <Blog />
        <Location />
      </main>
      <Footer />
    </>
  )
}
