import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { minecraftAPI, systemAPI, hardwareAPI } from '@/api/axios'

export const useMinecraftStore = defineStore('minecraft', () => {
  // --- STATE ---
  const players = ref({ online: 0, max: 20, players: [] })
  const serverStatus = ref({
    minecraft: { active: false, state: 'inactive' },
    playit: { active: false, state: 'inactive' }
  })
  const hardware = ref({
    temperature: 0,
    resources: null,
    uptime_system: '0d 0h 0m'
  })
  const uptime = ref({
    uptime_seconds: 0,
    uptime_formatted: '0d 0h 0m'
  })
  const loading = ref(false)
  const error = ref(null)

  // --- GETTERS ---
  const isServerOnline = computed(() => serverStatus.value.minecraft.active)

  const status = computed(() => serverStatus.value.minecraft)
  
  const playerCount = computed(() => players.value.online)

  const stats = computed(() => ({
    cpu: hardware.value.resources?.cpu?.percent || 0,
    ram: hardware.value.resources?.ram?.percent || 0,
    temp: hardware.value.temperature || 0,
    disk: hardware.value.resources?.disk?.percent || 0,
    uptime_system: hardware.value.uptime_system
  }))

  // --- ACTIONS ---

  async function fetchServerStatus() {
    try {
      const response = await systemAPI.getSystemStatus()
      serverStatus.value = response.data
    } catch (err) {
      console.error('Error fetching status:', err)
    }
  }

  async function fetchPlayers() {
    if (!isServerOnline.value) {
      players.value = { online: 0, max: 20, players: [] }
      return
    }
    try {
      const response = await minecraftAPI.getPlayers()
      players.value = response.data
    } catch (err) {
      players.value = { online: 0, max: 20, players: [] }
    }
  }

  async function fetchHardware() {
    try {
      const response = await hardwareAPI.getFullStats()
      hardware.value = response.data
    } catch (err) {
      console.error('Hardware fetch error:', err)
    }
  }

  async function fetchUptime() {
    if (!isServerOnline.value) {
      uptime.value = { uptime_seconds: 0, uptime_formatted: '0d 0h 0m' }
      return
    }
    try {
      const response = await systemAPI.getMinecraftUptime()
      uptime.value = {
        uptime_seconds: parseInt(response.data.uptime_seconds) || 0,
        uptime_formatted: response.data.uptime_formatted || '0d 0h 0m'
      }
    } catch (err) {
      console.error('Uptime fetch error:', err)
    }
  }

  // Controladores de Servidor
  async function startServer() {
    loading.value = true
    error.value = null
    try {
      await systemAPI.startMinecraft()
      await fetchServerStatus()
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al iniciar'
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
      uptime.value = { uptime_seconds: 0, uptime_formatted: '0d 0h 0m' }
      return true
    } catch (err) {
      error.value = err.response?.data?.detail || 'Error al detener'
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
      error.value = err.response?.data?.detail || 'Error al reiniciar'
      return false
    } finally { 
      loading.value = false 
    }
  }

  // ⭐ MÉTODO CORREGIDO - sendCommand
  async function sendCommand(command) {
    try {
      const response = await minecraftAPI.sendCommand(command)
      return {
        success: true,
        data: response.data
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Error al ejecutar comando'
      }
    }
  }

  // Alias para mantener compatibilidad
  async function executeCommand(command) {
    return sendCommand(command)
  }

  // --- REFRESH LOGIC ---
  let refreshInterval = null
  
  function startAutoRefresh(interval = 5000) {
    stopAutoRefresh()
    refreshInterval = setInterval(async () => {
      await fetchServerStatus()
      if (isServerOnline.value) {
        fetchPlayers()
        fetchUptime()
      }
      fetchHardware()
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
    stats, 
    status,
    
    // Actions
    fetchPlayers, 
    fetchServerStatus, 
    fetchHardware, 
    fetchUptime,
    startServer, 
    stopServer, 
    restartServer, 
    sendCommand,        
    executeCommand,     
    startAutoRefresh, 
    stopAutoRefresh
  }
})