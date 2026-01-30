<template>
  <nav class="bg-slate-800 border-b border-slate-700 px-6 py-4">
    <div class="flex justify-between items-center max-w-[1600px] mx-auto">
      
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-3 group cursor-pointer" @click="router.push('/')">
          <div class="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
            <svg viewBox="0 0 24 24" class="w-7 h-7 fill-green-500" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 4v4h4V6H6zm8 0v4h4V6h-4zm-4 4v4h4v-4h-4zm-4 4v4h4v-4H6zm8 0v4h4v-4h-4z"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <h1 class="text-lg font-black text-white leading-none tracking-tight">
              MINECRAFT <span class="text-green-500">ADMIN</span>
            </h1>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Raspberry Pi 4</p>
          </div>
        </div>

        <div class="hidden lg:flex items-center gap-2">
          <router-link to="/" class="nav-link" active-class="active">
            General
          </router-link>
          <router-link to="/hardware" class="nav-link" active-class="active">
            Hardware
          </router-link>
          <router-link to="/console" class="nav-link" active-class="active">
            Consola
          </router-link>
          <router-link to="/logs" class="nav-link" active-class="active">
            Logs
          </router-link>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-900/50 rounded-full border border-slate-700">
          <span class="relative flex h-2 w-2">
            <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', serverActive ? 'bg-green-400' : 'bg-red-400']"></span>
            <span :class="['relative inline-flex rounded-full h-2 w-2', serverActive ? 'bg-green-500' : 'bg-red-500']"></span>
          </span>
          <span :class="['text-[11px] font-black uppercase tracking-widest', serverActive ? 'text-green-400' : 'text-red-400']">
            {{ serverActive ? 'Online' : 'Offline' }}
          </span>
        </div>

        <div class="flex items-center gap-4 pl-6 border-l border-slate-700">
          <div class="text-right">
            <p class="text-sm font-bold text-slate-200 leading-none">{{ authStore.user?.username || 'admin' }}</p>
            <p class="text-[10px] text-slate-500 font-bold uppercase">Administrador</p>
          </div>
          <button @click="logout" class="logout-btn">
            Salir
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMinecraftStore } from '@/stores/minecraft'

const router = useRouter()
const authStore = useAuthStore()
const mcStore = useMinecraftStore()

const serverActive = computed(() => mcStore.status?.active)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.nav-link {
  @apply px-4 py-2 text-sm font-bold text-slate-400 rounded-lg transition-all hover:text-white hover:bg-slate-700/50;
}

.nav-link.active {
  @apply text-green-500 bg-green-500/10;
}

.logout-btn {
  @apply px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white 
         text-sm font-bold rounded-lg border border-red-500/20 transition-all duration-200;
}
</style>