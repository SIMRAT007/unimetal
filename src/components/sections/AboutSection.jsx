import { Link } from 'react-router-dom'
import { COLLECTIONS, defaultAbout } from '../../config/collections'
import { useSingleton } from '../../hooks/useCms'
import { sanitizeDescription } from '../../lib/sanitizeHtml'
import BoltsIllustration from './BoltsIllustration'

const AboutSection = () => {
  const { data, loading } = useSingleton(COLLECTIONS.about, defaultAbout)

  if (loading) return <div className="section-skeleton" />
  if (data.active === false) return null

  const galleryImages = (data.images || [])
    .map((img) => img?.image)
    .filter(Boolean)

  const stats = (data.stats || [])
    .filter((stat) => stat?.value || stat?.label)

  const headingText = (data.heading || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')

  return (
    <section id="about" className="about section">
      <div className="container about-layout">
        <div className="about-content">
          {data.tag && <span className="about-eyebrow">{data.tag}</span>}

          <h2 className="about-heading">{headingText}</h2>

          {data.description && (
            <div
              className="about-description rich-text"
              dangerouslySetInnerHTML={{ __html: sanitizeDescription(data.description) }}
            />
          )}

          {stats.length > 0 && (
            <div className="about-stats">
              {stats.map((stat, idx) => (
                <div key={idx} className="about-stat">
                  <span className="about-stat-value">{stat.value}</span>
                  <span className="about-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {data.buttonText && (
            <Link to={data.buttonLink || '/contact'} className="about-btn">
              {data.buttonText}
            </Link>
          )}
        </div>

        <div className="about-media">
          {galleryImages.length > 0 ? (
            <div className={`about-gallery ${galleryImages.length === 1 ? 'about-gallery--single' : ''}`}>
              {galleryImages.map((src, idx) => (
                <img key={idx} src={src} alt="" className="about-gallery-image" />
              ))}
            </div>
          ) : (
            <BoltsIllustration aria-label="Commercial bolts illustration" />
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
