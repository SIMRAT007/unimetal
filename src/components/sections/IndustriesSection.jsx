import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Factory } from 'lucide-react'
import { COLLECTIONS } from '../../config/collections'
import { useCollection, useSingleton } from '../../hooks/useCms'

const IndustryIcon = ({ src, name }) => {
  const [error, setError] = useState(false)
  if (!src || error) {
    return (
      <span className="industries-icon industries-icon-fallback" aria-label={name}>
        <Factory size={120} strokeWidth={1} />
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={name}
      className="industries-icon"
      onError={() => setError(true)}
      loading="lazy"
    />
  )
}

const IndustriesSection = () => {
  const { data: section, loading: sectionLoading } = useSingleton(COLLECTIONS.industriesSection)
  const { data, loading } = useCollection(COLLECTIONS.industries, { activeOnly: true })

  if (sectionLoading || loading) return <div className="section-skeleton" />
  if (section.active === false) return null

  return (
    <section id="industries" className="industries section">
      <div className="container">
        <div className="industries-header">
          {section.heading && <h2 className="industries-title">{section.heading}</h2>}
          {section.highlight && <h3 className="industries-highlight">{section.highlight}</h3>}
        </div>
        <div className="industries-grid">
          {data.map((ind) => (
            <Link to={`/industries/${ind.slug || ind.id}`} key={ind.id} className="industries-item">
              <IndustryIcon src={ind.icon} name={ind.name} />
              <span className="industries-name">
                {ind.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default IndustriesSection
