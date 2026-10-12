import { Link, useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { stripTags } from '../lib/sanitizeHtml'
import { getDocById } from '../lib/cms'
import { useEffect, useState } from 'react'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const image = product.images?.[0] || product.image || ''
  const [categoryName, setCategoryName] = useState(product.category || 'General')

  const handleQuoteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate('/contact', { state: { product } })
  }

  useEffect(() => {
    if (product.categoryId && !product.category) {
      getDocById('categories', product.categoryId).then((cat) => {
        if (cat) setCategoryName(cat.name)
      })
    }
  }, [product.categoryId, product.category])

  const priceNum = Number(product.price)
  const originalPriceNum = Number(product.originalPrice)
  const hasPrice = !isNaN(priceNum) && priceNum > 0
  const hasOriginalPrice = !isNaN(originalPriceNum) && originalPriceNum > 0
  const hasDiscount = hasPrice && hasOriginalPrice && originalPriceNum > priceNum
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
    : 0

  return (
    <Link to={`/product/${product.slug || product.id}`} className="product-card">
      <div className="product-image">
        {hasDiscount && <span className="product-badge">{discountPercent}% Off</span>}
        {image ? <img src={image} alt={product.name} /> : <span className="product-no-image">No image</span>}
      </div>
      <div className="product-body">
        <div className="product-category">{categoryName}</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{stripTags(product.description)}</p>
        <div className="product-footer">
          <div className="product-price-wrap">
            {hasPrice ? (
              <>
                <span className="product-price">{priceNum}</span>
                {hasDiscount && <span className="product-original-price">{originalPriceNum}</span>}
              </>
            ) : (
              <span className="product-price quote-text" onClick={handleQuoteClick}>Request a quote</span>
            )}
          </div>
          <span className="product-view-btn">
            <Eye size={14} />
            View
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
