import slugify from 'slugify'

export const makeSlug = (value) => {
  if (!value) return ''
  return slugify(String(value), { lower: true, strict: true, remove: /[*+~.()\"'!:@]/g })
}

export const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

export const trimObject = (obj) => {
  if (Array.isArray(obj)) return obj.map(trimObject)
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, trimObject(v)]))
  }
  if (typeof obj === 'string') return obj.trim()
  return obj
}

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result.map((item, i) => ({ ...item, order: i }))
}
