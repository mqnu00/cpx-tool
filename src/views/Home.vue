<template>
  <div class="home">
    <section class="intro">
      <h2>{{ t('home.title') }}</h2>
      <p>{{ t('home.description') }}</p>
    </section>

    <section class="tools-grid" v-if="enabledPlugins.length > 0">
      <div class="tool-card" v-for="plugin in enabledPlugins" :key="plugin.id">
        <div class="tool-card-header">
          <span class="tool-icon" v-if="plugin.icon">{{ plugin.icon }}</span>
          <h3>{{ plugin.title }}</h3>
        </div>
        <p>{{ plugin.description }}</p>
        <router-link :to="`/plugin/${plugin.id}`" class="tool-link">
          Open Tool →
        </router-link>
      </div>
    </section>

    <section class="empty-state" v-else>
      <p>{{ t('home.noPlugins') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
// 组件名称
defineOptions({
  name: 'HomePage'
})

import { computed } from 'vue'
import { usePluginStore } from '@/stores/plugin'
import { useTranslation } from '@/composables/useTranslation'

const pluginStore = usePluginStore()
const { t } = useTranslation()

const enabledPlugins = computed(() => pluginStore.getEnabledPlugins())
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.intro {
  text-align: center;
  padding: 40px 0;
}

.intro h2 {
  font-size: 32px;
  margin: 0 0 16px 0;
  color: var(--text-color);
}

.intro p {
  font-size: 18px;
  color: var(--text-color);
  opacity: 0.8;
  margin: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.tool-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.tool-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.tool-icon {
  font-size: 24px;
}

.tool-card-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 20px;
}

.tool-card p {
  margin: 12px 0;
  color: var(--text-color);
  opacity: 0.7;
  font-size: 14px;
}

.tool-link {
  display: inline-block;
  margin-top: 16px;
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.tool-link:hover {
  color: #764ba2;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-color);
  opacity: 0.6;
  font-size: 18px;
}
</style>
