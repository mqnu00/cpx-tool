import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initializePlugins } from './plugins'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize plugins after pinia is set up
initializePlugins()

app.mount('#app')
