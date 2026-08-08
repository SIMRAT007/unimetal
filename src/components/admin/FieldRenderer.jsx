import ImageUpload from './ImageUpload'
import RichText from './RichText'
import SortableList from './SortableList'
import { uid, reorder } from '../../lib/utils'
import { Plus, Trash2 } from 'lucide-react'

const emptyValue = (type) => {
  if (type === 'boolean') return false
  if (type === 'images') return []
  if (type === 'repeater') return []
  return ''
}

const Repeater = ({ field, value = [], onChange }) => {
  const items = Array.isArray(value) ? value : []

  const ensureIds = () => items.map((item) => (item.id ? item : { ...item, id: uid() }))

  const handleAdd = () => {
    const next = [...ensureIds()]
    const newItem = { id: uid() }
    field.repeaterFields.forEach((f) => (newItem[f.name] = f.default ?? emptyValue(f.type)))
    next.push(newItem)
    onChange(next)
  }

  const handleChange = (index, item) => {
    const next = [...ensureIds()]
    next[index] = item
    onChange(next)
  }

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleReorder = (next) => onChange(next)

  const list = ensureIds()

  return (
    <div className="repeater">
      <SortableList items={list} onChange={handleReorder} renderItem={(item, i) => (
        <div className="repeater-row">
          <div className="repeater-fields">
            {field.repeaterFields.map((sub) => (
              <FieldRenderer
                key={sub.name}
                field={sub}
                value={item[sub.name]}
                onChange={(v) => handleChange(i, { ...item, [sub.name]: v })}
              />
            ))}
          </div>
          <button type="button" className="btn-icon" onClick={() => handleRemove(i)} title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      )} />
      <button type="button" className="btn btn-secondary" onClick={handleAdd}>
        <Plus size={16} /> Add {field.label || 'item'}
      </button>
    </div>
  )
}

const FieldRenderer = ({ field, value, onChange }) => {
  const { name, label, type, placeholder, options, folder, multiple } = field

  const commonProps = { name, placeholder }

  switch (type) {
    case 'text':
    case 'email':
    case 'tel':
    case 'url':
      return (
        <div className="form-field">
          <label htmlFor={name}>{label}</label>
          <input id={name} type={type} {...commonProps} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case 'number':
      return (
        <div className="form-field">
          <label htmlFor={name}>{label}</label>
          <input id={name} type="number" {...commonProps} value={value ?? ''} onChange={(e) => onChange(e.target.valueAsNumber)} />
        </div>
      )
    case 'textarea':
      return (
        <div className="form-field">
          <label htmlFor={name}>{label}</label>
          <textarea id={name} {...commonProps} rows={4} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      )
    case 'richText':
      return (
        <div className="form-field">
          <label>{label}</label>
          <RichText value={value} onChange={onChange} placeholder={placeholder} />
        </div>
      )
    case 'image':
      return (
        <div className="form-field">
          <label>{label}</label>
          <ImageUpload value={value} onChange={onChange} folder={folder} />
        </div>
      )
    case 'images':
      return (
        <div className="form-field">
          <label>{label}</label>
          <ImageUpload value={value} onChange={onChange} folder={folder} multiple />
        </div>
      )
    case 'color':
      return (
        <div className="form-field">
          <label htmlFor={name}>{label}</label>
          <div className="color-field">
            <input
              id={name}
              type="color"
              value={value || '#ffffff'}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              placeholder="#ffffff"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      )
    case 'boolean':
      return (
        <div className="form-field inline">
          <label className="inline-label">
            <input type="checkbox" name={name} checked={!!value} onChange={(e) => onChange(e.target.checked)} />
            <span>{label}</span>
          </label>
        </div>
      )
    case 'select':
      return (
        <div className="form-field">
          <label htmlFor={name}>{label}</label>
          <select id={name} name={name} value={value || ''} onChange={(e) => onChange(e.target.value)}>
            <option value="">— Select —</option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )
    case 'repeater':
      return (
        <div className="form-field">
          <label>{label}</label>
          <Repeater field={field} value={value} onChange={onChange} />
        </div>
      )
    default:
      return null
  }
}

export default FieldRenderer
