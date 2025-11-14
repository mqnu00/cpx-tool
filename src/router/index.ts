import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    name: 'Home'
  },
  {
    path: '/plugin/:id',
    component: () => import('@/views/PluginDetail.vue'),
    name: 'PluginDetail'
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin.vue'),
    name: 'Admin',
    meta: { requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
