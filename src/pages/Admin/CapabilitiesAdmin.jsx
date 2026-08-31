import { useEffect, useState } from 'react'
import { Wrench, Plus, Edit2, Trash2, Loader2, X, GripVertical } from 'lucide-react'
import { getCollection, addItem, updateItem, deleteItem, getSingleton, saveSingleton } from '../../lib/cms'
import { makeSlug } from '../../lib/utils'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'
import { COLLECTIONS, defaultCapabilitiesSection } from '../../config/collections'

const sectionFields = [
  { name: 'active', label: 'Show on Website', type: 'boolean' },
  { name: 'heading', label: 'Heading Line 1', type: 'text' },
  { name: 'highlight', label: 'Heading Line 2', type: 'text' },
]

const capabilityFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'image', label: 'Image', type: 'image', folder: 'capabilities' },
  { name: 'heading', label: 'Heading', type: 'text' },
  { name: 'description', label: 'Description', type: 'richText' },
  { name: 'bulletPoints', label: 'Bullet Points', type: 'repeater', repeaterFields: [{ name: 'text', label: 'Point', type: 'text' }] },
  { name: 'imagePosition', label: 'Image Position', type: 'select', options: [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ]},
  { name: 'order', label: 'Order', type: 'number' },
  { name: 'active', label: 'Active', type: 'boolean' },
]

const emptyCapability = () => ({ name: '', slug: '', order: 0, active: true, image: '', heading: '', description: '', bulletPoints: [], imagePosition: 'left' })

const CapabilitiesAdmin = () => {
  const [items, setItems] = useState([])
  const [section, setSection] = useState({ ...defaultCapabilitiesSection })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyCapability())
  const [draggedId, setDraggedId] = useState(null)

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const [i, s] = await Promise.all([
      getCollection('capabilities'),
      getSingleton(COLLECTIONS.capabilitiesSection, defaultCapabilitiesSection),
    ])
    setItems(i)
    setSection({ ...defaultCapabilitiesSection, ...s })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }))
  const handleSectionChange = (name, value) => setSection((p) => ({ ...p, [name]: value }))

  const saveSection = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.capabilitiesSection, section)
      setSaveMessage({ type: 'success', text: 'Section heading saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save heading' })
    } finally {
      setSaving(false)
    }
  }

  const saveItem = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form }
      if (!data.slug && data.name) data.slug = makeSlug(data.name)
      if (editing) await updateItem('capabilities', editing, data)
      else await addItem('capabilities', data)
      setModalOpen(false)
      setEditing(null)
      setForm(emptyCapability())
      await load()
      setSaveMessage({ type: 'success', text: editing ? 'Capability updated' : 'Capability added' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save capability' })
    } finally {
      setSaving(false)
    }
  }

  const editItem = (item) => { setEditing(item.id); setForm({ ...item }); setModalOpen(true) }
  const newItem = () => { setEditing(null); setForm(emptyCapability()); setModalOpen(true) }
  const deleteItemHandler = async (id) => {
    if (!confirm('Delete this capability?')) return
    await deleteItem('capabilities', id)
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
      await Promise.all(reordered.map((item) => updateItem('capabilities', item.id, { order: item.order })))
      setSaveMessage({ type: 'success', text: 'Capability order saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save capability order' })
    }
  }

  const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0))

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1><Wrench size={24} /> Capabilities</h1>
        <p className="text-muted">Manage the section heading and the list of capabilities.</p>
      </div>

      {saveMessage && (
        <div className={saveMessage.type} style={{ marginBottom: '1.5rem' }}>
          {saveMessage.text}
        </div>
      )}

      <div className="admin-combined-section">
        <h2 className="admin-section-title">Section Heading</h2>
        <form className="singleton-form" onSubmit={saveSection}>
          {sectionFields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={section[field.name]}
              onChange={(v) => handleSectionChange(field.name, v)}
            />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Edit2 size={16} />}
              Save Heading
            </button>
          </div>
        </form>
      </div>

      <div className="admin-combined-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Capabilities List</h2>
          <button type="button" className="btn btn-primary" onClick={newItem}>
            <Plus size={16} /> Add Capability
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="drag-th" />
                <th>S.No</th>
                <th>Name</th>
                <th>Heading</th>
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
                  <td>{item.name}</td>
                  <td>{item.heading}</td>
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
                  <td colSpan="5" className="empty-cell">No capabilities yet. Click Add Capability to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Capability' : 'Add Capability'}>
        <form onSubmit={saveItem} className="collection-form">
          {capabilityFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={form[f.name]} onChange={(v) => handleChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editing ? 'Update' : 'Add'} Capability
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CapabilitiesAdmin
