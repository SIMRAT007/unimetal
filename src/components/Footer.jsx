import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../config/collections'
import { useSingleton } from '../hooks/useCms'
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Globe } from 'lucide-react'
import logo from '../assets/logo.png'

const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
}

const SocialIcon = ({ platform }) => {
  const Icon = SOCIAL_ICONS[platform?.toLowerCase()] || Globe
  return <Icon size={20} />
}

// Where common footer links go when no URL has been set in the admin panel
const DEFAULT_LINKS = {
  about: '/#about',
  'about us': '/#about',
  contact: '/contact',
  'contact us': '/contact',
  products: '/products',
  'data center': '/data-center',
  'data centers': '/data-center',
  'data centre': '/data-center',
  'data centres': '/data-center',
  faq: '/#faq',
  'delivery information': '/products#delivery',
  delivery: '/products#delivery',
  'credit application': '/contact#credit-application',
}

const resolveUrl = (link) => {
  const url = (link.url || '').trim()
  if (url) return url.startsWith('tel:') ? url.replace(/\s+/g, '') : url
  return DEFAULT_LINKS[(link.label || '').trim().toLowerCase()] || ''
}

// Links without a destination (and links to the removed Industries section) are hidden
const footerLinks = (links = []) => links
  .map((link) => ({ ...link, url: resolveUrl(link) }))
  .filter((link) => link.url && !/industr/i.test(link.url))

const Footer = () => {
  const { data, loading } = useSingleton(COLLECTIONS.footer)

  if (loading) return null
  if (!data.description && !data.columns?.length && !data.copyright) return null

  const socialLinks = (data.social || []).filter((s) => s.url?.trim())

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <img src={data?.logo || logo} alt={data?.logoText || ''} className="footer-logo" />
            {data.description && <p className="footer-desc">{data.description}</p>}
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    className={`footer-social-link footer-social-${(s.platform || 'default').toLowerCase()}`}
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {data.columns?.map((col, i) => (
            <div key={i} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {footerLinks(col.links).map((link, j) => (
                  <li key={j}>
                    {link.url.startsWith('http') ? (
                      <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                    ) : link.url.startsWith('/') ? (
                      <Link to={link.url}>{link.label}</Link>
                    ) : (
                      <a href={link.url}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {data.copyright && <div className="footer-copy">{data.copyright}</div>}
      </div>
    </footer>
  )
}

export default Footer
