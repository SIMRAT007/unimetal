import { useState, useEffect } from 'react'
import { COLLECTIONS } from '../../config/collections'
import { useCollection, useSingleton } from '../../hooks/useCms'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import logo from '../../assets/logo.png'

const Hero = () => {
  const { data: slides, loading } = useCollection(COLLECTIONS.heroSlides, { activeOnly: true })
  const { data: categories } = useCollection(COLLECTIONS.categories)
  const { data: nav } = useSingleton(COLLECTIONS.navbar)
  const [current, setCurrent] = useState(0)
  const [displayed, setDisplayed] = useState(0)
  const [visible, setVisible] = useState(true)
  const [paused, setPaused] = useState(false)

  const activeSlides = slides.length ? slides : []

  useEffect(() => {
    if (activeSlides.length <= 1 || paused) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeSlides.length, paused])

  useEffect(() => {
    if (current === displayed) return
    setVisible(false)
    const timer = setTimeout(() => {
      setDisplayed(current)
      setVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [current, displayed])

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
        <div className={`hero-main ${visible ? 'is-visible' : ''}`}>
          <div className="hero-brand">
            <img src={nav?.logo || logo} alt={nav?.logoText || ''} className="hero-logo" />
          </div>

          <div className="hero-text">
            {activeSlides[displayed].tag && (
              <span className="hero-tag">{activeSlides[displayed].tag}</span>
            )}
            {activeSlides[displayed].heading && <h1>{activeSlides[displayed].heading}</h1>}
            {activeSlides[displayed].headingLine2 && <h2>{activeSlides[displayed].headingLine2}</h2>}
            {activeSlides[displayed].headingAccent && (
              <span className="hero-accent">{activeSlides[displayed].headingAccent}</span>
            )}
            {activeSlides[displayed].subheading && (
              <p className="hero-subheading">{activeSlides[displayed].subheading}</p>
            )}
          </div>

          <div className="hero-actions">
            {activeSlides[displayed].buttonText && activeSlides[displayed].buttonLink && (
              <Link to={activeSlides[displayed].buttonLink} className="hero-btn hero-btn-primary">
                <Clock size={16} />
                {activeSlides[displayed].buttonText}
              </Link>
            )}
            {activeSlides[displayed].buttonText2 && activeSlides[displayed].buttonLink2 && (
              <Link to={activeSlides[displayed].buttonLink2} className="hero-btn hero-btn-secondary">
                {activeSlides[displayed].buttonText2}
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
