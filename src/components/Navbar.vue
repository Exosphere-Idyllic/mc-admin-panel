<template>
  <nav class="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <span class="text-2xl">🎮</span>
          <div>
            <h1 class="text-lg font-bold text-white">Minecraft Admin</h1>
            <p class="text-xs text-gray-400">Panel de Control</p>
          </div>
        </div>

        <!-- Server Status Badge -->
        <div class="flex items-center space-x-4">
          <div 
            v-if="minecraftStore.isServerOnline"
            class="flex items-center space-x-2 bg-minecraft-green/20 px-3 py-1 rounded-full"
          >
            <span class="w-2 h-2 bg-minecraft-green rounded-full animate-pulse"></span>
            <span class="text-sm text-minecraft-green font-medium">Online</span>
            <span class="text-xs text-gray-400">{{ minecraftStore.playerCount }}</span>
          </div>
          <div 
            v-else
            class="flex items-center space-x-2 bg-minecraft-red/20 px-3 py-1 rounded-full"
          >
            <span class="w-2 h-2 bg-minecraft-red rounded-full"></span>
            <span class="text-sm text-minecraft-red font-medium">Offline</span>
          </div>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm font-medium text-white">{{ authStore.user?.username }}</p>
            <p class="text-xs text-gray-400">{{ userRole }}</p>
          </div>
          <button
            @click="handleLogout"
            class="btn btn-secondary text-sm"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'

const router = useRouter()
const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

const userRole = computed(() => {
  if (authStore.isAdmin) return 'Administrador'
  if (authStore.isOperator) return 'Operador'
  return 'Visor'
})

function handleLogout() {
  authStore.logout()
  minecraftStore.stopAutoRefresh()
  router.push('/login')
}
</script>