import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, createUserWithEmailAndPassword } from '../../firebase'
import { getSingleton, saveSingleton, seedCollection } from '../../lib/cms'
import { seedCategories, seedCapabilities } from '../../config/collections'
import { LayoutDashboard } from 'lucide-react'

const requiredEmail = import.meta.env.VITE_ADMIN_EMAIL

const Setup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState(requiredEmail || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    getSingleton('config/setup', { done: false }).then((data) => {
      if (!mounted) return
      if (data.done) navigate('/admin')
      setLoading(false)
    })
    return () => { mounted = false }
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (requiredEmail && email !== requiredEmail) {
      setError(`Setup must use the admin email configured in .env: ${requiredEmail}`)
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setSaving(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await saveSingleton('config/setup', { done: true, adminEmail: userCredential.user.email })
      await Promise.all([
        seedCollection('categories', seedCategories),
        seedCollection('capabilities', seedCapabilities),
      ])
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading">Checking setup…</div>

  return (
    <div className="admin-auth-card">
      <div className="logo"><LayoutDashboard size={22} /> Unimetal <span>Admin</span></div>
      <h1 className="section-title">One-time setup</h1>
      <p className="text-muted">Create the first admin account and seed the default categories & capabilities.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Admin email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Confirm password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Setting up…' : 'Create admin & seed data'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Setup
