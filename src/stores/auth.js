import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRoles = computed(() => {
    if (!user.value) return []
    return user.value.roles.split(',').map(r => r.trim())
  })
  const isAdmin = computed(() => userRoles.value.includes('admin'))
  const isOperator = computed(() => userRoles.value.includes('operator') || isAdmin.value)

  // Actions
  async function login(username, password) {
    loading.value = true
    error.value = null

    try {
      const response = await authAPI.login(username, password)
      token.value = response.data.access_token
      
      // Guardar token en localStorage
      localStorage.setItem('token', token.value)
      
      // Decodificar token para obtener datos del usuario
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      user.value = {
        username: payload.sub,
        roles: payload.roles
      }
      
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al iniciar sesión'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  // Restaurar usuario desde token almacenado
  function restoreUser() {
    if (token.value) {
      try {
        const payload = JSON.parse(atob(token.value.split('.')[1]))
        user.value = {
          username: payload.sub,
          roles: payload.roles
        }
      } catch (err) {
        // Token inválido
        logout()
      }
    }
  }

  return {
    // State
    token,
    user,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userRoles,
    isAdmin,
    isOperator,
    
    // Actions
    login,
    logout,
    restoreUser
  }
})