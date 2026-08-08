import { useState } from 'react'
import { Link } from 'react-router-dom'
import { auth, signInWithEmailAndPassword } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

const requiredEmail = import.meta.env.VITE_ADMIN_EMAIL

const AdminLogin = () => {
  const [email, setEmail] = useState(requiredEmail || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-auth-card">
      <div className="logo"><LayoutDashboard size={22} /> Unimetal <span>Admin</span></div>
      <h2 className="section-title">Admin Login</h2>
      <p className="text-muted">Sign in to manage your website content.</p>
      {requiredEmail && (
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          Only <strong>{requiredEmail}</strong> can sign in.
        </p>
      )}
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@unimetal.com"
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="admin-auth-footer">
        <Link to="/admin/setup">First time? Run setup</Link>
      </p>
    </div>
  )
}

export default AdminLogin
