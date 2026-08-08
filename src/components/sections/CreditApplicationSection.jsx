import { COLLECTIONS } from '../../config/collections'
import { useSingleton } from '../../hooks/useCms'
import { FileText, Download } from 'lucide-react'

const CreditApplicationSection = () => {
  const { data, loading } = useSingleton(COLLECTIONS.creditApplication)

  if (loading) return null
  if (data.active === false) return null
  if (!data.heading && !data.description && !data.pdfUrl) return null

  return (
    <section id="credit-application" className="credit-application section">
      <div className="container">
        <div className="credit-application-card" style={data.bgColor ? { backgroundColor: data.bgColor } : undefined}>
          <div
            className="credit-application-icon"
            style={data.bgColor ? { background: 'rgba(255,255,255,0.35)', color: '#fff' } : undefined}
          >
            <FileText size={28} strokeWidth={2} />
          </div>
          <div className="credit-application-body">
            {data.tag && <span className="section-eyebrow">{data.tag}</span>}
            {data.heading && (
              <h2 className="section-title" style={data.bgColor ? { color: '#fff' } : undefined}>{data.heading}</h2>
            )}
            {data.description && <p className="credit-application-desc">{data.description}</p>}
          </div>
          {data.pdfUrl && data.pdfLabel && (
            <a
              className="btn btn-primary credit-application-btn"
              href={data.pdfUrl}
              target="_blank"
              rel="noreferrer"
              style={data.bgColor ? { background: '#fff', color: '#86C3DA', borderColor: '#fff' } : undefined}
            >
              <Download size={16} /> {data.pdfLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default CreditApplicationSection
