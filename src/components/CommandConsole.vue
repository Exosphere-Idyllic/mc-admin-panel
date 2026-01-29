<template>
  <div class="card">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-white mb-2">Consola de Comandos</h2>
      <p class="text-sm text-gray-400">Ejecuta comandos RCON en el servidor</p>
    </div>

    <!-- Command Input -->
    <div v-if="authStore.isOperator" class="mb-4">
      <div class="flex gap-2">
        <input
          v-model="command"
          type="text"
          placeholder="Escribe un comando... ej: list, say Hola, time set day"
          class="input flex-1 font-mono text-sm"
          @keyup.enter="handleSendCommand"
          :disabled="loading || !minecraftStore.isServerOnline"
        />
        <button
          @click="handleSendCommand"
          :disabled="!command || loading || !minecraftStore.isServerOnline"
          class="btn btn-primary"
        >
          {{ loading ? '⏳' : '▶️' }} Ejecutar
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-2">
        💡 Tip: Presiona Enter para ejecutar
      </p>
    </div>

    <!-- No permission warning -->
    <div v-else class="bg-yellow-500/10 border border-yellow-500 text-yellow-500 px-4 py-3 rounded mb-4">
      ⚠️ Solo operadores y administradores pueden ejecutar comandos
    </div>

    <!-- Command History -->
    <div class="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm space-y-2">
      <div v-if="history.length === 0" class="text-center text-gray-500 py-8">
        No hay comandos ejecutados aún
      </div>
      
      <div
        v-for="(item, index) in history"
        :key="index"
        class="border-b border-gray-800 pb-2"
      >
        <div class="flex items-start gap-2">
          <span class="text-gray-500 text-xs">{{ item.timestamp }}</span>
          <span class="text-blue-400">$</span>
          <span class="text-gray-300">{{ item.command }}</span>
        </div>
        <div v-if="item.response" class="ml-6 text-gray-400 text-xs mt-1 whitespace-pre-wrap">
          {{ item.response }}
        </div>
        <div v-if="item.error" class="ml-6 text-red-400 text-xs mt-1">
          ❌ {{ item.error }}
        </div>
      </div>
    </div>

    <!-- Quick Commands -->
    <div v-if="authStore.isOperator" class="mt-4">
      <p class="text-sm text-gray-400 mb-2">Comandos rápidos:</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cmd in quickCommands"
          :key="cmd.command"
          @click="executeQuickCommand(cmd.command)"
          :disabled="loading || !minecraftStore.isServerOnline"
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors"
        >
          {{ cmd.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'

const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

const command = ref('')
const loading = ref(false)
const history = reactive([])

const quickCommands = [
  { label: '📋 List', command: 'list' },
  { label: '☀️ Day', command: 'time set day' },
  { label: '🌙 Night', command: 'time set night' },
  { label: '☁️ Clear Weather', command: 'weather clear' },
  { label: '🌧️ Rain', command: 'weather rain' },
  { label: '💾 Save', command: 'save-all' }
]

async function handleSendCommand() {
  if (!command.value || loading.value) return

  loading.value = true
  const cmd = command.value.trim()
  const timestamp = new Date().toLocaleTimeString()

  try {
    const result = await minecraftStore.sendCommand(cmd)
    
    history.unshift({
      timestamp,
      command: cmd,
      response: result.success ? result.data.response : null,
      error: result.success ? null : result.error
    })

    command.value = ''
  } catch (err) {
    history.unshift({
      timestamp,
      command: cmd,
      error: err.message || 'Error desconocido'
    })
  } finally {
    loading.value = false
  }
}

async function executeQuickCommand(cmd) {
  command.value = cmd
  await handleSendCommand()
}
</script>