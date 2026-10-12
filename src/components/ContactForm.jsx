import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { addItem } from '../lib/cms'
import { useCollection } from '../hooks/useCms'
import { COLLECTIONS } from '../config/collections'

const ContactForm = ({ source = 'contact-page', defaultValues = {}, onSubmitted, product }) => {
  const { data: products } = useCollection(COLLECTIONS.products, { activeOnly: true })
  const [formData, setFormData] = useState({
    name: defaultValues.name || '',
    email: defaultValues.email || '',
    phone: defaultValues.phone || '',
    inquiryType: defaultValues.inquiryType || 'General Inquiry',
    productId: defaultValues.productId || product?.id || '',
    subject: defaultValues.subject || (product?.name ? `Enquiry about ${product.name}` : ''),
    message: defaultValues.message || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        productId: product.id,
        subject: `Enquiry about ${product.name}`,
      }))
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addItem('inquiries', {
        ...formData,
        source,
        createdAt: new Date().toISOString(),
      })
      setSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'General Inquiry',
        productId: '',
        subject: '',
        message: '',
      })
      if (onSubmitted) onSubmitted()
    } catch (err) {
      console.error(err)
      alert('Failed to send inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="contact-success">
        <h4>Thank you!</h4>
        <p>Your inquiry has been sent. We will get back to you soon.</p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Full Name *</span>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </label>
        <label className="contact-field">
          <span>Email Address *</span>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
        </label>
      </div>
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Phone Number *</span>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+44 20 7123 4567" required />
        </label>
        <label className="contact-field">
          <span>Inquiry Type</span>
          <select name="inquiryType" value={formData.inquiryType} onChange={handleChange}>
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Dealer Partnership</option>
            <option>Distributor Inquiry</option>
          </select>
        </label>
      </div>
      <div className="contact-form-row">
        <label className="contact-field">
          <span>Product</span>
          <select name="productId" value={formData.productId} onChange={handleChange}>
            <option value="" disabled>Select a product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <label className="contact-field">
          <span>Subject</span>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject of your inquiry" />
        </label>
      </div>
      <label className="contact-field">
        <span>Message *</span>
        <textarea name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="How can we help?" required />
      </label>
      <button type="submit" className="btn btn-primary contact-submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'} <Send size={16} />
      </button>
    </form>
  )
}

export default ContactForm
