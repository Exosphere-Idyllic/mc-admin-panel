<template>
  <div class="min-h-screen bg-slate-900 text-slate-200">
    <Navbar />

    <div class="container mx-auto px-4 py-8 max-w-[1600px]">
      
      <div class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-4xl font-black text-white tracking-tight mb-2">
            Panel de <span class="text-green-500">Control</span>
          </h1>
          <p class="text-slate-400 font-medium text-lg">
            Bienvenido de nuevo, <span class="text-white font-bold">{{ authStore.user?.username || 'Admin' }}</span>
          </p>
        </div>
        
        <div class="flex gap-3">
            <span class="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 border border-slate-700">
                Vista General
            </span>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div class="xl:col-span-2 space-y-8">
          <div class="bg-slate-800/50 border border-slate-700/50 p-1 rounded-2xl">
              <ServerControl />
          </div>

          </div>

        <div class="xl:col-span-1">
          <div class="sticky top-6">
            <PlayersList />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'

// Importamos solo lo necesario para esta vista
import Navbar from '@/components/Navbar.vue' // Asegúrate que la ruta sea correcta según donde guardaste el nuevo Navbar
import ServerControl from '@/components/ServerControl.vue'
import PlayersList from '@/components/PlayersList.vue'

const authStore = useAuthStore()
const minecraftStore = useMinecraftStore()

let refreshInterval = null

onMounted(() => {
  loadData()
  // Iniciamos un polling ligero solo para estado y jugadores
  refreshInterval = setInterval(loadData, 5000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})

// Función para cargar solo lo que este dashboard necesita
const loadData = async () => {
  await Promise.all([
    minecraftStore.fetchServerStatus(),
    minecraftStore.fetchPlayers(),
    // Ya no pedimos hardware ni logs aquí para ahorrar recursos
    minecraftStore.fetchUptime()
  ])
}
</script>