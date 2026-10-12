import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  // Scroll to #section links (e.g. /#about); sections load from the CMS, so wait for them to appear
  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const timer = setInterval(() => {
      const el = document.getElementById(id)
      if (el || ++tries > 30) {
        clearInterval(timer)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
    return () => clearInterval(timer)
  }, [pathname, hash])

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
