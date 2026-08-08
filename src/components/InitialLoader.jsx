import { useLoading } from '../context/LoadingContext'

const InitialLoader = () => {
  const { firstLoadDone } = useLoading()
  if (firstLoadDone) return null

  return (
    <div className="initial-loader">
      <div className="initial-loader-spinner" />
      <p className="initial-loader-text">UNI Metal</p>
    </div>
  )
}

export default InitialLoader
