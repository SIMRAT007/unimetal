import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { stripTags } from '../lib/sanitizeHtml'

const ProductCard = ({ product }) => {
  const image = product.images?.[0] || product.image || ''
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link to={`/product/${product.slug || product.id}`} className="product-card">
      <div className="product-image">
        {hasDiscount && <span className="product-badge">{discountPercent}% Off</span>}
        {image ? <img src={image} alt={product.name} /> : <span className="product-no-image">No image</span>}
      </div>
      <div className="product-body">
        <div className="product-category">{product.category || 'General'}</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{stripTags(product.description)}</p>
        <div className="product-footer">
          <span className="product-view-btn">
            <Eye size={14} />
            View
          </span>
          <div className="product-price-wrap">
            <span className="product-price">{product.price}</span>
            {hasDiscount && <span className="product-original-price">{product.originalPrice}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
