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

  const slide = activeSlides[displayed]
  const features = Array.isArray(slide.features) ? slide.features : []
  const applications = Array.isArray(slide.applications) ? slide.applications : []
  const finishes = Array.isArray(slide.finishes) ? slide.finishes : []
  const taglineLines = (slide.tagline || '').split('\n').map((l) => l.trim()).filter(Boolean)
  const hasPrimaryBtn = slide.buttonText && slide.buttonLink
  const hasSecondaryBtn = slide.buttonText2 && slide.buttonLink2

  const renderIconItem = (item, className) => (
    <div key={item.id} className={className}>
      {item.icon && <img src={item.icon} alt="" className="hero-icon-img" />}
      <span className="hero-icon-label">
        {item.line1}
        {item.line2 && <><br />{item.line2}</>}
      </span>
    </div>
  )

  return (
    <section id="hero" className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="hero-texture"
        style={{ backgroundImage: slide.textureImage ? `url(${slide.textureImage})` : undefined }}
      />

      <div className="hero-band">
        {activeSlides.map((s, i) => (
          <div
            key={s.id}
            className={`hero-slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: s.image ? `url(${s.image})` : undefined }}
          >
            <div className="hero-overlay" />
          </div>
        ))}
      </div>

      <div className="container hero-content">
        <div className={`hero-main ${visible ? 'is-visible' : ''}`}>
          <div className="hero-card">
            <img src={slide.logo || nav?.logo || logo} alt={nav?.logoText || ''} className="hero-card-logo" />
          </div>

          <div className="hero-row">
            <div className="hero-icon-row hero-features">
              {features.map((f) => renderIconItem(f, 'hero-icon-item'))}
            </div>

            <div className="hero-headings">
              {slide.heading && <h1 className="hero-title">{slide.heading}</h1>}
              {slide.variants && <p className="hero-variants">{slide.variants}</p>}
              {slide.spec && <p className="hero-spec">{slide.spec}</p>}
              {slide.subheading && <p className="hero-subheading">{slide.subheading}</p>}
            </div>

            <div className="hero-apps">
              <div className="hero-icon-row hero-applications">
                {applications.map((a) => renderIconItem(a, 'hero-icon-item'))}
              </div>
              {taglineLines.length > 0 && (
                <p className="hero-tagline">
                  {taglineLines.map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </p>
              )}
            </div>
          </div>

          {slide.productImage && (
            <div className="hero-product">
              <img src={slide.productImage} alt={slide.heading || ''} />
            </div>
          )}

          {finishes.length > 0 && (
            <div className="hero-finishes">
              {finishes.map((f) => (
                <div key={f.id} className="hero-finish">
                  <span className="hero-finish-swatch">
                    {f.image && <img src={f.image} alt={f.label || ''} />}
                  </span>
                  {f.label && <span className="hero-finish-label">{f.label}</span>}
                </div>
              ))}
            </div>
          )}

          {(hasPrimaryBtn || hasSecondaryBtn) && (
            <div className="hero-actions">
              {hasPrimaryBtn && (
                <Link to={slide.buttonLink} className="hero-btn hero-btn-primary">
                  <Clock size={16} />
                  {slide.buttonText}
                </Link>
              )}
              {hasSecondaryBtn && (
                <Link to={slide.buttonLink2} className="hero-btn hero-btn-secondary">
                  {slide.buttonText2}
                </Link>
              )}
            </div>
          )}
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
