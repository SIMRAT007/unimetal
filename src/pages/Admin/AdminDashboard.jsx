import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { ADMIN_MODULES } from '../../config/adminModules'
import { MODULE_ICONS } from '../../config/adminIcons'

const AdminDashboard = () => {
  const { user } = useAuth()

  const hiddenModules = ['capabilities', 'categories', 'heroSlides', 'about', 'faq', 'footer']

  const modules = [
    ...Object.entries(ADMIN_MODULES)
      .filter(([key]) => !hiddenModules.includes(key))
      .map(([key, mod]) => ({ key, label: mod.label, to: `/admin/${key}`, icon: MODULE_ICONS[key] })),
    { key: 'capabilities', label: 'Capabilities', to: '/admin/capabilities', icon: MODULE_ICONS.capabilities },
    { key: 'products', label: 'Categories & Products', to: '/admin/products', icon: MODULE_ICONS.products },
    { key: 'heroSlides', label: 'Hero Slides', to: '/admin/heroSlides', icon: MODULE_ICONS.heroSlides },
    { key: 'about', label: 'About', to: '/admin/about', icon: MODULE_ICONS.about },
    { key: 'faq', label: 'FAQ', to: '/admin/faq', icon: MODULE_ICONS.faq },
    { key: 'footer', label: 'Footer', to: '/admin/footer', icon: MODULE_ICONS.footer },
  ]

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Welcome back, {user?.email}.</p>
      </div>
      <div className="admin-modules-grid">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <div key={mod.key} className="admin-module-card">
              <div className="admin-module-icon">{Icon ? <Icon size={22} /> : null}</div>
              <h3>{mod.label}</h3>
              <p className="text-muted">Manage {mod.label.toLowerCase()} content.</p>
              <Link className="btn btn-primary" to={mod.to} style={{ width: '100%' }}>Open</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashboard
