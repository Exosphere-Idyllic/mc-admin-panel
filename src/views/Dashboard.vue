<template>
  <div class="min-h-screen bg-gray-900">
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p class="text-gray-400">Bienvenido, {{ authStore.user?.username }}</p>
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Server Control & Players -->
        <div class="lg:col-span-2 space-y-6">
          <ServerControl />
          <PlayersList />
          <CommandConsole />
        </div>

        <!-- Right Column - Hardware Stats -->
        <div class="lg:col-span-1">
          <HardwareStats />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'
import Navbar from '@/components/Navbar.vue'
import ServerControl from '@/components/ServerControl.vue'
import PlayersList from '@/components/PlayersList.vue'
import HardwareStats from '@/components/HardwareStats.vue'
import CommandConsole from '@/components/CommandConsole.vue'

const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

onMounted(() => {
  // Cargar datos iniciales
  minecraftStore.fetchServerStatus()
  minecraftStore.fetchPlayers()
  minecraftStore.fetchHardware()
  minecraftStore.fetchUptime()
  
  // Iniciar auto-refresh cada 5 segundos
  minecraftStore.startAutoRefresh(5000)
})

onUnmounted(() => {
  // Detener auto-refresh al salir
  minecraftStore.stopAutoRefresh()
})
</script>