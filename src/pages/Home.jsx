import { Helmet } from 'react-helmet-async'
import Hero from '../components/sections/Hero'
import CategoriesSection from '../components/sections/CategoriesSection'
import CapabilitiesSection from '../components/sections/CapabilitiesSection'
import AboutSection from '../components/sections/AboutSection'
import FaqSection from '../components/sections/FaqSection'
import ContactSection from '../components/sections/ContactSection'
import CreditApplicationSection from '../components/sections/CreditApplicationSection'

const Home = () => (
  <>
    <Helmet>
      <title>Unimetal | Premium Metal Hardware</title>
      <meta name="description" content="Unimetal is a leading manufacturer of metal brackets, clamps, and hardware for industrial and commercial use." />
    </Helmet>

    <Hero />
    <AboutSection />
    <CapabilitiesSection />
    <CategoriesSection />
    <FaqSection />
    <ContactSection />
    <CreditApplicationSection />
  </>
)

export default Home
