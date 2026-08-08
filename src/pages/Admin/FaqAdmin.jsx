import { useEffect, useState } from 'react'
import { HelpCircle, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { getSingleton, saveSingleton } from '../../lib/cms'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'
import { COLLECTIONS, defaultFaq } from '../../config/collections'

const mainFields = [
  { name: 'active', label: 'Show on Website', type: 'boolean' },
  { name: 'bgColor', label: 'Background Color', type: 'color' },
  { name: 'tag', label: 'Eyebrow Tag', type: 'text' },
  { name: 'heading', label: 'Heading', type: 'text' },
  { name: 'subheading', label: 'Subheading', type: 'textarea' },
  { name: 'ctaHeading', label: 'CTA Heading', type: 'text' },
  { name: 'ctaSubtext', label: 'CTA Subtext', type: 'textarea' },
  { name: 'ctaButtonText', label: 'CTA Button Text', type: 'text' },
  { name: 'ctaButtonLink', label: 'CTA Button Link', type: 'text' },
]

const itemFields = [
  { name: 'question', label: 'Question', type: 'text' },
  { name: 'answer', label: 'Answer', type: 'textarea' },
]

const emptyItem = () => ({ question: '', answer: '' })

const FaqAdmin = () => {
  const [data, setData] = useState({ ...defaultFaq })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [itemForm, setItemForm] = useState(emptyItem())

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const res = await getSingleton(COLLECTIONS.faq, defaultFaq)
    setData({ ...defaultFaq, ...res })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (name, value) => setData((p) => ({ ...p, [name]: value }))
  const handleItemChange = (name, value) => setItemForm((p) => ({ ...p, [name]: value }))

  const saveMain = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.faq, data)
      setSaveMessage({ type: 'success', text: 'FAQ section saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const saveItem = async (e) => {
    e.preventDefault()
    const items = [...(data.items || [])]
    if (editingIndex !== null && editingIndex >= 0) {
      items[editingIndex] = itemForm
    } else {
      items.push(itemForm)
    }
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.faq, { ...data, items })
      setModalOpen(false)
      setEditingIndex(null)
      setItemForm(emptyItem())
      await load()
      setSaveMessage({ type: 'success', text: editingIndex !== null ? 'Question updated' : 'Question added' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save question' })
    } finally {
      setSaving(false)
    }
  }

  const editItem = (item, index) => { setEditingIndex(index); setItemForm({ ...item }); setModalOpen(true) }
  const newItem = () => { setEditingIndex(null); setItemForm(emptyItem()); setModalOpen(true) }
  const deleteItem = async (index) => {
    if (!confirm('Delete this question?')) return
    const items = [...(data.items || [])]
    items.splice(index, 1)
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.faq, { ...data, items })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete question' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1><HelpCircle size={24} /> FAQ</h1>
        <p className="text-muted">Manage FAQ section heading and questions.</p>
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
          <h2 className="admin-section-title">Questions List</h2>
          <button type="button" className="btn btn-primary" onClick={newItem}>
            <Plus size={16} /> Add Question
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.items || []).map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.question}</td>
                  <td>{item.answer}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => editItem(item, index)} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteItem(index)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data.items || []).length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-cell">No questions yet. Click Add Question to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingIndex !== null ? 'Edit Question' : 'Add Question'}>
        <form onSubmit={saveItem} className="collection-form">
          {itemFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={itemForm[f.name]} onChange={(v) => handleItemChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingIndex !== null ? 'Update' : 'Add'} Question
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default FaqAdmin
