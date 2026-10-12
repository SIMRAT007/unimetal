import { useEffect, useState } from 'react'
import { getCollection } from './cms'
import { makeSlug } from './utils'

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Slugs used by more than one product (they would otherwise all open the same page)
export const findDuplicateSlugs = (products = []) => {
  const counts = {}
  products.forEach((p) => {
    const slug = p.slug?.trim()
    if (slug) counts[slug] = (counts[slug] || 0) + 1
  })
  return new Set(Object.keys(counts).filter((slug) => counts[slug] > 1))
}

// Products with a missing, malformed or shared slug are linked by their document id instead
export const productPath = (product, duplicateSlugs = new Set()) => {
  const slug = product.slug?.trim()
  const usable = slug && VALID_SLUG.test(slug) && !duplicateSlugs.has(slug)
  return `/product/${usable ? slug : product.id}`
}

// Returns a slug based on `value` that no other product (except `currentId`) uses
export const uniqueSlug = (value, products = [], currentId = null) => {
  const base = makeSlug(value) || 'product'
  const taken = new Set(products.filter((p) => p.id !== currentId).map((p) => p.slug))
  let slug = base
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`
  return slug
}

let duplicatesPromise = null

// Duplicate slugs across the whole catalogue, loaded once per page load
export const useDuplicateSlugs = () => {
  const [duplicates, setDuplicates] = useState(new Set())

  useEffect(() => {
    let mounted = true
    if (!duplicatesPromise) {
      duplicatesPromise = getCollection('products')
        .then(findDuplicateSlugs)
        .catch(() => {
          duplicatesPromise = null
          return new Set()
        })
    }
    duplicatesPromise.then((set) => { if (mounted) setDuplicates(set) })
    return () => { mounted = false }
  }, [])

  return duplicates
}
