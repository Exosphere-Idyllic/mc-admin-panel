<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">Control del Servidor</h2>
        <p class="text-sm text-gray-400">Gestiona el estado del servidor Minecraft</p>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="statusBadgeClass"
        >
          {{ serverStatusText }}
        </span>
      </div>
    </div>

    <!-- Server Stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm mb-1">Jugadores</p>
        <p class="text-2xl font-bold text-white">{{ minecraftStore.playerCount }}</p>
      </div>
      <div class="bg-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm mb-1">Uptime</p>
        <p class="text-lg font-bold text-white">{{ minecraftStore.uptime.formatted }}</p>
      </div>
      <div class="bg-gray-700 rounded-lg p-4">
        <p class="text-gray-400 text-sm mb-1">Estado</p>
        <p class="text-lg font-bold" :class="statusTextClass">
          {{ minecraftStore.isServerOnline ? 'Activo' : 'Inactivo' }}
        </p>
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="flex gap-3">
      <button
        @click="handleStart"
        :disabled="minecraftStore.isServerOnline || minecraftStore.loading || !canOperate"
        class="btn btn-success flex-1"
      >
        <span v-if="!minecraftStore.loading">▶ Iniciar</span>
        <span v-else>⏳ Iniciando...</span>
      </button>

      <button
        @click="handleRestart"
        :disabled="!minecraftStore.isServerOnline || minecraftStore.loading || !canOperate"
        class="btn btn-secondary flex-1"
      >
        <span v-if="!minecraftStore.loading">🔄 Reiniciar</span>
        <span v-else>⏳ Reiniciando...</span>
      </button>

      <button
        @click="handleStop"
        :disabled="!minecraftStore.isServerOnline || minecraftStore.loading || !canStop"
        class="btn btn-danger flex-1"
      >
        <span v-if="!minecraftStore.loading">⏹ Detener</span>
        <span v-else>⏳ Deteniendo...</span>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="minecraftStore.error" class="mt-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
      {{ minecraftStore.error }}
    </div>

    <!-- Permission Warning -->
    <div v-if="!canOperate" class="mt-4 bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded text-sm">
      ⚠️ Solo administradores y operadores pueden controlar el servidor
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'

const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

const canOperate = computed(() => authStore.isOperator)
const canStop = computed(() => authStore.isAdmin)

const serverStatusText = computed(() => {
  return minecraftStore.isServerOnline ? 'Online' : 'Offline'
})

const statusBadgeClass = computed(() => {
  return minecraftStore.isServerOnline 
    ? 'bg-minecraft-green text-white'
    : 'bg-minecraft-red text-white'
})

const statusTextClass = computed(() => {
  return minecraftStore.isServerOnline 
    ? 'text-minecraft-green'
    : 'text-minecraft-red'
})

async function handleStart() {
  const success = await minecraftStore.startServer()
  if (success) {
    setTimeout(() => {
      minecraftStore.fetchPlayers()
      minecraftStore.fetchUptime()
    }, 3000)
  }
}

async function handleRestart() {
  if (confirm('¿Estás seguro de reiniciar el servidor? Los jugadores serán desconectados.')) {
    const success = await minecraftStore.restartServer()
    if (success) {
      setTimeout(() => {
        minecraftStore.fetchPlayers()
        minecraftStore.fetchUptime()
      }, 5000)
    }
  }
}

async function handleStop() {
  if (confirm('¿Estás seguro de detener el servidor? Los jugadores serán desconectados.')) {
    await minecraftStore.stopServer()
  }
}
</script>