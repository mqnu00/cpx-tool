import type { PluginModule } from '../types'
import UserAdmin from './UserAdmin.vue'

const userAdminPlugin: PluginModule = {
  id: 'user-admin',
  name: 'User Admin',
  title: 'User Management',
  description: 'Manage user permissions and access levels',
  icon: '👤',
  component: UserAdmin,
  version: '1.0.0'
}

export default userAdminPlugin
