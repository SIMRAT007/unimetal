import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../../config/collections'
import { DATA_CENTER_PATH, defaultDataCenter } from '../../config/dataCenter'
import { useSingleton } from '../../hooks/useCms'
import { ArrowRight } from 'lucide-react'

const CapabilitiesSection = () => {
  const { data: section, loading: sectionLoading } = useSingleton(COLLECTIONS.capabilitiesSection)
  const { data: saved, loading: dcLoading } = useSingleton(COLLECTIONS.dataCenter)

  if (sectionLoading || dcLoading) return <div className="section-skeleton" />
  if (section.active === false) return null

  const dc = { ...defaultDataCenter, ...saved }
  const points = Array.isArray(dc.stripItems) ? dc.stripItems : []

  return (
    <section id="capabilities" className="capabilities section">
      <div className="container">
        <div className="capabilities-header">
          {section.heading && <h2 className="capabilities-title">{section.heading}</h2>}
          {section.highlight && <h3 className="capabilities-highlight">{section.highlight}</h3>}
        </div>

        <div className="capability-feature">
          <Link to={DATA_CENTER_PATH} className="capability-feature-media" aria-label={dc.homeTitle}>
            {dc.heroImage && <img src={dc.heroImage} alt={dc.homeTitle} loading="lazy" />}
          </Link>
          <div className="capability-feature-body">
            {dc.homeEyebrow && <span className="capability-feature-eyebrow">{dc.homeEyebrow}</span>}
            <h3 className="capability-feature-title">{dc.homeTitle}</h3>
            {dc.homeText && <p className="capability-feature-text">{dc.homeText}</p>}
            {points.length > 0 && (
              <ul className="capability-feature-points">
                {points.map((point, i) => (
                  <li key={point.id || i}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {point.text}
                  </li>
                ))}
              </ul>
            )}
            <Link to={DATA_CENTER_PATH} className="capability-feature-btn">
              {dc.homeButtonText || 'Learn more'} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CapabilitiesSection
