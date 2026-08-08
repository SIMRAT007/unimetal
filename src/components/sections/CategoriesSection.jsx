import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../../config/collections'
import { useCollection, useSingleton } from '../../hooks/useCms'
import { CATEGORY_ICON_MAP, DEFAULT_CATEGORY_ICONS } from '../../config/categoryIcons'
import { Package } from 'lucide-react'

const CategoryIcon = ({ name }) => {
  const Icon = (name && CATEGORY_ICON_MAP[name]) || Package
  return <Icon size={36} strokeWidth={2} />
}

const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '').trim()

const shortDesc = (html) => {
  const text = stripHtml(html)
  if (!text) return ''
  return text.length > 90 ? `${text.slice(0, 90)}…` : text
}

const CategoriesSection = () => {
  const { data: section, loading: sectionLoading } = useSingleton(COLLECTIONS.categoriesSection)
  const { data, loading } = useCollection(COLLECTIONS.categories, { activeOnly: true })
  const [showAll, setShowAll] = useState(false)

  if (sectionLoading || loading) return <div className="section-skeleton" />
  if (section.active === false) return null

  const initialLimit = 8
  const hasMore = data.length > initialLimit
  const visibleCategories = showAll ? data : data.slice(0, initialLimit)

  return (
    <section id="categories" className="categories section">
      <div className="container">
        <div className="categories-header">
          {section.heading && <h2 className="categories-title">{section.heading}</h2>}
          {section.highlight && <h3 className="categories-highlight">{section.highlight}</h3>}
          {section.subheading && <p className="categories-subheading">{section.subheading}</p>}
        </div>
        <div className="category-grid">
          {visibleCategories.map((cat, i) => {
            const iconName = cat.icon || DEFAULT_CATEGORY_ICONS[i % DEFAULT_CATEGORY_ICONS.length]
            return (
              <Link key={cat.id} to={`/category/${cat.slug || cat.id}`} className="category-card">
                <div className="category-card-top">
                  {cat.heroImage ? (
                    <img src={cat.heroImage} alt={cat.name} className="category-hero-img" />
                  ) : (
                    <div className="category-top-icon">
                      <CategoryIcon name={iconName} />
                    </div>
                  )}
                </div>
                <div className="category-card-body">
                  <div className="category-card-heading-row">
                    <h3>{cat.name}</h3>
                    <div className="category-body-icon">
                      <CategoryIcon name={iconName} />
                    </div>
                  </div>
                  <p className="category-desc">{shortDesc(cat.aboutDescription || cat.aboutHeading)}</p>
                  <span className="category-view-btn">View Products</span>
                </div>
              </Link>
            )
          })}
        </div>
        {hasMore && (
          <div className="categories-show-more">
            <button type="button" className="btn btn-primary" onClick={() => setShowAll((p) => !p)}>
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoriesSection
