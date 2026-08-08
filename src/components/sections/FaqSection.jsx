import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../../config/collections'
import { useSingleton } from '../../hooks/useCms'
import { ChevronDown } from 'lucide-react'

const FaqSection = () => {
  const { data, loading } = useSingleton(COLLECTIONS.faq)
  const [openIndex, setOpenIndex] = useState(0)

  if (loading) return <div className="section-skeleton" />
  if (data.active === false) return null
  if (!data.items?.length) return null

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i))

  return (
    <section id="faq" className="faq section" style={data.bgColor ? { backgroundColor: data.bgColor } : undefined}>
      <div className="container">
        <div className="faq-grid">
          <div className="faq-header">
            {data.tag && <span className="section-eyebrow">{data.tag}</span>}
            {data.heading && <h2 className="section-title">{data.heading}</h2>}
            {data.subheading && <p className="section-subtitle">{data.subheading}</p>}

            {(data.ctaHeading || data.ctaSubtext || data.ctaButtonText) && (
              <div className="faq-cta">
                {data.ctaHeading && <h3 className="faq-cta-heading">{data.ctaHeading}</h3>}
                {data.ctaSubtext && <p className="faq-cta-subtext">{data.ctaSubtext}</p>}
                {data.ctaButtonText && (
                  <Link to={data.ctaButtonLink || '/contact'} className="btn btn-primary faq-cta-btn">
                    {data.ctaButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="faq-list">
            {data.items.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div key={i} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button type="button" className="faq-question" onClick={() => toggle(i)}>
                    <span>{item.question}</span>
                    <ChevronDown size={20} className="faq-chevron" />
                  </button>
                  {isOpen && item.answer && (
                    <div className="faq-answer">{item.answer}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
