import { db, collection, getDocs } from '../firebase'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import PageLoader from './PageLoader'

const ProductList = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'))
        const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setProducts(items)
      } catch (err) {
        setError('Failed to load products.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])
  if (loading) return <PageLoader />
  if (error) return <div className="error">{error}</div>
  if (!products.length) {
    return (
      <div className="empty-state">
        <h3>No products yet</h3>
        <p>Check back soon or ask the admin to add some products.</p>
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
