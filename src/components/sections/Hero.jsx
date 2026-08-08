import { useState, useEffect } from 'react'
import { COLLECTIONS } from '../../config/collections'
import { useCollection } from '../../hooks/useCms'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

const Hero = () => {
  const { data: slides, loading } = useCollection(COLLECTIONS.heroSlides, { activeOnly: true })
  const { data: categories } = useCollection(COLLECTIONS.categories)
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const activeSlides = slides.length ? slides : []

  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeSlides.length, paused])

  if (loading) return <div className="hero-skeleton" />
  if (activeSlides.length === 0) return null

  return (
    <section id="hero" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {activeSlides.map((s, i) => (
        <div
          key={s.id}
          className={`hero-slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: s.image ? `url(${s.image})` : undefined }}
        >
          <div className="hero-overlay" />
        </div>
      ))}

      <div className="container hero-content">
        <div className="hero-main">
          <div className="hero-text">
            {activeSlides[current].tag && (
              <span className="hero-tag">{activeSlides[current].tag}</span>
            )}
            {activeSlides[current].heading && <h1>{activeSlides[current].heading}</h1>}
            {activeSlides[current].headingLine2 && <h2>{activeSlides[current].headingLine2}</h2>}
            {activeSlides[current].headingAccent && (
              <span className="hero-accent">{activeSlides[current].headingAccent}</span>
            )}
            {activeSlides[current].subheading && (
              <p className="hero-subheading">{activeSlides[current].subheading}</p>
            )}
          </div>

          <div className="hero-actions">
            {activeSlides[current].buttonText && activeSlides[current].buttonLink && (
              <Link to={activeSlides[current].buttonLink} className="hero-btn hero-btn-primary">
                <Clock size={16} />
                {activeSlides[current].buttonText}
              </Link>
            )}
            {activeSlides[current].buttonText2 && activeSlides[current].buttonLink2 && (
              <Link to={activeSlides[current].buttonLink2} className="hero-btn hero-btn-secondary">
                {activeSlides[current].buttonText2}
              </Link>
            )}
          </div>
        </div>
      </div>

      {categories?.length > 0 && (
        <div className="hero-marquee">
          <div className="hero-marquee-label">Available Here</div>
          <div className="hero-marquee-track">
            <div className="hero-marquee-content">
              {[...categories, ...categories].map((cat, i) => (
                <span key={`${cat.id}-${i}`} className="hero-marquee-item">{cat.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero
