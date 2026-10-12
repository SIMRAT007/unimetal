import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopBar from './TopBar'
import { COLLECTIONS } from '../config/collections'
import { DATA_CENTER_PATH } from '../config/dataCenter'
import { useSingleton, useCollection } from '../hooks/useCms'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

const linkClass = ({ isActive }) => isActive ? 'active' : ''

const SECTION_ALIASES = {
  products: 'categories',
}

// The CMS "Capabilities" scroll link is shown as the Data Center page instead
const DATA_CENTER_LINK = { label: 'Data Center', linkType: 'page', target: DATA_CENTER_PATH }
const overrideLink = (link) =>
  link.target?.toLowerCase().replace(/^#/, '') === 'capabilities' ? { ...link, ...DATA_CENTER_LINK } : link

// The Industries section was removed from the site; hide any CMS link still pointing at it
const isRemovedLink = (link) => /industr/i.test(link.target || '')

const Navbar = () => {
  const navigate = useNavigate()
  const { data: nav, loading: navLoading } = useSingleton(COLLECTIONS.navbar)
  const { data: links, loading: linksLoading } = useCollection(COLLECTIONS.navLinks, { activeOnly: true })

  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleScroll = (id) => {
    const target = id?.toLowerCase()?.replace(/^#/, '')
    if (!target) return
    if (target === 'home') {
      navigate('/')
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      return
    }
    const direct = document.getElementById(target)
    const el = direct || document.getElementById(SECTION_ALIASES[target] || '')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const section = document.getElementById(target) || document.getElementById(SECTION_ALIASES[target] || '')
        section?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }

  if (navLoading || linksLoading) return null

  const activeLinks = links.filter((l) => l.active !== false && !isRemovedLink(l)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(overrideLink)

  return (
    <>
      <TopBar />
      <nav className={`navbar ${mobileOpen ? 'menu-open' : ''}`}>
        <div className="container">
          <NavLink to="/" className="logo">
            <img src={nav?.logo || logo} alt={nav?.logoText || ''} className="nav-logo-img" />
          </NavLink>

          <div className={`nav-main ${mobileOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              {activeLinks.map((link) => (
                <li key={link.id}>
                  {link.linkType === 'scroll' ? (
                    <button type="button" className="nav-scroll" onClick={() => { handleScroll(link.target); setMobileOpen(false) }}>
                      {link.label}
                    </button>
                  ) : link.target?.startsWith('/') ? (
                    <NavLink to={link.target} className={linkClass} onClick={() => setMobileOpen(false)}>{link.label}</NavLink>
                  ) : (
                    <a href={link.target || '#'} target="_blank" rel="noreferrer">{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-right">
            {nav.ctaLabel && (
              <NavLink to={nav.ctaTarget || '/contact'} className="btn btn-primary nav-cta" onClick={() => setMobileOpen(false)}>
                {nav.ctaLabel}
              </NavLink>
            )}

            <button type="button" className="mobile-menu-toggle" onClick={() => { setMobileOpen((s) => !s) }}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
