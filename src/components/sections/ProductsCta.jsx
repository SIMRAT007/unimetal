import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const ProductsCta = ({ showCapabilities = true }) => (
  <section className="bulk-cta">
    <div className="bulk-cta-inner">
      <div className="bulk-cta-content">
        <span className="bulk-cta-eyebrow">BULK, RUSH, CUSTOM</span>
        <h2 className="bulk-cta-heading">WE GOT YOU COVERED.</h2>
        <p className="bulk-cta-text">
          We understand that there are situations when you need your fasteners—fast.
          So, we're always prepared to handle the biggest orders and have them rushed to
          you in days, not weeks. And if the item you're looking for is not in stock, we
          can usually manufacture it by the next day and ship it to you instantly.
        </p>
        <div className="bulk-cta-actions">
          <Link to="/contact" className="bulk-cta-btn">
            GET A QUOTE <ArrowRight size={18} />
          </Link>
          {showCapabilities && (
            <Link to="/#capabilities" className="bulk-cta-btn">
              OUR CAPABILITIES <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
      <div className="bulk-cta-media">
        <img
          src="https://res.cloudinary.com/qoa8uzc8/image/upload/v1786189864/Gemini_Generated_Image_l8amj2l8amj2l8am_a0gay6.png"
          alt="Fastener manufacturing machine"
        />
      </div>
    </div>
  </section>
)

export default ProductsCta
