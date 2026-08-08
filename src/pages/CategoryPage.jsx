import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import PageLoader from '../components/PageLoader'
import { getDocBySlug, getCollection } from '../lib/cms'
import { sanitizeDescription } from '../lib/sanitizeHtml'

const CategoryPage = () => {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const cat = await getDocBySlug('categories', slug)
      if (!mounted) return
      setCategory(cat)
      if (cat) {
        const prods = await getCollection('products', { filterBy: { field: 'categoryId', op: '==', value: cat.id }, activeOnly: true })
        if (mounted) setProducts(prods)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [slug])
  if (loading) return <PageLoader />
  if (!category) return <div className="not-found">Category not found</div>

  return (
    <>
      <Helmet>
        <title>{category.name} | Unimetal</title>
        <meta name="description" content={category.aboutHeading || `Explore ${category.name} products at Unimetal.`} />
      </Helmet>

      <section className="category-hero" style={{ backgroundImage: category.heroImage ? `url(${category.heroImage})` : 'none' }}>
        <div className="category-hero-overlay" />
        <div className="container">
          <span className="category-hero-tag">Category</span>
          <h1>{category.name}</h1>
        </div>
      </section>

      <section className="category-about section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              {(category.aboutHeading || category.aboutHeadingLine2) && (
                <h2 className="category-about-heading">
                  {category.aboutHeading && <span className="category-about-heading-line1">{category.aboutHeading}</span>}
                  {category.aboutHeadingLine2 && <span className="category-about-heading-line2">{category.aboutHeadingLine2}</span>}
                </h2>
              )}
              {category.aboutDescription && (
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: sanitizeDescription(category.aboutDescription) }} />
              )}
            </div>
            {category.aboutImage && <img src={category.aboutImage} alt={category.name} className="about-image" />}
          </div>
        </div>
      </section>

      <section className="section category-products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Products in {category.name}</h2>
            <p className="section-subtitle">Premium quality products ready for your project</p>
          </div>
          {products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={{ ...p, category: category.name }} />
              ))}
            </div>
          ) : (
            <p className="text-muted">No products in this category yet.</p>
          )}
        </div>
      </section>

      <section className="section category-cta">
        <div className="container category-cta-inner">
          <div className="category-cta-icon">
            <Phone size={28} />
          </div>
          <h2 className="category-cta-heading">Looking for {category.name}?</h2>
          <p className="category-cta-subtext">
            Contact us for bulk pricing, custom sizes, and expert advice tailored to your project.
          </p>
          <Link to="/contact" className="btn btn-secondary category-cta-btn">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  )
}

export default CategoryPage
