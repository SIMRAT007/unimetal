import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LoadingContext = createContext({
  isLoading: false,
  firstLoadDone: false,
  start: () => {},
  stop: () => {},
})

export const LoadingProvider = ({ children }) => {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [firstLoadDone, setFirstLoadDone] = useState(false)

  const start = useCallback(() => {
    setStarted(true)
    setCount((c) => c + 1)
  }, [])
  const stop = useCallback(() => setCount((c) => Math.max(0, c - 1)), [])

  useEffect(() => {
    if (count === 0 && started && !firstLoadDone) setFirstLoadDone(true)
  }, [count, started, firstLoadDone])

  return (
    <LoadingContext.Provider value={{ isLoading: count > 0, firstLoadDone, start, stop }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
