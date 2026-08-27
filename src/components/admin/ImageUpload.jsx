import { useState, useRef } from 'react'
import { Plus, X, ImageIcon, Upload, Link as LinkIcon, AlertCircle, Loader2 } from 'lucide-react'
import { uploadToCloudinary, deleteFromCloudinary, cloudinaryConfigured } from '../../lib/cloudinary'

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
  const [mode, setMode] = useState('url')
  const [url, setUrl] = useState('')
  const controlledUrl = url || ''
  const [brokenUrls, setBrokenUrls] = useState(new Set())
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)
  const [deleteTokens, setDeleteTokens] = useState({})

  const values = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : []

  const handleUpload = async (files) => {
    if (!cloudinaryConfigured) {
      setUploadError('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
      return
    }
    if (!files?.length) return

    setUploading(true)
    setUploadError('')

    const uploaded = []
    const newTokens = {}
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed.')
        setUploading(false)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Image must be under 5MB.')
        setUploading(false)
        return
      }
      try {
        const { url, deleteToken } = await uploadToCloudinary(file, folder)
        uploaded.push(url)
        if (deleteToken) newTokens[url] = deleteToken
      } catch (err) {
        setUploadError(err.message || 'Upload failed. Please try again.')
        setUploading(false)
        return
      }
    }

    if (multiple) {
      onChange([...values, ...uploaded])
    } else {
      onChange(uploaded[0] || '')
    }
    setDeleteTokens((prev) => ({ ...prev, ...newTokens }))
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploading(false)
  }

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

  const handleRemove = async (imageUrl) => {
    const token = deleteTokens[imageUrl]
    if (token) {
      try {
        await deleteFromCloudinary(token)
      } catch (err) {
        console.warn('Cloudinary delete failed:', err.message)
      }
      setDeleteTokens((prev) => {
        const next = { ...prev }
        delete next[imageUrl]
        return next
      })
    }
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
      <div className="image-upload-tabs">
        <button
          type="button"
          className={`image-upload-tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          <Upload size={16} /> Upload
        </button>
        <button
          type="button"
          className={`image-upload-tab ${mode === 'url' ? 'active' : ''}`}
          onClick={() => setMode('url')}
        >
          <LinkIcon size={16} /> Paste link
        </button>
      </div>

      {mode === 'upload' ? (
        <div className="image-upload-field">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="image-file-input"
            id={`image-upload-${folder || 'default'}`}
          />
          <label htmlFor={`image-upload-${folder || 'default'}`} className="btn btn-secondary image-upload-label">
            {uploading ? <Loader2 size={16} className="spinner" /> : <Upload size={16} />}
            {uploading ? 'Uploading...' : multiple ? 'Choose images' : 'Choose image'}
          </label>
          <span className="image-upload-hint">or paste a URL on the Link tab</span>
        </div>
      ) : (
        <div className="image-url-field">
          <input
            type="url"
            value={controlledUrl}
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
      )}

      {uploadError && (
        <div className="image-upload-error">
          <AlertCircle size={16} />
          {uploadError}
        </div>
      )}

      {values.length === 0 && !uploadError && (
        <div className="image-placeholder">
          <ImageIcon size={20} />
          <span>{mode === 'upload' ? 'Upload an image to preview' : 'Paste an image URL to preview'}</span>
        </div>
      )}

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
    </div>
  )
}

export default ImageUpload
