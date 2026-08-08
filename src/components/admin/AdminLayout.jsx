import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ADMIN_MODULES } from '../../config/adminModules'
import { MODULE_ICONS } from '../../config/adminIcons'
import { LayoutDashboard, Package, LogOut, ExternalLink, Menu, X } from 'lucide-react'

const AdminLayout = () => {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (to) => pathname === to || pathname.startsWith(`${to}/`)
  const DashboardIcon = MODULE_ICONS.dashboard
  const ProductsIcon = MODULE_ICONS.products

  return (
    <div className="admin-shell">
      <header className="admin-mobile-header">
        <Link to="/admin" className="admin-mobile-logo">Unimetal <span>Admin</span></Link>
        <button type="button" className="admin-mobile-toggle" onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <Link to="/admin" className="admin-logo">
          <LayoutDashboard size={22} /> Unimetal <span>Admin</span>
        </Link>

        <nav className="admin-nav" onClick={(e) => e.stopPropagation()}>
          <Link to="/admin" className={pathname === '/admin' ? 'active' : ''} onClick={() => setMobileOpen(false)}>
            <DashboardIcon size={18} /> Dashboard
          </Link>

          {Object.entries(ADMIN_MODULES).map(([key, mod]) => {
            const Icon = MODULE_ICONS[key] || LayoutDashboard
            return (
              <Link key={key} to={`/admin/${key}`} className={isActive(`/admin/${key}`) ? 'active' : ''} onClick={() => setMobileOpen(false)}>
                <Icon size={18} /> {mod.label}
              </Link>
            )
          })}

          <Link to="/admin/products" className={isActive('/admin/products') ? 'active' : ''} onClick={() => setMobileOpen(false)}>
            <ProductsIcon size={18} /> Categories & Products
          </Link>
        </nav>

        <div className="admin-footer">
          <span className="admin-user">{user?.email}</span>
          <button type="button" className="btn btn-secondary" onClick={signOut}>
            <LogOut size={16} /> Log out
          </button>
          <Link to="/" className="back-link" onClick={() => setMobileOpen(false)}>
            <ExternalLink size={16} /> Back to site
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
