import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext'

const InitialLoader = () => {
  const { firstLoadDone } = useLoading()
  const [showRefresh, setShowRefresh] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRefresh(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  if (firstLoadDone) return null

  return (
    <div className="initial-loader">
      <div className="initial-loader-spinner" />
      <p className="initial-loader-text">UNI Metal</p>
      {showRefresh && (
        <div className="initial-loader-refresh">
          <p>If the page doesn’t load, please refresh.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      )}
    </div>
  )
}

export default InitialLoader
