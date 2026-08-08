import { COLLECTIONS } from '../config/collections'
import { useSingleton } from '../hooks/useCms'
import { MapPin, Mail, Phone } from 'lucide-react'

const TopBar = () => {
  const { data } = useSingleton(COLLECTIONS.topbar)

  if (!data.active) return null

  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-left">
          {data.address && (
            <span className="top-bar-item">
              <MapPin size={14} />
              {data.address}
            </span>
          )}
        </div>
        <div className="top-bar-right">
          {data.email && (
            <a className="top-bar-item" href={`mailto:${data.email}`}>
              <Mail size={14} />
              {data.email}
            </a>
          )}
          {data.phone && (
            <a className="top-bar-item" href={`tel:${data.phone.replace(/\s/g, '')}`}>
              <Phone size={14} />
              {data.phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
