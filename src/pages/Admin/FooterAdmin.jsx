import { useEffect, useState } from 'react'
import { FileText, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { getSingleton, saveSingleton } from '../../lib/cms'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'
import { COLLECTIONS, defaultFooter } from '../../config/collections'

const mainFields = [
  { name: 'logo', label: 'Logo', type: 'image', folder: 'footer' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'copyright', label: 'Copyright', type: 'text' },
]

const socialFields = [
  { name: 'platform', label: 'Platform', type: 'text' },
  { name: 'url', label: 'URL', type: 'url' },
]

const columnFields = [
  { name: 'title', label: 'Title', type: 'text' },
]

const linkFields = [
  { name: 'label', label: 'Label', type: 'text' },
  { name: 'url', label: 'URL', type: 'url' },
]

const emptySocial = () => ({ platform: '', url: '' })
const emptyColumn = () => ({ title: '', links: [] })
const emptyLink = () => ({ label: '', url: '' })

const FooterAdmin = () => {
  const [data, setData] = useState({ ...defaultFooter })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const [socialModalOpen, setSocialModalOpen] = useState(false)
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [linkModalOpen, setLinkModalOpen] = useState(false)

  const [editingSocialIndex, setEditingSocialIndex] = useState(null)
  const [editingColumnIndex, setEditingColumnIndex] = useState(null)
  const [editingLinkPath, setEditingLinkPath] = useState(null)

  const [socialForm, setSocialForm] = useState(emptySocial())
  const [columnForm, setColumnForm] = useState(emptyColumn())
  const [linkForm, setLinkForm] = useState(emptyLink())

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const res = await getSingleton(COLLECTIONS.footer, defaultFooter)
    setData({ ...defaultFooter, ...res })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleChange = (name, value) => setData((p) => ({ ...p, [name]: value }))
  const handleSocialChange = (name, value) => setSocialForm((p) => ({ ...p, [name]: value }))
  const handleColumnChange = (name, value) => setColumnForm((p) => ({ ...p, [name]: value }))
  const handleLinkChange = (name, value) => setLinkForm((p) => ({ ...p, [name]: value }))

  const saveMain = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, data)
      setSaveMessage({ type: 'success', text: 'Footer saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save' })
    } finally {
      setSaving(false)
    }
  }

  const saveSocial = async (e) => {
    e.preventDefault()
    const social = [...(data.social || [])]
    if (editingSocialIndex !== null && editingSocialIndex >= 0) {
      social[editingSocialIndex] = socialForm
    } else {
      social.push(socialForm)
    }
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, social })
      setSocialModalOpen(false)
      setEditingSocialIndex(null)
      setSocialForm(emptySocial())
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save social' })
    } finally {
      setSaving(false)
    }
  }

  const saveColumn = async (e) => {
    e.preventDefault()
    const columns = [...(data.columns || [])]
    if (editingColumnIndex !== null && editingColumnIndex >= 0) {
      const existing = columns[editingColumnIndex]
      columns[editingColumnIndex] = { ...columnForm, links: existing.links || [] }
    } else {
      columns.push({ ...columnForm, links: [] })
    }
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, columns })
      setColumnModalOpen(false)
      setEditingColumnIndex(null)
      setColumnForm(emptyColumn())
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save column' })
    } finally {
      setSaving(false)
    }
  }

  const saveLink = async (e) => {
    e.preventDefault()
    const columns = [...(data.columns || [])]
    const { columnIndex, linkIndex } = editingLinkPath || {}
    if (columnIndex == null) return
    const column = { ...columns[columnIndex], links: [...(columns[columnIndex].links || [])] }
    if (linkIndex != null && linkIndex >= 0) {
      column.links[linkIndex] = linkForm
    } else {
      column.links.push(linkForm)
    }
    columns[columnIndex] = column
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, columns })
      setLinkModalOpen(false)
      setEditingLinkPath(null)
      setLinkForm(emptyLink())
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save link' })
    } finally {
      setSaving(false)
    }
  }

  const editSocial = (social, index) => { setEditingSocialIndex(index); setSocialForm({ ...social }); setSocialModalOpen(true) }
  const newSocial = () => { setEditingSocialIndex(null); setSocialForm(emptySocial()); setSocialModalOpen(true) }
  const deleteSocial = async (index) => {
    if (!confirm('Delete this social link?')) return
    const social = [...(data.social || [])]
    social.splice(index, 1)
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, social })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete social' })
    } finally {
      setSaving(false)
    }
  }

  const editColumn = (column, index) => { setEditingColumnIndex(index); setColumnForm({ title: column.title }); setColumnModalOpen(true) }
  const newColumn = () => { setEditingColumnIndex(null); setColumnForm(emptyColumn()); setColumnModalOpen(true) }
  const deleteColumn = async (index) => {
    if (!confirm('Delete this column and all its links?')) return
    const columns = [...(data.columns || [])]
    columns.splice(index, 1)
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, columns })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete column' })
    } finally {
      setSaving(false)
    }
  }

  const editLink = (columnIndex, link, linkIndex) => {
    setEditingLinkPath({ columnIndex, linkIndex })
    setLinkForm({ ...link })
    setLinkModalOpen(true)
  }
  const newLink = (columnIndex) => {
    setEditingLinkPath({ columnIndex, linkIndex: null })
    setLinkForm(emptyLink())
    setLinkModalOpen(true)
  }
  const deleteLink = async (columnIndex, linkIndex) => {
    if (!confirm('Delete this link?')) return
    const columns = [...(data.columns || [])]
    const column = { ...columns[columnIndex], links: [...(columns[columnIndex].links || [])] }
    column.links.splice(linkIndex, 1)
    columns[columnIndex] = column
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.footer, { ...data, columns })
      await load()
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to delete link' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1><FileText size={24} /> Footer</h1>
        <p className="text-muted">Manage footer content, columns and social links.</p>
      </div>

      {saveMessage && (
        <div className={saveMessage.type} style={{ marginBottom: '1.5rem' }}>
          {saveMessage.text}
        </div>
      )}

      <div className="admin-combined-section">
        <h2 className="admin-section-title">Footer Content</h2>
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
          <h2 className="admin-section-title">Social Links</h2>
          <button type="button" className="btn btn-primary" onClick={newSocial}>
            <Plus size={16} /> Add Social
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Platform</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.social || []).map((s, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{s.platform}</td>
                  <td>{s.url}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => editSocial(s, index)} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteSocial(index)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {(data.social || []).length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-cell">No social links yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-combined-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Footer Columns</h2>
          <button type="button" className="btn btn-primary" onClick={newColumn}>
            <Plus size={16} /> Add Column
          </button>
        </div>
        {(data.columns || []).map((column, columnIndex) => (
          <div key={columnIndex} className="admin-combined-section" style={{ marginLeft: '1rem' }}>
            <div className="admin-section-header">
              <h3 className="admin-section-title">{column.title || `Column ${columnIndex + 1}`}</h3>
              <div className="admin-section-actions">
                <button type="button" className="btn btn-sm btn-primary" onClick={() => newLink(columnIndex)}>
                  <Plus size={14} /> Add Link
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => editColumn(column, columnIndex)}>
                  <Edit2 size={14} /> Edit
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => deleteColumn(columnIndex)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Label</th>
                    <th>URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(column.links || []).map((link, linkIndex) => (
                    <tr key={linkIndex}>
                      <td>{linkIndex + 1}</td>
                      <td>{link.label}</td>
                      <td>{link.url}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="btn-icon" onClick={() => editLink(columnIndex, link, linkIndex)} title="Edit"><Edit2 size={16} /></button>
                          <button type="button" className="btn-icon" onClick={() => deleteLink(columnIndex, linkIndex)} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(column.links || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-cell">No links in this column yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {(data.columns || []).length === 0 && (
          <div className="admin-table-wrap" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No footer columns yet. Click Add Column to create one.
          </div>
        )}
      </div>

      <Modal open={socialModalOpen} onClose={() => setSocialModalOpen(false)} title={editingSocialIndex !== null ? 'Edit Social' : 'Add Social'}>
        <form onSubmit={saveSocial} className="collection-form">
          {socialFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={socialForm[f.name]} onChange={(v) => handleSocialChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingSocialIndex !== null ? 'Update' : 'Add'} Social
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setSocialModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={columnModalOpen} onClose={() => setColumnModalOpen(false)} title={editingColumnIndex !== null ? 'Edit Column' : 'Add Column'}>
        <form onSubmit={saveColumn} className="collection-form">
          {columnFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={columnForm[f.name]} onChange={(v) => handleColumnChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingColumnIndex !== null ? 'Update' : 'Add'} Column
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setColumnModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={linkModalOpen} onClose={() => setLinkModalOpen(false)} title={editingLinkPath?.linkIndex != null ? 'Edit Link' : 'Add Link'}>
        <form onSubmit={saveLink} className="collection-form">
          {linkFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={linkForm[f.name]} onChange={(v) => handleLinkChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {editingLinkPath?.linkIndex != null ? 'Update' : 'Add'} Link
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setLinkModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default FooterAdmin
