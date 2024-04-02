
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import Location from '../components/location'
import AboutHome from '../components/About'
import Blog from '../components/Blog'
import { HoverEffect } from '../components/Focus'
import {
  FaBalanceScaleRight,
  FaClinicMedical,
  FaBuilding,
  FaRegSnowflake,
  FaDonate,
  FaGraduationCap,
} from 'react-icons/fa'


const items = [
  {
    title: 'Equality',
    description:
      "Equality means everyone having the same rights, opportunities, and treatment, regardless of background or traits. It's about fairness, not everyone getting the exact same thing.",
    link: '/item1',
    icon: <FaBalanceScaleRight className="h-10 w-10 " />,
  },
  {
    title: 'Economic Empowerment',
    description:
      'Economic empowerment is gaining control over your financial resources, giving you the power to make your own choices and improve your life.',
    link: '/item2',
    icon: <FaDonate className="h-10 w-10" />,
  },
  {
    title: 'Education',
    description:
      'High-quality education ignites curiosity, fosters critical thinking, and equips students with the knowledge and skills to thrive in a changing world.',
    link: '/item1',
    icon: <FaGraduationCap className="h-10 w-10" />,
  },
  {
    title: 'Eradication of Corruption',
    description:
      'Eradicating corruption means eliminating dishonest acts for personal gain, fostering a system of transparency and accountability.',
    link: '/item2',
    icon: <FaBuilding className="h-10 w-10" />,
  },
  {
    title: 'Universal Healthcare',
    description:
      'Universal healthcare ensures everyone gets the medical treatment they need, without facing financial hardship.',
    link: '/item1',
    icon: <FaClinicMedical className="h-10 w-10" />,
  },
  {
    title: 'Climate Change',
    description:
      "Earth's climate is heating up, mainly due to greenhouse gases trapping heat. This disrupts weather patterns, causing rising seas, extreme weather, and harm to ecosystems.",
    link: '/item2',
    icon: <FaRegSnowflake className="h-10 w-10" />,
  },
  // Add more items as needed
]

export default function Home() {
  return (
    <>
      <Header  />
      <main>
    
        <Hero />
        <AboutHome />
        <HoverEffect items={items} />
        <CallToAction />
        <Location />
        <Blog />
      </main>
      <Footer />
    </>
  )
}
