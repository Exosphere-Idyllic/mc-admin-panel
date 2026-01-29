import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { minecraftAPI, systemAPI, hardwareAPI } from '@/api/axios'

export const useMinecraftStore = defineStore('minecraft', () => {
  // State - Players
  const players = ref({
    online: 0,
    max: 20,
    players: []
  })

  // State - Server Status
  const serverStatus = ref({
    minecraft: { active: false, state: 'inactive' },
    playit: { active: false, state: 'inactive' }
  })

  // State - Hardware
  const hardware = ref({
    temperature: null,
    resources: null,
    throttle: null
  })

  // State - Uptime
  const uptime = ref({
    seconds: 0,
    formatted: '0d 0h 0m'
  })

  // State - Loading & Errors
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isServerOnline = computed(() => serverStatus.value.minecraft.active)
  const playerCount = computed(() => `${players.value.online}/${players.value.max}`)
  const cpuStatus = computed(() => {
    if (!hardware.value.resources) return 'unknown'
    const percent = hardware.value.resources.cpu.percent
    if (percent > 80) return 'high'
    if (percent > 60) return 'medium'
    return 'normal'
  })

  // Actions - Players
  async function fetchPlayers() {
    try {
      const response = await minecraftAPI.getPlayers()
      players.value = response.data
    } catch (err) {
      console.error('Error fetching players:', err)
      players.value = { online: 0, max: 20, players: [] }
    }
  }

  // Actions - Server Control
  async function fetchServerStatus() {
    try {
      const response = await systemAPI.getSystemStatus()
      serverStatus.value = response.data
    } catch (err) {
      console.error('Error fetching status:', err)
    }
  }

  async function startServer() {
    loading.value = true
    error.value = null
    try {
      await systemAPI.startMinecraft()
      await fetchServerStatus()
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al iniciar servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  async function stopServer() {
    loading.value = true
    error.value = null
    try {
      await systemAPI.stopMinecraft()
      await fetchServerStatus()
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al detener servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  async function restartServer() {
    loading.value = true
    error.value = null
    try {
      await systemAPI.restartMinecraft()
      await fetchServerStatus()
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al reiniciar servidor'
      return false
    } finally {
      loading.value = false
    }
  }

  // Actions - Hardware
  async function fetchHardware() {
    try {
      const response = await hardwareAPI.getFullStats()
      hardware.value = response.data
    } catch (err) {
      console.error('Error fetching hardware:', err)
    }
  }

  // Actions - Uptime
  async function fetchUptime() {
    try {
      const response = await systemAPI.getMinecraftUptime()
      uptime.value = response.data
    } catch (err) {
      console.error('Error fetching uptime:', err)
    }
  }

  // Actions - Commands
  async function sendCommand(command) {
    try {
      const response = await minecraftAPI.sendCommand(command)
      return { success: true, data: response.data }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Error al ejecutar comando' 
      }
    }
  }

  async function sendMessage(message) {
    try {
      const response = await minecraftAPI.sendMessage(message)
      return { success: true, data: response.data }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Error al enviar mensaje' 
      }
    }
  }

  // Auto-refresh
  let refreshInterval = null
  
  function startAutoRefresh(interval = 5000) {
    if (refreshInterval) clearInterval(refreshInterval)
    
    refreshInterval = setInterval(() => {
      fetchPlayers()
      fetchServerStatus()
      fetchHardware()
      fetchUptime()
    }, interval)
  }

  function stopAutoRefresh() {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    // State
    players,
    serverStatus,
    hardware,
    uptime,
    loading,
    error,

    // Getters
    isServerOnline,
    playerCount,
    cpuStatus,

    // Actions
    fetchPlayers,
    fetchServerStatus,
    fetchHardware,
    fetchUptime,
    startServer,
    stopServer,
    restartServer,
    sendCommand,
    sendMessage,
    startAutoRefresh,
    stopAutoRefresh
  }
})