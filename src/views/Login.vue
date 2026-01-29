<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="card w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">🎮 Minecraft Admin</h1>
        <p class="text-gray-400">Panel de Administración</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username -->
        <div>
          <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
            Usuario
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="input"
            placeholder="Ingresa tu usuario"
            :disabled="loading"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input"
            placeholder="Ingresa tu contraseña"
            :disabled="loading"
          />
        </div>

        <!-- Error Message -->
        <div v-if="authStore.error" class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
          {{ authStore.error }}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Iniciando...
          </span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <p>Usuario por defecto: <code class="text-gray-300">admin</code></p>
        <p>Contraseña: <code class="text-gray-300">admin123</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  
  const success = await authStore.login(username.value, password.value)
  
  if (success) {
    router.push('/')
  }
  
  loading.value = false
}
</script>