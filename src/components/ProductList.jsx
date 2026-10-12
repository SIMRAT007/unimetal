import { db, collection, getDocs } from '../firebase'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import PageLoader from './PageLoader'
import { getCollection } from '../lib/cms'
import { COLLECTIONS } from '../config/collections'
import { Search, Filter } from 'lucide-react'

const ProductList = ({ showFilters = false }) => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [snap, cats] = await Promise.all([
          getDocs(collection(db, 'products')),
          getCollection(COLLECTIONS.categories),
        ])
        const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setProducts(items)
        setCategories(cats)
      } catch (err) {
        setError('Failed to load products.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === '' || product.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (loading) return <PageLoader />
  if (error) return <div className="error">{error}</div>

  return (
    <>
      {showFilters && (
        <div className="products-filters">
          <div className="filter-row">
            <div className="filter-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-category">
              <Filter size={18} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="filter-results">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {!filteredProducts.length ? (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductList
