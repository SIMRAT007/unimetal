import { useEffect, useState } from 'react'
import { Info, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { getSingleton, saveSingleton } from '../../lib/cms'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'
import { COLLECTIONS, defaultAbout } from '../../config/collections'

const mainFields = [
  { name: 'active', label: 'Show on Website', type: 'boolean' },
  { name: 'bgColor', label: 'Background Color', type: 'color' },
  { name: 'tag', label: 'Eyebrow Tag', type: 'text' },
  { name: 'heading', label: 'Heading', type: 'text' },
  { name: 'description', label: 'Description', type: 'richText' },
  { name: 'buttonText', label: 'Button Text', type: 'text' },
  { name: 'buttonLink', label: 'Button Link', type: 'text' },
]

const imageFields = [
  { name: 'image', label: 'Image', type: 'image', folder: 'about' },
]

const statFields = [
  { name: 'value', label: 'Value', type: 'text' },
  { name: 'label', label: 'Label', type: 'text' },
]

const emptyImage = () => ({ image: '' })
const emptyStat = () => ({ value: '', label: '' })

const AboutAdmin = () => {
  const [data, setData] = useState({ ...defaultAbout })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [statModalOpen, setStatModalOpen] = useState(false)
  const [editingImageIndex, setEditingImageIndex] = useState(null)
  const [editingStatIndex, setEditingStatIndex] = useState(null)
  const [imageForm, setImageForm] = useState(emptyImage())
  const [statForm, setStatForm] = useState(emptyStat())

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const res = await getSingleton(COLLECTIONS.about, defaultAbout)
    setData({ ...defaultAbout, ...res })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (name, value) => setData((p) => ({ ...p, [name]: value }))
  const handleImageChange = (name, value) => setImageForm((p) => ({ ...p, [name]: value }))
  const handleStatChange = (name, value) => setStatForm((p) => ({ ...p, [name]: value }))

  const saveMain = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.about, data)
      setSaveMessage({ type: 'success', text: 'About section saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const saveImage = async (e) => {
    e.preventDefault()
    const images = [...(data.images || [])]
    if (editingImageIndex !== null && editingImageIndex >= 0) {
      images[editingImageIndex] = imageForm
    } else {
      images.push(imageForm)
    }
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.about, { ...data, images })
      setImageModalOpen(false)
      setEditingImageIndex(null)
      setImageForm(emptyImage())
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save image' })
    } finally {
      setSaving(false)
    }
  }

  const saveStat = async (e) => {
    e.preventDefault()
    const stats = [...(data.stats || [])]
    if (editingStatIndex !== null && editingStatIndex >= 0) {
      stats[editingStatIndex] = statForm
    } else {
      stats.push(statForm)
    }
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.about, { ...data, stats })
      setStatModalOpen(false)
      setEditingStatIndex(null)
      setStatForm(emptyStat())
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save stat' })
    } finally {
      setSaving(false)
    }
  }

  const editImage = (image, index) => { setEditingImageIndex(index); setImageForm({ ...image }); setImageModalOpen(true) }
  const newImage = () => { setEditingImageIndex(null); setImageForm(emptyImage()); setImageModalOpen(true) }
  const deleteImage = async (index) => {
    if (!confirm('Delete this image?')) return
    const images = [...(data.images || [])]
    images.splice(index, 1)
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.about, { ...data, images })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete image' })
    } finally {
      setSaving(false)
    }
  }

  const editStat = (stat, index) => { setEditingStatIndex(index); setStatForm({ ...stat }); setStatModalOpen(true) }
  const newStat = () => { setEditingStatIndex(null); setStatForm(emptyStat()); setStatModalOpen(true) }
  const deleteStat = async (index) => {
    if (!confirm('Delete this stat?')) return
    const stats = [...(data.stats || [])]
    stats.splice(index, 1)
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.about, { ...data, stats })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete stat' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1><Info size={24} /> About</h1>
        <p className="text-muted">Manage the About section content, images and stats.</p>
      </div>

      {saveMessage && (
        <div className={saveMessage.type} style={{ marginBottom: '1.5rem' }}>
          {saveMessage.text}
        </div>
      )}

      <div className="admin-combined-section">
        <h2 className="admin-section-title">Section Content</h2>
        <form className="singleton-form" onSubmit={saveMain}>
          {mainFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={data[field.name]}
              onChange={(v) => handleChange(field.name, v)}
            />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Edit2 size={16} />}
              Save Content
            </button>
          </div>
        </form>
      </div>

      <div className="admin-combined-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Images</h2>
          <button type="button" className="btn btn-primary" onClick={newImage}>
            <Plus size={16} /> Add Image
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.images || []).map((img, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{img.image ? <img src={img.image} alt="" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : 'No image'}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => editImage(img, index)} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteImage(index)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data.images || []).length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-cell">No images yet. Click Add Image to upload one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-combined-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Stats</h2>
          <button type="button" className="btn btn-primary" onClick={newStat}>
            <Plus size={16} /> Add Stat
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Value</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.stats || []).map((stat, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{stat.value}</td>
                  <td>{stat.label}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => editStat(stat, index)} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteStat(index)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data.stats || []).length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-cell">No stats yet. Click Add Stat to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={imageModalOpen} onClose={() => setImageModalOpen(false)} title={editingImageIndex !== null ? 'Edit Image' : 'Add Image'}>
        <form onSubmit={saveImage} className="collection-form">
          {imageFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={imageForm[f.name]} onChange={(v) => handleImageChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingImageIndex !== null ? 'Update' : 'Add'} Image
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setImageModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={statModalOpen} onClose={() => setStatModalOpen(false)} title={editingStatIndex !== null ? 'Edit Stat' : 'Add Stat'}>
        <form onSubmit={saveStat} className="collection-form">
          {statFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={statForm[f.name]} onChange={(v) => handleStatChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingStatIndex !== null ? 'Update' : 'Add'} Stat
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setStatModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AboutAdmin
