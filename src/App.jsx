import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoadingProvider } from './context/LoadingContext'
import { useSingleton } from './hooks/useCms'
import Layout from './components/Layout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import IndustryPage from './pages/IndustryPage'
import CapabilityPage from './pages/CapabilityPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminLayout from './components/admin/AdminLayout'
import AdminModule from './pages/Admin/AdminModule'
import IndustriesAdmin from './pages/Admin/IndustriesAdmin'
import CapabilitiesAdmin from './pages/Admin/CapabilitiesAdmin'
import ProductsAdmin from './pages/Admin/ProductsAdmin'
import HeroSlidesAdmin from './pages/Admin/HeroSlidesAdmin'
import AboutAdmin from './pages/Admin/AboutAdmin'
import FaqAdmin from './pages/Admin/FaqAdmin'
import FooterAdmin from './pages/Admin/FooterAdmin'
import Setup from './pages/Admin/Setup'
import ScrollReveal from './components/ScrollReveal'
import InitialLoader from './components/InitialLoader'
import Offline from './components/Offline'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL

const ProtectedAdmin = ({ children }) => {
  const { user, loading } = useAuth()
  const { data: setup, loading: setupLoading } = useSingleton('config/setup')

  if (loading || setupLoading) return <div className="loading">Checking auth...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  if (!setup.done) return <Navigate to="/admin/setup" replace />

  const allowedEmail = adminEmail || setup.adminEmail
  if (allowedEmail && user.email !== allowedEmail) {
    return <div className="loading">Not authorized. Only the configured admin can access the panel.</div>
  }

  return children
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <LoadingProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
              <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/industries/:slug" element={<Layout><IndustryPage /></Layout>} />
              <Route path="/capabilities/:slug" element={<Layout><CapabilityPage /></Layout>} />
              <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup" element={<Setup />} />
              <Route
                path="/admin"
                element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}
              >
                <Route index element={<AdminDashboard />} />
                <Route path="industries" element={<IndustriesAdmin />} />
                <Route path="capabilities" element={<CapabilitiesAdmin />} />
                <Route path="products" element={<ProductsAdmin />} />
                <Route path="heroSlides" element={<HeroSlidesAdmin />} />
                <Route path="about" element={<AboutAdmin />} />
                <Route path="faq" element={<FaqAdmin />} />
                <Route path="footer" element={<FooterAdmin />} />
                <Route path=":module" element={<AdminModule />} />
              </Route>
            </Routes>
            <ScrollReveal />
            <InitialLoader />
            <Offline />
          </Router>
        </LoadingProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App
