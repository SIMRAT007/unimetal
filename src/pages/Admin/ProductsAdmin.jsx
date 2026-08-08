import { useEffect, useState } from 'react'
import { getCollection, addItem, updateItem, deleteItem, getSingleton, saveSingleton } from '../../lib/cms'
import { makeSlug } from '../../lib/utils'
import FieldRenderer from '../../components/admin/FieldRenderer'
import Modal from '../../components/admin/Modal'
import { CATEGORY_ICON_OPTIONS } from '../../config/categoryIcons'
import { COLLECTIONS, defaultCategoriesSection } from '../../config/collections'
import { Plus, Edit2, Trash2, Loader2, X, Package, FolderOpen, Eye } from 'lucide-react'

const categoryFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'icon', label: 'Icon', type: 'select', options: CATEGORY_ICON_OPTIONS },
  { name: 'heroImage', label: 'Hero Image', type: 'image', folder: 'categories' },
  { name: 'aboutHeading', label: 'About Heading', type: 'text' },
  { name: 'aboutHeadingLine2', label: 'About Heading Line 2', type: 'text' },
  { name: 'aboutDescription', label: 'About Description', type: 'richText' },
  { name: 'aboutImage', label: 'About Image', type: 'image', folder: 'categories' },
  { name: 'order', label: 'Order', type: 'number' },
  { name: 'active', label: 'Active', type: 'boolean' },
]

const productFields = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'productCode', label: 'Product Code', type: 'text' },
  { name: 'subtitle', label: 'Subtitle', type: 'text' },
  { name: 'categoryId', label: 'Category', type: 'select', options: [] },
  { name: 'order', label: 'Order', type: 'number' },
  { name: 'active', label: 'Active', type: 'boolean' },
  { name: 'images', label: 'Images', type: 'images', folder: 'products' },
  { name: 'description', label: 'Description', type: 'richText' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'originalPrice', label: 'Original Price', type: 'number' },
  { name: 'rating', label: 'Rating (0-5)', type: 'number' },
  { name: 'sizeFitDetails', label: 'Size & Fit Details', type: 'textarea' },
  { name: 'deliveryDetails', label: 'Delivery & Returns Details', type: 'textarea' },
  { name: 'enquireLink', label: 'Enquire Link', type: 'text' },
]

const sectionFields = [
  { name: 'active', label: 'Show on Website', type: 'boolean' },
  { name: 'heading', label: 'Heading Line 1', type: 'text' },
  { name: 'highlight', label: 'Heading Line 2', type: 'text' },
  { name: 'subheading', label: 'Subheading', type: 'text' },
]

const emptyCategory = () => ({ name: '', slug: '', icon: '', heroImage: '', aboutHeading: '', aboutHeadingLine2: '', aboutDescription: '', aboutImage: '', order: 0, active: true })
const emptyProduct = () => ({
  name: '',
  slug: '',
  productCode: '',
  subtitle: '',
  categoryId: '',
  order: 0,
  active: true,
  images: [],
  description: '',
  price: '',
  originalPrice: '',
  rating: '',
  sizeFitDetails: '',
  deliveryDetails: '',
  enquireLink: '',
})

