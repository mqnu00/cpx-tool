export interface PluginModule {
  id: string
  name: string
  title: string
  description: string
  icon?: string
  component: any
  version?: string
}
