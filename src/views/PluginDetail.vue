<template>
  <div class="plugin-detail">
    <div class="plugin-header">
      <router-link to="/" class="back-link">← Back</router-link>
      <div class="header-content">
        <span v-if="plugin?.icon" class="plugin-icon">{{ plugin.icon }}</span>
        <div>
          <h1>{{ plugin?.title }}</h1>
          <p>{{ plugin?.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="plugin" class="plugin-body">
      <component :is="plugin.component" />
    </div>

    <div v-else class="not-found">
      <p>Plugin not found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePluginStore } from '@/stores/plugin'

const route = useRoute()
const pluginStore = usePluginStore()

const pluginId = computed(() => route.params.id as string)
const plugin = computed(() => {
  const allPlugins = pluginStore.getAllPlugins()
  return allPlugins.find(p => p.id === pluginId.value)
})
</script>

<style scoped>
.plugin-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.plugin-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  white-space: nowrap;
  padding-top: 4px;
}

.back-link:hover {
  color: #764ba2;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.plugin-icon {
  font-size: 48px;
}

.plugin-header h1 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 32px;
}

.plugin-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.plugin-body {
  width: 100%;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}
</style>
