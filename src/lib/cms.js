import { db, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, where, orderBy, limit, serverTimestamp } from '../firebase.js'

export const pathParts = (path) => (typeof path === 'string' ? path.split('/') : path)

export const getRef = (path) => {
  const parts = pathParts(path)
  if (parts.length === 1) return collection(db, parts[0])
  return doc(db, ...parts)
}

export const getCollectionRef = (name) => collection(db, name)

export async function getSingleton(path, defaults = {}) {
  const ref = getRef(path)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : { id: snap.id, ...defaults }
}

export async function saveSingleton(path, data) {
  const ref = getRef(path)
  const { id, ...rest } = data
  await setDoc(ref, { ...rest, updatedAt: serverTimestamp() }, { merge: true })
}

export async function getCollection(name, opts = {}) {
  const { filterBy, order = 'order', direction = 'asc', activeOnly = false } = opts
  const snap = await getDocs(getCollectionRef(name))
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

  if (activeOnly) items = items.filter((i) => i.active !== false)
  if (filterBy) items = items.filter((i) => i[filterBy.field] === filterBy.value)

  const dir = direction === 'desc' ? -1 : 1
  if (order) {
    items.sort((a, b) => {
      const av = a[order] ?? 0
      const bv = b[order] ?? 0
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }

  return items
}

export async function getDocById(collectionName, id) {
  const ref = doc(db, collectionName, id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getDocBySlug(collectionName, slug) {
  const ref = getCollectionRef(collectionName)
  const q = query(ref, where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function addItem(collectionName, data) {
  const ref = getCollectionRef(collectionName)
  const { id, ...rest } = data
  const docRef = await addDoc(ref, {
    ...rest,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { id: docRef.id, ...rest }
}

export async function updateItem(collectionName, id, data) {
  const ref = doc(db, collectionName, id)
  const { id: _id, ...rest } = data
  await updateDoc(ref, { ...rest, updatedAt: serverTimestamp() })
}

export async function deleteItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id))
}

export async function seedCollection(name, items, keyField = 'name') {
  const existing = await getCollection(name)
  if (existing.length) return
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const data = typeof item === 'string' ? { [keyField]: item, order: i, active: true } : item
    await addItem(name, data)
  }
}
