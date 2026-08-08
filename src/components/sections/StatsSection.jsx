import { COLLECTIONS } from '../../config/collections'
import { useSingleton } from '../../hooks/useCms'

const StatsSection = () => {
  const { data, loading } = useSingleton(COLLECTIONS.stats)

  if (loading) return <div className="section-skeleton" />
  if (data.active === false) return null

  return (
    <section id="stats" className="stats section">
      <div className="container">
        <div className="stats-wrap">
          <div className="stats-banner">
            {data.heading && <h2 className="section-title">{data.heading}</h2>}
            {data.subheading && <p className="section-subtitle">{data.subheading}</p>}
          </div>

          {data.items?.length > 0 && (
            <div className="stats-grid">
              {data.items.map((item, i) => (
                <div key={i} className="stat-card">
                  {item.icon && <img src={item.icon} alt={item.label} className="stat-icon" />}
                  <div className="stat-value">{item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
