<template>
  <div class="admin">
    <div class="admin-header">
      <h2>Admin Panel - Plugin Management</h2>
      <p v-if="!isAdmin" class="error-message">Only admins can access this page</p>
    </div>

    <div class="plugins-section" v-if="isAdmin">
      <h3>Available Plugins</h3>
      <div class="plugins-list">
        <div class="plugin-item" v-for="plugin in allPlugins" :key="plugin.id">
          <div class="plugin-info">
            <span class="plugin-icon" v-if="plugin.icon">{{ plugin.icon }}</span>
            <div class="plugin-details">
              <h4>{{ plugin.title }}</h4>
              <p>{{ plugin.description }}</p>
              <small>ID: {{ plugin.id }}</small>
            </div>
          </div>
          <div class="plugin-actions">
            <n-switch
              :value="plugin.enabled"
              @update:value="(val) => togglePlugin(plugin.id, val)"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { usePluginStore } from '@/stores/plugin'
import { NSwitch } from 'naive-ui'

const userStore = useUserStore()
const pluginStore = usePluginStore()

const isAdmin = computed(() => userStore.isAdmin)
const allPlugins = computed(() => pluginStore.getAllPlugins())

const togglePlugin = (pluginId: string, enabled: boolean) => {
  if (!isAdmin.value) return

  if (enabled) {
    pluginStore.enablePlugin(pluginId)
  } else {
    pluginStore.disablePlugin(pluginId)
  }
}
</script>

<style scoped>
.admin {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.admin-header h2 {
  margin: 0 0 16px 0;
  color: #333;
}

.admin-header p {
  margin: 0;
  color: #666;
}

.error-message {
  color: #ff6b6b;
  font-weight: 500;
}

.plugins-section h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.plugins-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plugin-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.plugin-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.plugin-info {
  display: flex;
  gap: 16px;
  flex: 1;
}

.plugin-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
}

.plugin-details h4 {
  margin: 0 0 8px 0;
  color: #333;
}

.plugin-details p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.plugin-details small {
  color: #999;
  font-size: 12px;
}

.plugin-actions {
  display: flex;
  align-items: center;
}
</style>
