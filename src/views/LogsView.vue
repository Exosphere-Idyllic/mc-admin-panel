<template>
  <div class="p-6 max-w-[1600px] mx-auto">
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-black text-white tracking-tight">Logs del <span class="text-green-500">Sistema</span></h2>
        <p class="text-slate-400 font-medium">Registro de eventos de mc-admin-api y Minecraft</p>
      </div>

      <div class="flex items-center gap-3">
        <select 
          v-model="lines" 
          @change="fetchLogs"
          class="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:border-green-500"
        >
          <option :value="50">50 líneas</option>
          <option :value="100">100 líneas</option>
          <option :value="500">500 líneas</option>
        </select>

        <button 
          @click="toggleAutoRefresh"
          :class="[
            'px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all border',
            autoRefresh ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-slate-800 border-slate-700 text-slate-500'
          ]"
        >
          {{ autoRefresh ? 'Auto-sync ON' : 'Auto-sync OFF' }}
        </button>

        <button @click="fetchLogs" class="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <div class="relative group">
      <div 
        ref="logContainer"
        class="bg-slate-900 border border-slate-700 rounded-2xl p-6 h-[600px] overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-slate-700"
      >
        <div v-if="loading && !logs" class="flex items-center justify-center h-full">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>

        <div v-else-if="logs" class="space-y-1">
          <div v-for="(line, index) in formattedLogs" :key="index" class="hover:bg-slate-800/50 rounded px-2 py-0.5 transition-colors">
            <span class="text-slate-600 mr-3 select-none text-[10px]">{{ index + 1 }}</span>
            <span :class="getLineColor(line)">{{ line }}</span>
          </div>
        </div>

        <div v-else class="text-slate-500 text-center mt-20">
          No hay registros disponibles o el servidor no responde.
        </div>
      </div>

      <div class="absolute bottom-4 right-8 px-3 py-1 bg-slate-800/80 backdrop-blur border border-slate-600 rounded text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
        Live Feed
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import axios from '@/api/axios';

const logs = ref('');
const lines = ref(100);
const loading = ref(false);
const autoRefresh = ref(true);
const logContainer = ref(null);
let refreshInterval = null;

const formattedLogs = computed(() => {
  return logs.value ? logs.value.split('\n').filter(l => l.trim() !== '') : [];
});

const fetchLogs = async () => {
  loading.value = true;
  try {
    // Ajustado al endpoint de tu API según lo conversado
    const response = await axios.get(`/api/system/minecraft/logs?lines=${lines.value}`);
    logs.value = response.data.logs || response.data; // Maneja string directo o objeto
    
    // Auto-scroll al final después de actualizar
    await nextTick();
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  } catch (error) {
    console.error("Error cargando logs:", error);
  } finally {
    loading.value = false;
  }
};

const getLineColor = (line) => {
  if (line.includes('ERROR') || line.includes('FAILURE')) return 'text-red-400';
  if (line.includes('WARN')) return 'text-yellow-400';
  if (line.includes('INFO')) return 'text-blue-400';
  if (line.includes('vía RCON') || line.includes('issued server command')) return 'text-purple-400';
  return 'text-slate-300';
};

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;
  if (autoRefresh.value) {
    startInterval();
  } else {
    clearInterval(refreshInterval);
  }
};

const startInterval = () => {
  clearInterval(refreshInterval);
  refreshInterval = setInterval(fetchLogs, 5000); // Cada 5 segundos
};

onMounted(() => {
  fetchLogs();
  startInterval();
});

onUnmounted(() => {
  clearInterval(refreshInterval);
});
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>