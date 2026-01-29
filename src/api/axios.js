import axios from 'axios'

// URL base de tu API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// =====================
// AUTH
// =====================
export const authAPI = {
  login: (username, password) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    return api.post('/auth/login', formData)
  }
}

// =====================
// MINECRAFT
// =====================
export const minecraftAPI = {
  getPlayers: () => api.get('/minecraft/players'),
  sendCommand: (command) => api.post('/minecraft/command', { command }),
  sendMessage: (message) => api.post('/minecraft/message', { message }),
  getAllowedCommands: () => api.get('/minecraft/commands/allowed'),
  
  // Whitelist
  whitelistAdd: (player) => api.post(`/minecraft/whitelist/add/${player}`),
  whitelistRemove: (player) => api.post(`/minecraft/whitelist/remove/${player}`),
  
  // Kick/Ban
  kickPlayer: (player, reason = '') => api.post(`/minecraft/kick/${player}`, null, { params: { reason } }),
  banPlayer: (player, reason = '') => api.post(`/minecraft/ban/${player}`, null, { params: { reason } }),
  pardonPlayer: (player) => api.post(`/minecraft/pardon/${player}`)
}

// =====================
// SYSTEM
// =====================
export const systemAPI = {
  // Status
  getSystemStatus: () => api.get('/system/status'),
  
  // Minecraft Service
  getMinecraftStatus: () => api.get('/system/minecraft/status'),
  startMinecraft: () => api.post('/system/minecraft/start'),
  stopMinecraft: () => api.post('/system/minecraft/stop'),
  restartMinecraft: () => api.post('/system/minecraft/restart'),
  getMinecraftLogs: (lines = 100) => api.get('/system/minecraft/logs', { params: { lines } }),
  getMinecraftUptime: () => api.get('/system/minecraft/uptime'),
  
  // Playit Service
  getPlayitStatus: () => api.get('/system/playit/status'),
  startPlayit: () => api.post('/system/playit/start'),
  stopPlayit: () => api.post('/system/playit/stop'),
  restartPlayit: () => api.post('/system/playit/restart'),
  getPlayitLogs: (lines = 100) => api.get('/system/playit/logs', { params: { lines } })
}

// =====================
// HARDWARE
// =====================
export const hardwareAPI = {
  getTemperature: () => api.get('/hardware/temperature'),
  getCPUFrequency: () => api.get('/hardware/cpu/frequency'),
  getVoltage: () => api.get('/hardware/cpu/voltage'),
  getResources: () => api.get('/hardware/resources'),
  getThrottle: () => api.get('/hardware/throttle'),
  getFullStats: () => api.get('/hardware/stats')
}

// =====================
// USERS
// =====================
export const usersAPI = {
  list: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (userId, data) => api.put(`/users/${userId}`, data),
  delete: (userId) => api.delete(`/users/${userId}`)
}

export default api