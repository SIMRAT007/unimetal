import { useEffect, useState } from 'react'
import { getCollection, addItem, updateItem, deleteItem } from '../../lib/cms'
import FieldRenderer from './FieldRenderer'
import SortableList from './SortableList'
import { makeSlug } from '../../lib/utils'
import { Plus, Edit2, Trash2, Loader2, X, Inbox } from 'lucide-react'

const CollectionManager = ({ collectionName, fields, defaults = {} }) => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ ...defaults })
  const [saveMessage, setSaveMessage] = useState(null)

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const emptyForm = () => ({ ...defaults })

  const load = async () => {
    setLoading(true)
    const data = await getCollection(collectionName, { activeOnly: false })
    setItems(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [collectionName])

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleAdd = () => { setEditing(null); setForm(emptyForm()) }

  const handleEdit = (item) => { setEditing(item.id); setForm({ ...item }) }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    await deleteItem(collectionName, id)
    await load()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form }
      if (!data.slug && data.name) data.slug = makeSlug(data.name)
      if (!data.slug && data.heading) data.slug = makeSlug(data.heading)
      if (editing) await updateItem(collectionName, editing, data)
      else await addItem(collectionName, data)
      setEditing(null)
      setForm(emptyForm())
      await load()
      setSaveMessage({ type: 'success', text: editing ? 'Updated successfully' : 'Added successfully' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const handleReorder = async (next) => {
    setItems(next)
    await Promise.all(next.map((item, i) => updateItem(collectionName, item.id, { order: i })))
  }

  const rowTitle = (item) => item.name || item.heading || item.label || item.title || item.id

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="collection-manager">
      <form className="collection-form" onSubmit={handleSave}>
        <h3 className="form-title">{editing ? 'Edit' : 'Add new'}</h3>
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={form[field.name]}
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
            {saving ? <><Loader2 size={16} className="spin" /> Saving…</> : <><Plus size={16} /> {editing ? 'Update' : 'Add'}</>}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={handleAdd}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="collection-list">
        <h3 className="list-title">Items</h3>
        {items.length === 0 ? (
          <div className="empty-state">
            <Inbox size={32} />
            <h3>No items yet</h3>
            <p>Add one using the form above.</p>
          </div>
        ) : (
          <SortableList items={items} onChange={handleReorder} renderItem={(item) => (
            <div className="collection-row">
              <span className="row-title">{rowTitle(item)}</span>
              <div className="row-actions">
                <span className={`status ${item.active ? 'active' : 'inactive'}`}>{item.active ? 'Active' : 'Hidden'}</span>
                <button type="button" className="btn-icon" onClick={() => handleEdit(item)} title="Edit"><Edit2 size={16} /></button>
                <button type="button" className="btn-icon" onClick={() => handleDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
              </div>
            </div>
          )} />
        )}
      </div>
    </div>
  )
}

export default CollectionManager
