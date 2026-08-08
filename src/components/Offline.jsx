import { useState, useEffect } from 'react'
import { WifiOff } from 'lucide-react'

const Offline = () => {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="offline-page">
      <div className="offline-box">
        <WifiOff size={96} strokeWidth={1.2} className="offline-icon" />
        <h2 className="offline-title">No Internet Connection</h2>
        <p className="offline-text">Please check your internet and try again.</p>
      </div>
    </div>
  )
}

export default Offline
