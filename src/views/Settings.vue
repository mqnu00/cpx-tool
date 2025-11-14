<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2>{{ t('settings.title') }}</h2>
    </div>
    
    <div class="settings-content">
      <n-card class="settings-section">
        <template #header>
          <div class="section-title">
            <n-icon size="20">
              <LanguageIcon />
            </n-icon>
            {{ t('settings.language') }}
          </div>
        </template>
        
        <n-radio-group v-model:value="selectedLanguage" @update:value="handleLanguageChange">
          <n-space>
            <n-radio key="zh" value="zh">
              {{ t('settings.languageZh') }}
            </n-radio>
            <n-radio key="en" value="en">
              {{ t('settings.languageEn') }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-card>
      
      <n-card class="settings-section">
        <template #header>
          <div class="section-title">
            <n-icon size="20">
              <ThemeIcon />
            </n-icon>
            {{ t('settings.theme') }}
          </div>
        </template>
        
        <n-radio-group v-model:value="selectedTheme" @update:value="handleThemeChange">
          <n-space vertical>
            <n-radio key="light" value="light">
              {{ t('settings.themeLight') }}
            </n-radio>
            <n-radio key="dark" value="dark">
              {{ t('settings.themeDark') }}
            </n-radio>
            <n-radio key="system" value="system">
              {{ t('settings.themeSystem') }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-card>
    </div>
    
    <div class="settings-footer">
      <n-space>
        <n-button @click="$router.back()">
          {{ t('common.back') }}
        </n-button>
        <n-button type="primary" @click="saveSettings">
          {{ t('common.save') }}
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件名称
defineOptions({
  name: 'SettingsPage'
})

import { ref, onMounted } from 'vue'
import { 
  NCard, 
  NRadioGroup, 
  NRadio, 
  NSpace, 
  NButton, 
  NIcon,
  useMessage 
} from 'naive-ui'
import { useTranslation } from '@/composables/useTranslation'
import { useSettingsStore, type ThemeMode, type Language } from '@/stores/settings'

// 图标组件
const LanguageIcon = () => '🌐'
const ThemeIcon = () => '🎨'

const { t, currentLanguage } = useTranslation()
const settingsStore = useSettingsStore()
const message = useMessage()

const selectedLanguage = ref<Language>(currentLanguage.value)
const selectedTheme = ref<ThemeMode>(settingsStore.themeMode)

const handleLanguageChange = (value: Language) => {
  selectedLanguage.value = value
}

const handleThemeChange = (value: ThemeMode) => {
  selectedTheme.value = value
}

const saveSettings = () => {
  settingsStore.setLanguage(selectedLanguage.value)
  settingsStore.setThemeMode(selectedTheme.value)
  message.success(t('settings.saveSuccess'))
}

onMounted(() => {
  selectedLanguage.value = currentLanguage.value
  selectedTheme.value = settingsStore.themeMode
})
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.settings-header {
  margin-bottom: 30px;
}

.settings-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-color);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}

.settings-section {
  border-radius: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

/* 暗色主题样式 */
[data-theme="dark"] .settings-container {
  color: #fff;
}

[data-theme="dark"] .settings-header h2 {
  color: #fff;
}

[data-theme="dark"] .settings-footer {
  border-top-color: #333;
}
</style>