import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  role: 'user' | 'admin'
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>({
    id: '1',
    name: 'Admin',
    role: 'admin'
  })

  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  const login = (user: User) => {
    currentUser.value = user
  }

  const logout = () => {
    currentUser.value = {
      id: '2',
      name: 'User',
      role: 'user'
    }
  }

  return {
    currentUser,
    isAdmin,
    login,
    logout
  }
})
