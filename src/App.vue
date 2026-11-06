<template>
  <RouterView v-if="!auth.isAuthenticated()" />

  <div v-else class="pv-app">
    <Sidebar />
    <main class="pv-content">
      <RouterView />
    </main>
    <BottomNav />
  </div>

  <ToastContainer />
</template>

<script setup>
import { useAuthStore } from './stores/authStore.js'
import { useRootStore } from './stores/index.js'
import Sidebar from './components/Sidebar.vue'
import BottomNav from './components/BottomNav.vue'
import ToastContainer from './components/ToastContainer.vue'

const auth = useAuthStore()
const root = useRootStore()

// Charge toujours les données au démarrage : chaque store lit d'abord
// ce qui est sauvegardé dans le localStorage, sinon les données de démonstration.
root.loadAll()
</script>