<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">Estado del Hardware</h2>
        <p class="text-sm text-gray-400">Raspberry Pi 4 - Monitoreo en tiempo real</p>
      </div>
      <button
        @click="minecraftStore.fetchHardware()"
        class="btn btn-secondary text-sm"
      >
        🔄 Actualizar
      </button>
    </div>

    <div v-if="minecraftStore.hardware.resources" class="space-y-4">
      <!-- CPU -->
      <div class="bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-300 font-medium">🖥️ CPU</span>
          <span 
            class="text-sm font-semibold px-2 py-1 rounded"
            :class="cpuStatusClass"
          >
            {{ minecraftStore.hardware.resources.cpu.percent }}%
          </span>
        </div>
        <div class="w-full bg-gray-600 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-300"
            :class="cpuBarClass"
            :style="{ width: minecraftStore.hardware.resources.cpu.percent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          {{ minecraftStore.hardware.resources.cpu.count }} núcleos
        </p>
      </div>

      <!-- RAM -->
      <div class="bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-300 font-medium">💾 RAM</span>
          <span 
            class="text-sm font-semibold px-2 py-1 rounded"
            :class="memoryStatusClass"
          >
            {{ minecraftStore.hardware.resources.memory.percent }}%
          </span>
        </div>
        <div class="w-full bg-gray-600 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-300"
            :class="memoryBarClass"
            :style="{ width: minecraftStore.hardware.resources.memory.percent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          {{ minecraftStore.hardware.resources.memory.used_mb }} MB / 
          {{ minecraftStore.hardware.resources.memory.total_mb }} MB
        </p>
      </div>

      <!-- Temperature -->
      <div v-if="minecraftStore.hardware.temperature?.available" class="bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-300 font-medium">🌡️ Temperatura</span>
          <span 
            class="text-sm font-semibold px-2 py-1 rounded"
            :class="tempStatusClass"
          >
            {{ minecraftStore.hardware.temperature.celsius }}°C
          </span>
        </div>
        <div class="w-full bg-gray-600 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-300"
            :class="tempBarClass"
            :style="{ width: tempPercent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          {{ minecraftStore.hardware.temperature.message }}
        </p>
      </div>

      <!-- Disk -->
      <div class="bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-300 font-medium">💿 Disco</span>
          <span 
            class="text-sm font-semibold px-2 py-1 rounded"
            :class="diskStatusClass"
          >
            {{ minecraftStore.hardware.resources.disk.percent }}%
          </span>
        </div>
        <div class="w-full bg-gray-600 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-300"
            :class="diskBarClass"
            :style="{ width: minecraftStore.hardware.resources.disk.percent + '%' }"
          ></div>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          {{ minecraftStore.hardware.resources.disk.free_gb }} GB libres / 
          {{ minecraftStore.hardware.resources.disk.total_gb }} GB
        </p>
      </div>

      <!-- System Uptime -->
      <div class="bg-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <span class="text-gray-300 font-medium">⏱️ Uptime del Sistema</span>
          <span class="text-sm font-semibold text-blue-400">
            {{ minecraftStore.hardware.resources.uptime.formatted }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center py-8">
      <div class="animate-spin text-4xl mb-2">⚙️</div>
      <p class="text-gray-400">Cargando información del hardware...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMinecraftStore } from '@/stores/minecraft'

const minecraftStore = useMinecraftStore()

// CPU
const cpuStatusClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.cpu.percent || 0
  if (percent > 80) return 'bg-red-500 text-white'
  if (percent > 60) return 'bg-yellow-500 text-black'
  return 'bg-minecraft-green text-white'
})

const cpuBarClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.cpu.percent || 0
  if (percent > 80) return 'bg-red-500'
  if (percent > 60) return 'bg-yellow-500'
  return 'bg-minecraft-green'
})

// Memory
const memoryStatusClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.memory.percent || 0
  if (percent > 85) return 'bg-red-500 text-white'
  if (percent > 70) return 'bg-yellow-500 text-black'
  return 'bg-minecraft-green text-white'
})

const memoryBarClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.memory.percent || 0
  if (percent > 85) return 'bg-red-500'
  if (percent > 70) return 'bg-yellow-500'
  return 'bg-minecraft-green'
})

// Temperature
const tempPercent = computed(() => {
  const temp = minecraftStore.hardware.temperature?.celsius || 0
  return Math.min((temp / 80) * 100, 100)
})

const tempStatusClass = computed(() => {
  const temp = minecraftStore.hardware.temperature?.celsius || 0
  if (temp > 80) return 'bg-red-500 text-white'
  if (temp > 70) return 'bg-yellow-500 text-black'
  return 'bg-minecraft-green text-white'
})

const tempBarClass = computed(() => {
  const temp = minecraftStore.hardware.temperature?.celsius || 0
  if (temp > 80) return 'bg-red-500'
  if (temp > 70) return 'bg-yellow-500'
  return 'bg-minecraft-green'
})

// Disk
const diskStatusClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.disk.percent || 0
  if (percent > 85) return 'bg-red-500 text-white'
  if (percent > 70) return 'bg-yellow-500 text-black'
  return 'bg-minecraft-green text-white'
})

const diskBarClass = computed(() => {
  const percent = minecraftStore.hardware.resources?.disk.percent || 0
  if (percent > 85) return 'bg-red-500'
  if (percent > 70) return 'bg-yellow-500'
  return 'bg-minecraft-green'
})
</script>