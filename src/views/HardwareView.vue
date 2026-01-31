<template>
  <div class="min-h-screen bg-slate-900">
    <Navbar />
    
    <div class="p-6 max-w-[1600px] mx-auto">
      <div class="mb-8">
        <h2 class="text-3xl font-black text-white tracking-tight">Monitoreo de <span class="text-green-500">Hardware</span></h2>
        <p class="text-slate-400 font-medium">Estadísticas en tiempo real de la Raspberry Pi 4</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 space-y-6">
          <HardwareStats />
          
          <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Detalles del Nodo
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p class="text-slate-500 font-bold uppercase text-[10px]">SO</p>
                <p class="text-slate-200 font-mono">Raspbian 11</p>
              </div>
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p class="text-slate-500 font-bold uppercase text-[10px]">Arquitectura</p>
                <p class="text-slate-200 font-mono">aarch64</p>
              </div>
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p class="text-slate-500 font-bold uppercase text-[10px]">Núcleos</p>
                <p class="text-slate-200 font-mono">4x Cortex-A72</p>
              </div>
              <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <p class="text-slate-500 font-bold uppercase text-[10px]">Local IP</p>
                <p class="text-slate-200 font-mono">192.168.0.100</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm font-black text-slate-500 uppercase tracking-widest mb-6">Estado Crítico</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <span class="text-sm text-slate-300">Estado Térmico</span>
                <span :class="tempClass" class="text-xs font-bold px-2 py-1 rounded-md">
                  {{ tempStatus }}
                </span>
              </div>
              
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/50">
                <span class="text-sm text-slate-300">Sistema Activo</span>
                <span class="text-xs font-mono text-green-500">{{ systemUptime }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import HardwareStats from '@/components/HardwareStats.vue';
import { useMinecraftStore } from '@/stores/minecraft';

const minecraftStore = useMinecraftStore();

// Lógica para etiquetas de temperatura
const tempStatus = computed(() => {
  const temp = minecraftStore.hardware.temperature?.celsius || 0;
  if (temp < 60) return 'Estable';
  if (temp < 75) return 'Templada';
  return 'Crítica';
});

const tempClass = computed(() => {
  const temp = minecraftStore.hardware.temperature?.celsius || 0;
  if (temp < 60) return 'text-green-400 bg-green-400/10';
  if (temp < 75) return 'text-yellow-400 bg-yellow-400/10';
  return 'text-red-400 bg-red-400/10';
});

const systemUptime = computed(() => 
  minecraftStore.hardware.resources?.uptime?.formatted || '0d 0h 0m'
);

let refreshInterval = null;

onMounted(() => {
  minecraftStore.fetchHardware();
  refreshInterval = setInterval(() => {
    minecraftStore.fetchHardware();
  }, 5000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});
</script>