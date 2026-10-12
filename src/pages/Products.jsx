import ProductList from '../components/ProductList'
import ProductsCta from '../components/sections/ProductsCta'
import DeliveryInfo from '../components/sections/DeliveryInfo'

const Products = () => (
  <>
    <section className="section">
      <div className="container">
        <h2 className="section-title">All Products</h2>
        <p className="section-subtitle">Browse the complete Unimetal catalog.</p>
        <ProductList showFilters={true} />
      </div>
    </section>
    <ProductsCta />
    <DeliveryInfo />
  </>
)

export default Products
