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

const Footer = () => {
  const { data, loading } = useSingleton(COLLECTIONS.footer)

  if (loading) return null
  if (!data.description && !data.columns?.length && !data.copyright) return null

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <img src={logo} alt={data.logoText || ''} className="footer-logo" />
            {data.description && <p className="footer-desc">{data.description}</p>}
            {data.social?.length > 0 && (
              <div className="footer-social">
                {data.social.map((s, i) => (
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
                {col.links?.map((link, j) => (
                  <li key={j}>
                    {link.url?.startsWith('http') ? (
                      <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                    ) : (
                      <Link to={link.url || '#'}>{link.label}</Link>
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
