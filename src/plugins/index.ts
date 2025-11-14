import { usePluginStore } from '@/stores/plugin'
import userAdminPlugin from './user-admin'
import focalCropPlugin from './focal-crop'

export function initializePlugins() {
  const pluginStore = usePluginStore()

  // Register all plugins
  pluginStore.registerPlugin({
    ...userAdminPlugin,
    enabled: true
  })

  pluginStore.registerPlugin({
    ...focalCropPlugin,
    enabled: true
  })
}
