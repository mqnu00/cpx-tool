import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
export type Language = 'zh' | 'en'

export const useSettingsStore = defineStore('settings', () => {
  // 语言设置
  const language = ref<Language>('zh')
  
  // 主题设置
  const themeMode = ref<ThemeMode>('system')
  
  // 计算实际的主题
  const actualTheme = computed(() => {
    if (themeMode.value === 'system') {
      // 检测系统主题
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeMode.value
  })
  
  // 设置语言
  const setLanguage = (lang: Language) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }
  
  // 设置主题
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode
    localStorage.setItem('themeMode', mode)
    applyTheme()
  }
  
  // 应用主题
  const applyTheme = () => {
    const theme = actualTheme.value
    document.documentElement.setAttribute('data-theme', theme)
    
    // 如果是Naive UI，还需要设置主题变量
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // 初始化设置
  const initSettings = () => {
    // 从localStorage恢复设置
    const savedLanguage = localStorage.getItem('language') as Language
    const savedThemeMode = localStorage.getItem('themeMode') as ThemeMode
    
    if (savedLanguage) {
      language.value = savedLanguage
    }
    
    if (savedThemeMode) {
      themeMode.value = savedThemeMode
    }
    
    // 应用主题
    applyTheme()
    
    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', applyTheme)
  }
  
  return {
    language,
    themeMode,
    actualTheme,
    setLanguage,
    setThemeMode,
    initSettings
  }
})