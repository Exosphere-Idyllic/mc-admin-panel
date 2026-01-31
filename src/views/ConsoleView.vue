<template>
  <div class="min-h-screen bg-slate-900">
    <Navbar />
    
    <div class="p-6 max-w-[1600px] mx-auto">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h2 class="text-3xl font-black text-white tracking-tight">Consola de <span class="text-green-500">Comandos</span></h2>
          <p class="text-slate-400 font-medium">Interacción directa vía RCON con el servidor</p>
        </div>
        
        <div :class="[
          'px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all',
          serverActive ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'
        ]">
          {{ serverActive ? 'RCON Conectado' : 'RCON Desconectado' }}
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        <div class="xl:col-span-3">
          <CommandConsole />
        </div>

        <div class="space-y-6">
          <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Acciones de Operador</h3>
            
            <div class="space-y-3">
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Dar permisos (OP)</label>
                <div class="flex gap-2">
                  <input 
                    v-model="opPlayer" 
                    type="text" 
                    placeholder="Nombre del jugador..."
                    class="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button 
                    @click="handleMakeOp"
                    :disabled="!opPlayer || !serverActive"
                    class="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 text-white p-2 rounded-lg transition-all"
                    title="Convertir en OP"
                  >
                    <span class="text-lg">👑</span>
                  </button>
                </div>
              </div>

              <hr class="border-slate-700 my-4" />

              <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Comandos Rápidos</label>
              <div class="grid grid-cols-1 gap-2">
                <button @click="quickCommand('list')" class="quick-btn">Listar Jugadores</button>
                <button @click="quickCommand('whitelist list')" class="quick-btn">Ver Whitelist</button>
                <button @click="quickCommand('save-all')" class="quick-btn text-blue-400">Guardar Mundo</button>
              </div>
            </div>
          </div>

          <div class="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
            <p class="text-[11px] text-blue-400 leading-relaxed">
              <span class="font-bold block mb-1">💡 TIP DE SEGURIDAD</span>
              Recuerda que los comandos ejecutados aquí tienen nivel de consola. Sé cuidadoso al otorgar el rango de Operador (OP).
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/Navbar.vue';
import CommandConsole from '@/components/CommandConsole.vue';
import { useMinecraftStore } from '@/stores/minecraft';
import axios from '@/api/axios';

const mcStore = useMinecraftStore();
const opPlayer = ref('');
const serverActive = computed(() => mcStore.status?.active);

// Función para dar OP (Botón de Corona)
const handleMakeOp = async () => {
  if (!opPlayer.value) return;
  
  try {
    const response = await axios.post(`/minecraft/op/${opPlayer.value}`);
    alert(`Comando ejecutado: ${response.data.response}`);
    opPlayer.value = '';
  } catch (error) {
    alert("Error al intentar dar OP: " + error.message);
  }
};

// Función para botones de comandos rápidos
const quickCommand = async (cmd) => {
  if (!serverActive.value) return;
  try {
    await mcStore.executeCommand(cmd);
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped>
.quick-btn {
  @apply w-full text-left px-4 py-2 bg-slate-900/50 hover:bg-slate-700 border border-slate-700/50 
         rounded-xl text-xs font-bold text-slate-300 transition-all hover:translate-x-1;
}
</style>
