import { useEffect, useState } from 'react'
import { Image, Plus, Edit2, Trash2, Loader2, X, GripVertical } from 'lucide-react'
import { getCollection, addItem, updateItem, deleteItem } from '../../lib/cms'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'

const slideFields = [
  { name: 'image', label: 'Image', type: 'image', folder: 'hero' },
  { name: 'tag', label: 'Tag / Label', type: 'text' },
  { name: 'heading', label: 'Heading Line 1', type: 'text' },
  { name: 'headingLine2', label: 'Heading Line 2', type: 'text' },
  { name: 'headingAccent', label: 'Heading Accent (e.g. 24/7)', type: 'text' },
  { name: 'subheading', label: 'Subheading', type: 'textarea' },
  { name: 'buttonText', label: 'Primary Button Text', type: 'text' },
  { name: 'buttonLink', label: 'Primary Button Link', type: 'text' },
  { name: 'buttonText2', label: 'Secondary Button Text', type: 'text' },
  { name: 'buttonLink2', label: 'Secondary Button Link', type: 'text' },
  { name: 'order', label: 'Order', type: 'number' },
  { name: 'active', label: 'Active', type: 'boolean' },
]

const emptySlide = () => ({ image: '', tag: '', heading: '', headingLine2: '', headingAccent: '', subheading: '', buttonText: '', buttonLink: '', buttonText2: '', buttonLink2: '', order: 0, active: true })

const HeroSlidesAdmin = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptySlide())
  const [draggedId, setDraggedId] = useState(null)

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const data = await getCollection('heroSlides')
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }))

  const saveItem = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) await updateItem('heroSlides', editing, form)
      else await addItem('heroSlides', form)
      setModalOpen(false)
      setEditing(null)
      setForm(emptySlide())
      await load()
      setSaveMessage({ type: 'success', text: editing ? 'Slide updated' : 'Slide added' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save slide' })
    } finally {
      setSaving(false)
    }
  }

  const editItem = (item) => { setEditing(item.id); setForm({ ...item }); setModalOpen(true) }
  const newItem = () => { setEditing(null); setForm(emptySlide()); setModalOpen(true) }
  const deleteItemHandler = async (id) => {
    if (!confirm('Delete this slide?')) return
    await deleteItem('heroSlides', id)
    await load()
  }

  const reorderList = (list, fromId, toId) => {
    const fromIndex = list.findIndex((i) => i.id === fromId)
    const toIndex = list.findIndex((i) => i.id === toId)
    if (fromIndex < 0 || toIndex < 0) return null
    const moved = list[fromIndex]
    const reordered = list.filter((_, i) => i !== fromIndex)
    reordered.splice(toIndex, 0, moved)
    return reordered.map((item, i) => ({ ...item, order: i + 1 }))
  }

  const handleReorder = async (fromId, toId) => {
    const list = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))
    const reordered = reorderList(list, fromId, toId)
    if (!reordered) return
    setItems(reordered)
    try {
      await Promise.all(reordered.map((item) => updateItem('heroSlides', item.id, { order: item.order })))
      setSaveMessage({ type: 'success', text: 'Slide order saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save slide order' })
    }
  }

  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1><Image size={24} /> Hero Slides</h1>
        <p className="text-muted">Manage homepage hero slider slides.</p>
      </div>

      {saveMessage && (
        <div className={saveMessage.type} style={{ marginBottom: '1.5rem' }}>
          {saveMessage.text}
        </div>
      )}

      <div className="admin-combined-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Slides List</h2>
          <button type="button" className="btn btn-primary" onClick={newItem}>
            <Plus size={16} /> Add Slide
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="drag-th" />
                <th>S.No</th>
                <th>Heading</th>
                <th>Button</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => (
                <tr
                  key={item.id}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData('text/plain', item.id); setDraggedId(item.id) }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const fromId = e.dataTransfer.getData('text/plain')
                    if (fromId && fromId !== item.id) handleReorder(fromId, item.id)
                    setDraggedId(null)
                  }}
                  onDragEnd={() => setDraggedId(null)}
                  style={{ opacity: draggedId === item.id ? 0.5 : 1 }}
                >
                  <td className="drag-handle" style={{ cursor: 'grab' }}><GripVertical size={18} /></td>
                  <td>{index + 1}</td>
                  <td>{item.heading}</td>
                  <td>{item.buttonText}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => editItem(item)} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteItemHandler(item.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-cell">No slides yet. Click Add Slide to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Slide' : 'Add Slide'}>
        <form onSubmit={saveItem} className="collection-form">
          {slideFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={form[f.name]} onChange={(v) => handleChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editing ? 'Update' : 'Add'} Slide
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default HeroSlidesAdmin
