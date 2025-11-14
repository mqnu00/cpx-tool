import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface PluginConfig {
  id: string
  name: string
  title: string
  description: string
  icon?: string
  component: any
  enabled: boolean
}

export const usePluginStore = defineStore('plugin', () => {
  const plugins = ref<Map<string, PluginConfig>>(new Map())
  const loadedPlugins = ref<Set<string>>(new Set())

  const registerPlugin = (config: PluginConfig) => {
    plugins.value.set(config.id, config)
  }

  const enablePlugin = (pluginId: string) => {
    const plugin = plugins.value.get(pluginId)
    if (plugin) {
      plugin.enabled = true
      loadedPlugins.value.add(pluginId)
    }
  }

  const disablePlugin = (pluginId: string) => {
    const plugin = plugins.value.get(pluginId)
    if (plugin) {
      plugin.enabled = false
      loadedPlugins.value.delete(pluginId)
    }
  }

  const getEnabledPlugins = () => {
    return Array.from(plugins.value.values()).filter(p => p.enabled)
  }

  const getAllPlugins = () => {
    return Array.from(plugins.value.values())
  }

  return {
    plugins,
    loadedPlugins,
    registerPlugin,
    enablePlugin,
    disablePlugin,
    getEnabledPlugins,
    getAllPlugins
  }
})
