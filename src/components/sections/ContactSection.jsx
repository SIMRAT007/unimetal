import { COLLECTIONS } from '../../config/collections'
import { useSingleton } from '../../hooks/useCms'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import ContactForm from '../ContactForm'
import PageLoader from '../PageLoader'
import logo from '../../assets/logo.png'

const ContactSection = ({ product }) => {
  const { data, loading } = useSingleton(COLLECTIONS.contact)
  const { data: nav, loading: navLoading } = useSingleton(COLLECTIONS.navbar)

  if (loading || navLoading) return <PageLoader />
  if (data.active === false) return null
  if (!data.heading) return null

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <div className="contact-header">
          {data.tag && <span className="section-eyebrow">{data.tag}</span>}
          <h2 className="section-title">{data.heading}</h2>
          {data.subheading && <p className="section-subtitle">{data.subheading}</p>}
        </div>

        <div className="contact-grid">
          <div className="contact-card contact-info">
            <div className="contact-info-header">
              <img src={nav?.logo || logo} alt={nav?.logoText || ''} className="contact-info-logo" />
              {nav?.logoText && <h3>{nav.logoText}</h3>}
            </div>
            {data.infoText && (
              <p className="contact-info-desc">
                {data.infoText}
              </p>
            )}

            <div className="contact-info-items">
              {data.email && (
                <a className="contact-item" href={`mailto:${data.email}`}>
                  <span className="contact-icon"><Mail size={20} strokeWidth={2.5} /></span>
                  <span className="contact-text">
                    <strong>Email Us</strong>
                    <span>{data.email}</span>
                  </span>
                </a>
              )}
              {data.phone && (
                <a className="contact-item" href={`tel:${data.phone.replace(/\s/g, '')}`}>
                  <span className="contact-icon"><Phone size={20} strokeWidth={2.5} /></span>
                  <span className="contact-text">
                    <strong>Call Us</strong>
                    <span>{data.phone}</span>
                  </span>
                </a>
              )}
              {data.address && (
                <a className="contact-item" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`} target="_blank" rel="noreferrer">
                  <span className="contact-icon"><MapPin size={20} strokeWidth={2.5} /></span>
                  <span className="contact-text">
                    <strong>Visit Us</strong>
                    <span>{data.address}</span>
                  </span>
                </a>
              )}
              {data.hours && (
                <div className="contact-item">
                  <span className="contact-icon"><Clock size={20} strokeWidth={2.5} /></span>
                  <span className="contact-text">
                    <strong>Business Hours</strong>
                    <span>{data.hours}</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="contact-card contact-form-wrap">
            {data.formHeading && <h3>{data.formHeading}</h3>}
            {data.formDescription && <p className="contact-form-desc">{data.formDescription}</p>}
            <ContactForm source="contact-section" product={product} />
          </div>

          {data.map && (
            <div className="contact-map">
              <iframe src={data.map} title="Map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ContactSection
