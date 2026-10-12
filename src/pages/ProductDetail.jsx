import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Star, ChevronDown, MessageCircle } from 'lucide-react'
import { getDocBySlug, getDocById, getCollection } from '../lib/cms'
import { sanitizeDescription } from '../lib/sanitizeHtml'
import PageLoader from '../components/PageLoader'
import ProductsCta from '../components/sections/ProductsCta'
import DeliveryInfo from '../components/sections/DeliveryInfo'
import { productPath, useDuplicateSlugs } from '../lib/productLinks'

const ProductDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const duplicateSlugs = useDuplicateSlugs()
  const [product, setProduct] = useState(null)
  const [category, setCategory] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  const productCode = product?.productCode || ''

  const handleContactClick = () => {
    navigate('/contact', { state: { product } })
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        // Links use the slug, or the document id when the slug is missing or shared
        const prod = (await getDocBySlug('products', slug)) || (await getDocById('products', slug))
        if (!prod) {
          if (mounted) setError('Product not found.')
        } else if (mounted) {
          setProduct(prod)
          setSelectedImage(0)
          const cat = await getDocById('categories', prod.categoryId)
          if (mounted) setCategory(cat)
          if (cat) {
            const rel = await getCollection('products', { filterBy: { field: 'categoryId', op: '==', value: cat.id }, activeOnly: true })
            if (mounted) setRelated(rel.filter((p) => p.id !== prod.id).slice(0, 4))
          }
        }
      } catch (err) {
        console.error(err)
        if (mounted) setError('Failed to load product.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [slug])


  if (loading) return <PageLoader />
  if (error) return <div className="error container">{error}</div>
  if (!product) return null

  const images = product.images || []
  const priceNum = Number(product.price)
  const originalPriceNum = Number(product.originalPrice)
  const hasPrice = !isNaN(priceNum) && priceNum > 0
  const hasOriginalPrice = !isNaN(originalPriceNum) && originalPriceNum > 0
  const hasDiscount = hasPrice && hasOriginalPrice && originalPriceNum > priceNum
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
    : 0
  const rating = Number(product.rating) || 0


  const renderStars = () => (
    <div className="product-rating-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={16}
          fill={i <= Math.round(rating) ? '#f59e0b' : 'transparent'}
          color={i <= Math.round(rating) ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{product.name} | Unimetal</title>
        <meta name="description" content={product.description?.replace?.(/<[^>]+>/g, '').slice(0, 160) || 'Product details from Unimetal.'} />
      </Helmet>

      <section className="product-detail section">
        <div className="container">
          <button type="button" className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>← Back</button>

          <div className="product-detail-layout">
            <div className="product-gallery">
              {images.length ? (
                <>
                  <div className="product-thumbnails">
                    {images.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`product-thumb ${i === selectedImage ? 'active' : ''}`}
                        onClick={() => setSelectedImage(i)}
                      >
                        <img src={url} alt={`${product.name} ${i + 1}`} />
                      </button>
                    ))}
                  </div>
                  <div className="product-main">
                    <div className="product-main-image">
                      <img src={images[selectedImage]} alt={product.name} />
                    </div>
                    <button onClick={handleContactClick} className="btn btn-primary product-contact-btn">
                      <MessageCircle size={18} />
                      Contact Us
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-image">No images</div>
              )}
            </div>

            <div className="product-info">
              <div className="product-info-header">
                <div>
                  {category && <span className="product-info-category">{category.name}</span>}
                  <h1 className="product-info-title">{product.name}</h1>
                  {product.subtitle && <p className="product-info-subtitle">{product.subtitle}</p>}
                  {productCode && (
                    <p className="product-info-code">
                      <span>Product Code:</span> {productCode}
                    </p>
                  )}
                </div>
              </div>

              <div className="product-info-meta">
                {hasPrice ? (
                  <div className="product-info-price">
                    <span className="product-info-current-price">{priceNum}</span>
                    {hasOriginalPrice && <span className="product-info-original-price">{originalPriceNum}</span>}
                    {hasDiscount && <span className="product-info-discount">{discountPercent}% off</span>}
                  </div>
                ) : (
                  <div className="product-info-price">
                    <span className="product-info-current-price quote-text" onClick={handleContactClick}>Request a quote</span>
                  </div>
                )}
                {rating > 0 && (
                  <div className="product-info-rating">
                    {renderStars()}
                    <span>{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="product-description-block">
                <h2 className="product-description-heading">Description</h2>
                <div
                  className="product-description-text rich-text"
                  dangerouslySetInnerHTML={{ __html: sanitizeDescription(product.description) }}
                />
              </div>

              <div className="product-accordions">
                <details className="product-accordion">
                  <summary>
                    Size & Fit
                    <ChevronDown size={18} />
                  </summary>
                  <div className="product-accordion-body">
                    {product.sizeFitDetails || 'Size and fit information will be updated soon.'}
                  </div>
                </details>
                <details className="product-accordion">
                  <summary>
                    Delivery & Free Returns
                    <ChevronDown size={18} />
                  </summary>
                  <div className="product-accordion-body">
                    {product.deliveryDetails || 'Delivery and returns information will be updated soon.'}
                  </div>
                </details>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="related-products">
              <h2 style={{ paddingBottom: '2rem' }}>More in {category?.name}</h2>
              <div className="product-grid small">
                {related.map((p) => (
                  <Link to={productPath(p, duplicateSlugs)} key={p.id} className="product-card">
                    {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="product-image" />}
                    <h3 style={{ padding: '1rem' }}>{p.name}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <ProductsCta showCapabilities={false} />
      <DeliveryInfo />
    </>
  )
}

export default ProductDetail
