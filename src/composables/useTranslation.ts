import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'

export function useTranslation() {
  const { t, locale } = useI18n()
  const settingsStore = useSettingsStore()
  
  // 切换语言
  const changeLanguage = (lang: 'zh' | 'en') => {
    locale.value = lang
    settingsStore.setLanguage(lang)
  }
  
  // 获取当前语言
  const currentLanguage = computed(() => settingsStore.language)
  
  return {
    t,
    currentLanguage,
    changeLanguage
  }
}