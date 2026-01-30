<template>
  <div class="card bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">Control del Servidor</h2>
        <p class="text-sm text-slate-400">Gestiona el estado del servidor Minecraft</p>
      </div>
      <div class="flex items-center space-x-2">
        <span 
          class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors duration-500"
          :class="minecraftStore.isServerOnline ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'"
        >
          {{ minecraftStore.isServerOnline ? 'Online' : 'Offline' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
        <p class="text-slate-500 text-[10px] font-bold uppercase mb-1">Jugadores</p>
        <p class="text-2xl font-black text-white">{{ minecraftStore.playerCount || '0' }}/20</p>
      </div>
      
      <div class="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
        <p class="text-slate-500 text-[10px] font-bold uppercase mb-1">Uptime</p>
        <p class="text-xl font-mono font-bold text-green-500">{{ liveUptime }}</p>
      </div>

      <div class="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4 text-center">
        <p class="text-slate-500 text-[10px] font-bold uppercase mb-1">Estado</p>
        <p class="text-lg font-black" :class="minecraftStore.isServerOnline ? 'text-green-500' : 'text-red-500'">
          {{ minecraftStore.isServerOnline ? 'ACTIVO' : 'INACTIVO' }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        @click="handleStart"
        :disabled="minecraftStore.isServerOnline || minecraftStore.loading"
        class="flex-1 min-w-[120px] bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:grayscale py-3 rounded-xl font-bold text-white transition-all active:scale-95"
      >
        <span v-if="!minecraftStore.loading">▶ Iniciar</span>
        <span v-else class="flex items-center justify-center gap-2">
           <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
           Iniciando...
        </span>
      </button>

      <button
        @click="handleRestart"
        :disabled="!minecraftStore.isServerOnline || minecraftStore.loading"
        class="flex-1 min-w-[120px] bg-slate-700 hover:bg-slate-600 disabled:opacity-30 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
      >
        <span>🔄 Reiniciar</span>
      </button>

      <button
        @click="handleStop"
        :disabled="!minecraftStore.isServerOnline || minecraftStore.loading"
        class="flex-1 min-w-[120px] bg-red-600 hover:bg-red-500 disabled:opacity-30 py-3 rounded-xl font-bold text-white transition-all active:scale-95"
      >
        <span>⏹ Detener</span>
      </button>
    </div>

    <transition name="fade">
      <div v-if="minecraftStore.error" class="mt-4 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-xs font-bold">
        {{ minecraftStore.error }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMinecraftStore } from '@/stores/minecraft'

const minecraftStore = useMinecraftStore()
const liveSeconds = ref(0)
let timer = null

// Formateador de tiempo humano
const formatDuration = (totalSeconds) => {
  if (totalSeconds <= 0) return '0d 0h 0m'
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

// Uptime calculado combinando el valor del API + el contador local
import { watch } from 'vue' // Agregar watch al import

const liveUptime = computed(() => {
  const baseSeconds = minecraftStore.uptime?.uptime_seconds || 0
  return formatDuration(baseSeconds + liveSeconds.value)
})

// Agregar después de startTimer():
watch(() => minecraftStore.uptime?.uptime_seconds, (newVal) => {
  // Resetear contador local cuando el uptime base cambie
  if (newVal !== undefined) {
    liveSeconds.value = 0
  }
})

// Iniciar contador local para que el tiempo avance sin refrescar API
const startTimer = () => {
  timer = setInterval(() => {
    if (minecraftStore.isServerOnline) {
      liveSeconds.value++
    } else {
      liveSeconds.value = 0
    }
  }, 1000)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearInterval(timer)
})

// Handlers con feedback visual
async function handleStart() {
  await minecraftStore.startServer()
  liveSeconds.value = 0
}

async function handleRestart() {
  if (confirm('¿Reiniciar servidor?')) {
    await minecraftStore.restartServer()
    liveSeconds.value = 0
  }
}

async function handleStop() {
  if (confirm('¿Detener servidor?')) {
    await minecraftStore.stopServer()
    liveSeconds.value = 0
  }
}
</script>