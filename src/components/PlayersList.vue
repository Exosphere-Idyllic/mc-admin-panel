<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-white">Jugadores Online</h2>
        <p class="text-sm text-gray-400">{{ minecraftStore.players.online }} jugador(es) conectado(s)</p>
      </div>
      <button
        @click="minecraftStore.fetchPlayers()"
        class="btn btn-secondary text-sm"
      >
        🔄 Actualizar
      </button>
    </div>

    <!-- Players List -->
    <div v-if="minecraftStore.players.online > 0" class="space-y-2">
      <div
        v-for="player in minecraftStore.players.players"
        :key="player"
        class="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors"
      >
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <span class="text-xl">👤</span>
          </div>
          <div>
            <p class="font-medium text-white">{{ player }}</p>
            <p class="text-xs text-gray-400">Jugador conectado</p>
          </div>
        </div>

        <!-- Actions (only for operators) -->
        <div v-if="authStore.isOperator" class="flex gap-2">
          <button
            @click="handleKick(player)"
            class="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
            title="Expulsar"
          >
            ⚠️ Kick
          </button>
          <button
            v-if="authStore.isAdmin"
            @click="handleBan(player)"
            class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            title="Banear"
          >
            🚫 Ban
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <span class="text-6xl mb-4 block">😴</span>
      <p class="text-gray-400">No hay jugadores conectados</p>
    </div>

    <!-- Whitelist Section -->
    <div v-if="authStore.isOperator" class="mt-6 pt-6 border-t border-gray-700">
      <h3 class="text-lg font-semibold text-white mb-4">Gestionar Whitelist</h3>
      <div class="flex gap-2">
        <input
          v-model="whitelistPlayer"
          type="text"
          placeholder="Nombre del jugador"
          class="input flex-1"
          @keyup.enter="handleWhitelistAdd"
        />
        <button
          @click="handleWhitelistAdd"
          :disabled="!whitelistPlayer"
          class="btn btn-success"
        >
          ➕ Agregar
        </button>
        <button
          v-if="authStore.isAdmin"
          @click="handleWhitelistRemove"
          :disabled="!whitelistPlayer"
          class="btn btn-danger"
        >
          ➖ Remover
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'
import { minecraftAPI } from '@/api/axios'

const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

const whitelistPlayer = ref('')

async function handleKick(player) {
  const reason = prompt(`¿Por qué expulsar a ${player}?`, 'Expulsado por administrador')
  if (reason !== null) {
    try {
      await minecraftAPI.kickPlayer(player, reason)
      alert(`${player} ha sido expulsado`)
      minecraftStore.fetchPlayers()
    } catch (err) {
      alert('Error al expulsar jugador: ' + (err.response?.data?.detail || err.message))
    }
  }
}

async function handleBan(player) {
  const reason = prompt(`¿Por qué banear a ${player}?`, 'Baneado por administrador')
  if (reason !== null) {
    if (confirm(`¿Confirmas que quieres BANEAR permanentemente a ${player}?`)) {
      try {
        await minecraftAPI.banPlayer(player, reason)
        alert(`${player} ha sido baneado`)
        minecraftStore.fetchPlayers()
      } catch (err) {
        alert('Error al banear jugador: ' + (err.response?.data?.detail || err.message))
      }
    }
  }
}

async function handleWhitelistAdd() {
  if (!whitelistPlayer.value) return
  
  try {
    await minecraftAPI.whitelistAdd(whitelistPlayer.value)
    alert(`${whitelistPlayer.value} agregado a la whitelist`)
    whitelistPlayer.value = ''
  } catch (err) {
    alert('Error: ' + (err.response?.data?.detail || err.message))
  }
}

async function handleWhitelistRemove() {
  if (!whitelistPlayer.value) return
  
  if (confirm(`¿Remover a ${whitelistPlayer.value} de la whitelist?`)) {
    try {
      await minecraftAPI.whitelistRemove(whitelistPlayer.value)
      alert(`${whitelistPlayer.value} removido de la whitelist`)
      whitelistPlayer.value = ''
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message))
    }
  }
}
</script>