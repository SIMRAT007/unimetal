import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PageLoader from '../components/PageLoader'
import ProductsCta from '../components/sections/ProductsCta'
import { getDocBySlug } from '../lib/cms'

const IndustryPage = () => {
  const { slug } = useParams()
  const [industry, setIndustry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getDocBySlug('industries', slug)
      if (mounted) { setIndustry(data); setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [slug])

  if (loading) return <PageLoader />
  if (!industry) return <div className="not-found container">Industry not found</div>

  return (
    <>
      <Helmet>
        <title>{industry.name} | Unimetal</title>
        <meta name="description" content={industry.description?.replace?.(/<[^>]+>/g, '').slice(0, 160) || `Unimetal products for the ${industry.name} industry.`} />
      </Helmet>

      <section className="section industry-page">
        <div className="container">
          <h1 className="industry-heading">{industry.heading || industry.name}</h1>

          {industry.image && (
            <div className="industry-image-wrap">
              <img src={industry.image} alt={industry.name} className="industry-image" />
            </div>
          )}

          {industry.description && (
            <div className="industry-body rich-text" dangerouslySetInnerHTML={{ __html: industry.description }} />
          )}

          {industry.usageContent && (
            <div className="industry-section">
              <h2 className="industry-section-title">How they use it</h2>
              <div className="industry-section-body rich-text" dangerouslySetInnerHTML={{ __html: industry.usageContent }} />
            </div>
          )}

          {industry.moreAboutContent && (
            <div className="industry-section">
              <h2 className="industry-section-title">More about {industry.name}</h2>
              <div className="industry-section-body rich-text" dangerouslySetInnerHTML={{ __html: industry.moreAboutContent }} />
            </div>
          )}

          <ProductsCta showCapabilities={false} />
        </div>
      </section>
    </>
  )
}

export default IndustryPage
