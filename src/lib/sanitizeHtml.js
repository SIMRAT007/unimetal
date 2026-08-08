const REMOVED_STYLES = new Set([
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-width',
  'border-style',
  'border-color',
  'border-radius',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'background',
  'background-color',
  'box-shadow',
])

export const sanitizeDescription = (html = '') => {
  if (typeof window === 'undefined' || !html) return html
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.body.querySelectorAll('*').forEach((el) => {
    const style = el.getAttribute('style')
    if (!style) return

    const cleaned = style
      .split(';')
      .map((rule) => rule.trim())
      .filter(Boolean)
      .filter((rule) => {
        const prop = rule.split(':')[0].trim().toLowerCase()
        return !REMOVED_STYLES.has(prop)
      })
      .join('; ')

    return cleaned ? el.setAttribute('style', cleaned) : el.removeAttribute('style')
  })

  return doc.body.innerHTML
}

export const stripTags = (html = '') => {
  if (typeof window === 'undefined' || !html) return html
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}
