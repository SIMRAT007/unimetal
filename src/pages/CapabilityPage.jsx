import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PageLoader from '../components/PageLoader'
import ProductsCta from '../components/sections/ProductsCta'
import { getDocBySlug } from '../lib/cms'

const CapabilityPage = () => {
  const { slug } = useParams()
  const [cap, setCap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getDocBySlug('capabilities', slug)
      if (mounted) { setCap(data); setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [slug])

  if (loading) return <PageLoader />
  if (!cap) return <div className="not-found container">Capability not found</div>

  return (
    <>
      <Helmet>
        <title>{cap.name} | Unimetal</title>
        <meta name="description" content={cap.description?.replace?.(/<[^>]+>/g, '').slice(0, 160) || `${cap.name} at Unimetal.`} />
      </Helmet>

      <section className="section capability-page">
        <div className="container">
          <h1 className="capability-heading">{cap.heading || cap.name}</h1>

          {cap.image && (
            <div className="capability-image-wrap">
              <img src={cap.image} alt={cap.name} className="capability-image" />
            </div>
          )}

          {cap.description && (
            <div className="capability-body rich-text" dangerouslySetInnerHTML={{ __html: cap.description }} />
          )}

          {cap.bulletPoints?.length > 0 && (
            <ul className="capability-bullets">
              {cap.bulletPoints.map((pt, i) => (
                <li key={i}>{pt.text || pt}</li>
              ))}
            </ul>
          )}

          <ProductsCta showCapabilities={false} />
        </div>
      </section>
    </>
  )
}

export default CapabilityPage
