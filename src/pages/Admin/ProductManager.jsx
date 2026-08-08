import { useEffect, useState } from 'react'
import { db, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from '../../firebase'

const emptyProduct = {
  name: '',
  category: '',
  price: '',
  description: '',
  specs: '',
  image: '',
  featured: false,
}

const ProductManager = () => {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'products'))
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setProducts(items)
    } catch (err) {
      setError('Failed to load products.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        updatedAt: serverTimestamp(),
      }
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), payload)
      } else {
        await addDoc(collection(db, 'products'), { ...payload, createdAt: serverTimestamp() })
      }
      setForm(emptyProduct)
      setEditingId(null)
      await loadProducts()
    } catch (err) {
      setError('Failed to save product.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const editProduct = (product) => {
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      description: product.description || '',
      specs: product.specs || '',
      image: product.image || '',
      featured: product.featured || false,
    })
    setEditingId(product.id)
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await deleteDoc(doc(db, 'products', id))
      if (editingId === id) {
        setForm(emptyProduct)
        setEditingId(null)
      }
      await loadProducts()
    } catch (err) {
      setError('Failed to delete product.')
      console.error(err)
    }
  }

  const cancelEdit = () => {
    setForm(emptyProduct)
    setEditingId(null)
  }

  return (
    <div>
      <h1 className="section-title">Products</h1>
      <p className="section-subtitle">Add, edit, or remove products. Changes reflect immediately on the website.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="table-wrap" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className="form-group">
          <label>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Steel, Aluminum" />
        </div>
        <div className="form-group">
          <label>Price (₹)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Specifications</label>
          <input name="specs" value={form.specs} onChange={handleChange} placeholder="Size, weight, grade, etc." />
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input id="featured" name="featured" type="checkbox" checked={form.featured} onChange={handleChange} />
          <label htmlFor="featured" style={{ margin: 0 }}>Featured on homepage</label>
        </div>
        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category || '-'}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-primary" onClick={() => editProduct(product)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!products.length && (
                <tr>
                  <td colSpan={4} className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>
                    No products yet. Add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ProductManager
