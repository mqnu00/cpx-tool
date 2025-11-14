<template>
  <n-config-provider>
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1>Tool Suite</h1>
          <nav class="header-nav">
            <router-link to="/">Home</router-link>
            <router-link to="/admin" v-if="isAdmin">Admin</router-link>
            <button @click="toggleUserMenu" class="user-btn">
              {{ currentUser.name }}
            </button>
          </nav>
        </div>
      </header>
      
      <main class="app-main">
        <router-view />
      </main>

      <footer class="app-footer">
        <p>&copy; 2024 Tool Suite. All rights reserved.</p>
      </footer>
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { NConfigProvider } from 'naive-ui'
import '@/style.css'

const userStore = useUserStore()

const currentUser = computed(() => userStore.currentUser || { id: '', name: 'Guest', role: 'user' as const })
const isAdmin = computed(() => userStore.isAdmin)

const toggleUserMenu = () => {
  // 简单的示例：在管理员和普通用户之间切换
  if (isAdmin.value) {
    userStore.logout()
  } else {
    userStore.login({
      id: '1',
      name: 'Admin',
      role: 'admin'
    })
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.header-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-nav a {
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.header-nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.header-nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.3);
}

.user-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 20px;
}

.app-footer {
  background-color: #333;
  color: white;
  padding: 20px;
  text-align: center;
  margin-top: auto;
}

.app-footer p {
  margin: 0;
}
</style>
