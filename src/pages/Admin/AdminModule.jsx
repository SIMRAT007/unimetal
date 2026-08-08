import { useParams } from 'react-router-dom'
import { ADMIN_MODULES } from '../../config/adminModules'
import { MODULE_ICONS } from '../../config/adminIcons'
import SingletonEditor from '../../components/admin/SingletonEditor'
import CollectionManager from '../../components/admin/CollectionManager'

const AdminModule = () => {
  const { module } = useParams()
  const config = ADMIN_MODULES[module]

  if (!config) {
    return (
      <div className="admin-panel">
        <div className="admin-page-header"><h1>Module not found</h1></div>
      </div>
    )
  }

  const Icon = MODULE_ICONS[module]

  return (
    <div className="admin-panel">
      <div className="admin-page-header">
        <h1>{Icon ? <Icon size={24} /> : null} {config.label}</h1>
        <p className="text-muted">{config.type === 'singleton' ? 'Edit the single content block below.' : 'Add, edit, reorder and remove items below.'}</p>
      </div>
      {config.type === 'singleton' ? (
        <SingletonEditor path={config.path} fields={config.fields} defaults={config.defaults} />
      ) : (
        <CollectionManager collectionName={config.path} fields={config.fields} defaults={config.defaults} />
      )}
    </div>
  )
}

export default AdminModule
