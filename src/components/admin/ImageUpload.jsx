import { useState } from 'react'
import { Plus, X, ImageIcon } from 'lucide-react'

const isImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const ImageUpload = ({ value = '', onChange, multiple = false, folder = '' }) => {
  const [url, setUrl] = useState('')
  const [brokenUrls, setBrokenUrls] = useState(new Set())

  const values = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []

  const addUrl = () => {
    const trimmed = url.trim()
    if (!isImageUrl(trimmed)) return
    if (multiple) {
      onChange([...values, trimmed])
    } else {
      onChange(trimmed)
    }
    setUrl('')
  }

  const handleRemove = (imageUrl) => {
    if (multiple) {
      onChange(values.filter((u) => u !== imageUrl))
    } else {
      onChange('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addUrl()
    }
  }

  return (
    <div className="image-upload">
      {values.map((imageUrl) => (
        <div key={imageUrl} className="image-preview-wrap">
          {brokenUrls.has(imageUrl) ? (
            <div className="image-preview image-preview-broken">
              <ImageIcon size={24} />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt=""
              className="image-preview"
              onError={() => setBrokenUrls((prev) => new Set(prev).add(imageUrl))}
            />
          )}
          <button type="button" className="image-remove" onClick={() => handleRemove(imageUrl)} aria-label="Remove image">
            <X size={14} />
          </button>
        </div>
      ))}

      <div className="image-url-field">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/image.jpg"
          className="image-url-input"
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={addUrl}
          disabled={!isImageUrl(url.trim())}
        >
          <Plus size={16} /> {multiple ? 'Add' : 'Set'}
        </button>
      </div>

      {values.length === 0 && !url && (
        <div className="image-placeholder">
          <ImageIcon size={20} />
          <span>Paste an image URL to preview</span>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
