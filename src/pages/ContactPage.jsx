import { useLocation } from 'react-router-dom'
import ContactSection from '../components/sections/ContactSection'
import CreditApplicationSection from '../components/sections/CreditApplicationSection'

const ContactPage = () => {
  const location = useLocation()
  const product = location.state?.product

  return (
    <>
      <ContactSection product={product} />
      <CreditApplicationSection />
    </>
  )
}

export default ContactPage
