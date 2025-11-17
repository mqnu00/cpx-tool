import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializePlugins } from './plugins'
import i18n from './locales'
import { useSettingsStore } from './stores/settings'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize plugins after pinia is set up
initializePlugins()

// Initialize settings
const settingsStore = useSettingsStore()
settingsStore.initSettings()

app.mount('#app')