const ProductsAdmin = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [section, setSection] = useState({ ...defaultCategoriesSection })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState(null)

  const [catModalOpen, setCatModalOpen] = useState(false)
  const [catEditing, setCatEditing] = useState(null)
  const [catForm, setCatForm] = useState(emptyCategory())

  const [prodModalOpen, setProdModalOpen] = useState(false)
  const [prodEditing, setProdEditing] = useState(null)
  const [prodForm, setProdForm] = useState(emptyProduct())

  const [showProductsCategory, setShowProductsCategory] = useState(null)

  useEffect(() => {
    if (!saveMessage) return
    const timer = setTimeout(() => setSaveMessage(null), 4000)
    return () => clearTimeout(timer)
  }, [saveMessage])

  const load = async () => {
    setLoading(true)
    const [c, p, s] = await Promise.all([
      getCollection('categories'),
      getCollection('products'),
      getSingleton(COLLECTIONS.categoriesSection, defaultCategoriesSection),
    ])
    setCategories(c)
    setProducts(p)
    setSection({ ...defaultCategoriesSection, ...s })
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }))

  const handleCatChange = (name, value) => setCatForm((p) => ({ ...p, [name]: value }))
  const handleProdChange = (name, value) => setProdForm((p) => ({ ...p, [name]: value }))
  const handleSectionChange = (name, value) => setSection((p) => ({ ...p, [name]: value }))

  const saveSection = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSingleton(COLLECTIONS.categoriesSection, section)
      setSaveMessage({ type: 'success', text: 'Section heading saved' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save heading' })
    } finally {
      setSaving(false)
    }
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...catForm }
      if (!data.slug && data.name) data.slug = makeSlug(data.name)
      if (catEditing) await updateItem('categories', catEditing, data)
      else await addItem('categories', data)
      setCatModalOpen(false)
      setCatEditing(null)
      setCatForm(emptyCategory())
      await load()
      setSaveMessage({ type: 'success', text: catEditing ? 'Category updated' : 'Category added' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save category' })
    } finally {
      setSaving(false)
    }
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...prodForm }
      if (!data.slug && data.name) data.slug = makeSlug(data.name)
      if (prodEditing) await updateItem('products', prodEditing, data)
      else await addItem('products', data)
      setProdModalOpen(false)
      setProdEditing(null)
      setProdForm(emptyProduct())
      await load()
      setSaveMessage({ type: 'success', text: prodEditing ? 'Product updated' : 'Product added' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save product' })
    } finally {
      setSaving(false)
    }
  }

  const editCategory = (c) => { setCatEditing(c.id); setCatForm({ ...c }); setCatModalOpen(true) }
  const newCategory = () => { setCatEditing(null); setCatForm(emptyCategory()); setCatModalOpen(true) }
  const deleteCategory = async (id) => {
    if (!confirm('Delete this category and all its products?')) return
    const prods = products.filter((p) => p.categoryId === id)
    await Promise.all(prods.map((p) => deleteItem('products', p.id)))
    await deleteItem('categories', id)
    if (showProductsCategory?.id === id) setShowProductsCategory(null)
    await load()
  }

  const editProduct = (p) => { setProdEditing(p.id); setProdForm({ ...p }); setProdModalOpen(true) }
  const newProduct = (categoryId = '') => { setProdEditing(null); setProdForm({ ...emptyProduct(), categoryId }); setProdModalOpen(true) }
  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    await deleteItem('products', id)
    await load()
  }

  const openProductsModal = (category) => {
    setShowProductsCategory(category)
  }

  const sortedCategories = [...categories].sort((a, b) => (a.order || 0) - (b.order || 0))

  const productsForCategory = showProductsCategory
    ? products.filter((p) => p.categoryId === showProductsCategory.id).sort((a, b) => (a.order || 0) - (b.order || 0))
    : []

  if (loading) return <div className="admin-loading"><Loader2 size={20} className="spin" /> Loading…</div>

  return (
    <div className="admin-panel products-admin">
      <div className="admin-page-header">
        <h1><Package size={24} /> Categories &amp; Products</h1>
        <p className="text-muted">Manage categories and the products under each category.</p>
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
          <h2 className="admin-section-title">Categories List</h2>
          <div className="admin-section-actions">
            <button type="button" className="btn btn-primary" onClick={newCategory}>
              <Plus size={16} /> Add Category
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => newProduct()}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Category Name</th>
                <th>Total Products</th>
                <th>Show Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCategories.map((c, index) => {
                const count = products.filter((p) => p.categoryId === c.id).length
                return (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{count}</td>
                    <td>
                      <button type="button" className="btn btn-sm btn-secondary" onClick={() => openProductsModal(c)}>
                        <Eye size={14} /> Show Products
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button type="button" className="btn-icon" onClick={() => editCategory(c)} title="Edit"><Edit2 size={16} /></button>
                        <button type="button" className="btn-icon" onClick={() => deleteCategory(c.id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {sortedCategories.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-cell">No categories yet. Click Add Category to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!showProductsCategory}
        onClose={() => setShowProductsCategory(null)}
        title={showProductsCategory ? `Products in ${showProductsCategory.name}` : 'Products'}
      >
        <div className="admin-section-actions" style={{ marginBottom: '1rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => newProduct(showProductsCategory?.id || '')}>
            <Plus size={16} /> Add Product to {showProductsCategory?.name || 'Category'}
          </button>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsForCategory.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="btn-icon" onClick={() => { setShowProductsCategory(null); editProduct(p) }} title="Edit"><Edit2 size={16} /></button>
                      <button type="button" className="btn-icon" onClick={() => deleteProduct(p.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {productsForCategory.length === 0 && (
                <tr>
                  <td colSpan="3" className="empty-cell">No products in this category yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal open={catModalOpen} onClose={() => setCatModalOpen(false)} title={catEditing ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={saveCategory} className="collection-form">
          {categoryFields.map((f) => (
            <FieldRenderer key={f.name} field={f} value={catForm[f.name]} onChange={(v) => handleCatChange(f.name, v)} />
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {catEditing ? 'Update' : 'Add'} Category
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setCatModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>

      <Modal open={prodModalOpen} onClose={() => setProdModalOpen(false)} title={prodEditing ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={saveProduct} className="collection-form">
          {productFields.map((f) => {
            const field = f.name === 'categoryId' ? { ...f, options: [{ value: '', label: '— Select Category —' }, ...categoryOptions] } : f
            return <FieldRenderer key={field.name} field={field} value={prodForm[field.name]} onChange={(v) => handleProdChange(field.name, v)} />
          })}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
              {prodEditing ? 'Update' : 'Add'} Product
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setProdModalOpen(false)}><X size={16} /> Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProductsAdmin
