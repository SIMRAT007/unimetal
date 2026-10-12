import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useSingleton } from '../hooks/useCms'
import { COLLECTIONS } from '../config/collections'
import { defaultDataCenter } from '../config/dataCenter'
import PageLoader from '../components/PageLoader'
import logo from '../assets/logo.png'
import '../styles/data-center.css'

const SPEC_ROWS = [
  ['configuration', 'Configuration'],
  ['thickness', 'Thickness'],
  ['lengths', 'Lengths'],
  ['selectionBasis', 'Selection basis'],
]

const pad = (n) => String(n).padStart(2, '0')

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const list = (value) => (Array.isArray(value) ? value : [])

// Renders admin text with line breaks as <br />
const Lines = ({ text = '' }) => text.split('\n').map((line, i) => (
  <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
))

const DataCenterPage = () => {
  const { data: saved, loading } = useSingleton(COLLECTIONS.dataCenter)
  const { data: topbar } = useSingleton(COLLECTIONS.topbar)
  const content = { ...defaultDataCenter, ...saved }
  const email = content.briefEmail || topbar?.email || 'info@unimetal.cc'

  const applications = list(content.applications)
  const profiles = list(content.profiles)

  const [profileIndex, setProfileIndex] = useState(0)
  const profile = profiles[profileIndex] || profiles[0]

  const [brief, setBrief] = useState({ name: '', application: '', channel: '', requirements: '' })
  const handleBrief = (e) => setBrief((b) => ({ ...b, [e.target.name]: e.target.value }))

  // Pre-select the first application/profile once the admin content has loaded
  useEffect(() => {
    if (loading) return
    setBrief((b) => ({
      ...b,
      application: b.application || applications[0]?.title || '',
      channel: b.channel || profiles[0]?.size || '',
    }))
  }, [loading])

  if (loading) return <PageLoader />

  const briefText = () => [
    content.briefFileHeading,
    '',
    `Project name: ${brief.name || '-'}`,
    `Application: ${brief.application || '-'}`,
    `Channel preference: ${brief.channel || '-'}`,
    '',
    'Project requirements:',
    brief.requirements || '-',
  ].join('\n')

  const downloadBrief = () => {
    const blob = new Blob([briefText()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(brief.name || 'unimetal-project-brief').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Project brief: ${brief.name || 'Data centre project'}`)}&body=${encodeURIComponent(briefText())}`

  const addToBrief = () => {
    if (profile) setBrief((b) => ({ ...b, channel: profile.size }))
    scrollTo('dc-brief')
  }

  return (
    <div className="dc-page">
      <Helmet>
        <title>{content.seoTitle}</title>
        <meta name="description" content={content.seoDescription} />
      </Helmet>

      <section className="dc-hero">
        <div className="dc-hero-image" style={content.heroImage ? { backgroundImage: `url(${content.heroImage})` } : undefined} />
        <div className="dc-hero-body">
          <div className="dc-hero-logo">
            <img src={logo} alt="Unimetal" />
          </div>
          {content.heroEyebrow && <span className="dc-eyebrow">{content.heroEyebrow}</span>}
          <h1 className="dc-hero-title"><Lines text={content.heroTitle} /></h1>
          {content.heroText && <p className="dc-hero-text">{content.heroText}</p>}
          <div className="dc-hero-actions">
            {content.heroPrimaryText && (
              <Link to={content.heroPrimaryLink || '/products'} className="dc-btn dc-btn-primary">{content.heroPrimaryText}</Link>
            )}
            {content.heroSecondaryText && (
              <button type="button" className="dc-btn dc-btn-outline" onClick={() => scrollTo('dc-applications')}>
                {content.heroSecondaryText}
              </button>
            )}
          </div>
        </div>
      </section>

      {list(content.stripItems).length > 0 && (
        <div className="dc-strip">
          <div className="container dc-strip-inner">
            {list(content.stripItems).map((item, i) => (
              <span key={item.id || i}><em>{pad(i + 1)}</em>{item.text}</span>
            ))}
          </div>
        </div>
      )}

      <section id="dc-applications" className="dc-section">
        <div className="container">
          <div className="dc-intro">
            <div>
              {content.appsEyebrow && <span className="dc-eyebrow">{content.appsEyebrow}</span>}
              <h2 className="dc-title"><Lines text={content.appsTitle} /></h2>
            </div>
            {content.appsText && <p className="dc-muted">{content.appsText}</p>}
          </div>

          {applications.length > 0 && (
            <div className="dc-apps">
              {applications.map((app, i) => (
                <article key={app.id || i} className="dc-app">
                  <span className="dc-app-tag">{pad(i + 1)} / {app.tag}</span>
                  <h3>{app.title}</h3>
                  <p className="dc-muted">{app.text}</p>
                  {app.items && (
                    <p className="dc-app-items">
                      {app.items.split(',').map((s) => s.trim()).filter(Boolean).join(' · ')}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}

          {profile && (
            <div className="dc-spec">
              <div className="dc-profiles" role="tablist" aria-label="Channel profiles">
                {profiles.map((p, i) => (
                  <button
                    key={p.id || i}
                    type="button"
                    role="tab"
                    aria-selected={p === profile}
                    className={`dc-profile ${p === profile ? 'active' : ''}`}
                    onClick={() => setProfileIndex(i)}
                  >
                    <span className="dc-profile-label">{p.label}</span>
                    <strong className="dc-profile-size">{p.size}</strong>
                    <span className="dc-profile-note">{p.note}</span>
                  </button>
                ))}
              </div>
              <div className="dc-spec-table">
                <dl>
                  {SPEC_ROWS.filter(([key]) => profile[key]).map(([key, label]) => (
                    <div key={key} className="dc-spec-row">
                      <dt>{label}</dt>
                      <dd>{profile[key]}</dd>
                    </div>
                  ))}
                </dl>
                {content.specNote && <p className="dc-spec-note">{content.specNote}</p>}
                {content.specLinkText && (
                  <button type="button" className="dc-link" onClick={addToBrief}>{content.specLinkText}</button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="dc-section dc-dark">
        <div className="container dc-eng">
          <div>
            {content.engEyebrow && <span className="dc-eyebrow">{content.engEyebrow}</span>}
            <h2 className="dc-title"><Lines text={content.engTitle} /></h2>
            {content.engText && <p className="dc-eng-text">{content.engText}</p>}
            {content.engButtonText && (
              <button type="button" className="dc-btn dc-btn-primary" onClick={() => scrollTo('dc-brief')}>
                {content.engButtonText}
              </button>
            )}
          </div>
          <ol className="dc-eng-list">
            {list(content.engItems).map((item, i) => (
              <li key={item.id || i}>
                <span>{pad(i + 1)}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="dc-brief" className="dc-section">
        <div className="container dc-brief">
          <div>
            {content.briefEyebrow && <span className="dc-eyebrow">{content.briefEyebrow}</span>}
            <h2 className="dc-title"><Lines text={content.briefTitle} /></h2>
            {content.briefText && <p className="dc-brief-text">{content.briefText}</p>}
            {content.briefSmallText && <p className="dc-brief-small">{content.briefSmallText}</p>}
          </div>
          <form className="dc-form" onSubmit={(e) => { e.preventDefault(); downloadBrief() }}>
            <label className="dc-field">
              <span>Project name</span>
              <input name="name" value={brief.name} onChange={handleBrief} placeholder="e.g. Oslo data centre expansion" />
            </label>
            <div className="dc-form-row">
              <label className="dc-field">
                <span>Application</span>
                <select name="application" value={brief.application} onChange={handleBrief}>
                  {applications.map((a, i) => <option key={a.id || i}>{a.title}</option>)}
                </select>
              </label>
              <label className="dc-field">
                <span>Channel preference</span>
                <select name="channel" value={brief.channel} onChange={handleBrief}>
                  {profiles.map((p, i) => <option key={p.id || i}>{p.size}</option>)}
                </select>
              </label>
            </div>
            <label className="dc-field">
              <span>Project requirements</span>
              <textarea
                name="requirements"
                rows={3}
                value={brief.requirements}
                onChange={handleBrief}
                placeholder="Quantities, spans, loads, finish, location and target delivery date..."
              />
            </label>
            <div className="dc-form-actions">
              <button type="submit" className="dc-btn dc-btn-primary">{content.briefDownloadText || 'Download project brief'}</button>
              <a href={mailto} className="dc-link">{content.briefEmailText || 'Email Unimetal'}</a>
            </div>
          </form>
        </div>
      </section>

      {list(content.faqs).length > 0 && (
        <section className="dc-section dc-faq-section">
          <div className="container">
            {content.faqHeading && <span className="dc-eyebrow">{content.faqHeading}</span>}
            <div className="dc-faq">
              {list(content.faqs).map((f, i) => (
                <details key={f.id || i} open>
                  <summary>{f.question}</summary>
                  <p className="dc-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default DataCenterPage
