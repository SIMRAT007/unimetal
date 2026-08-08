import { useEffect, useState } from 'react'
import { getSingleton, saveSingleton } from '../../lib/cms'
import FieldRenderer from './FieldRenderer'
import { Loader2, Save } from 'lucide-react'

const SingletonEditor = ({ path, fields, defaults = {} }) => {
  const [data, setData] = useState({ ...defaults })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getSingleton(path, defaults).then((res) => {
      if (!mounted) return
      setData({ ...defaults, ...res })
      setLoading(false)
    })
    return () => { mounted = false }
  }, [path])

  const handleChange = (name, value) => setData((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(path, data)
      setSaveMessage({ type: 'success', text: 'Saved successfully' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <form className="singleton-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <FieldRenderer
          key={field.name}
          field={field}
          value={data[field.name]}
          onChange={(v) => handleChange(field.name, v)}
        />
      ))}
      {saveMessage && (
        <div className={saveMessage.type} style={{ marginBottom: '1rem' }}>
          {saveMessage.text}
        </div>
      )}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <><Loader2 size={16} className="spin" /> Saving…</> : <><Save size={16} /> Save</>}
        </button>
      </div>
    </form>
  )
}

export default SingletonEditor
