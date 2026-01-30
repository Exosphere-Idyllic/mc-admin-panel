import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/hardware',
    name: 'Hardware',
    // Carga perezosa: el componente se busca cuando el usuario hace clic
    component: () => import('@/views/HardwareView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/console',
    name: 'Console',
    component: () => import('@/views/ConsoleView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logs',
    name: 'Logs',
    component: () => import('@/views/LogsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Verificamos si la ruta requiere autenticación
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } 
  // Si ya está logueado y trata de ir al login, al dashboard
  else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } 
  else {
    next()
  }
})

export default router