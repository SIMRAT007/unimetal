import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext'
import { getSingleton, getCollection } from '../lib/cms'

export const useSingleton = (path) => {
  const { start, stop } = useLoading()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    start()
    getSingleton(path, {})
      .then((res) => { if (mounted) setData(res) })
      .catch((err) => { if (mounted) setError(err) })
      .finally(() => { stop(); if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [path, start, stop])

  return { data, loading, error }
}

export const useCollection = (name, opts = {}) => {
  const { start, stop } = useLoading()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    start()
    getCollection(name, opts)
      .then((res) => { if (mounted) setData(res) })
      .catch((err) => { if (mounted) setError(err) })
      .finally(() => { stop(); if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [name, JSON.stringify(opts), start, stop])

  return { data, loading, error }
}
