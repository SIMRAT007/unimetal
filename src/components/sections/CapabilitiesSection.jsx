import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../../config/collections'
import { useCollection, useSingleton } from '../../hooks/useCms'
import { ArrowRight } from 'lucide-react'

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim()

const shortDesc = (html) => {
  const text = stripHtml(html)
  if (!text) return ''
  return text.length > 80 ? `${text.slice(0, 80)}…` : text
}

const CapabilitiesSection = () => {
  const { data: section, loading: sectionLoading } = useSingleton(COLLECTIONS.capabilitiesSection)
  const { data, loading } = useCollection(COLLECTIONS.capabilities, { activeOnly: true })

  if (sectionLoading || loading) return <div className="section-skeleton" />
  if (section.active === false) return null

  return (
    <section id="capabilities" className="capabilities section">
      <div className="container">
        <div className="capabilities-header">
          {section.heading && <h2 className="capabilities-title">{section.heading}</h2>}
          {section.highlight && <h3 className="capabilities-highlight">{section.highlight}</h3>}
        </div>
        <div className="capabilities-grid">
          {data.map((cap) => (
            <Link key={cap.id} to={`/capabilities/${cap.slug || cap.id}`} className="capability-card">
              <div className="capability-card-media">
                {cap.image && <img src={cap.image} alt={cap.heading || cap.name} />}
              </div>
              <div className="capability-card-body">
                <h3>{cap.heading || cap.name}</h3>
                <p className="capability-card-desc">{shortDesc(cap.description)}</p>
                <div className="capability-card-arrow">
                  <span>Learn more</span>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection
