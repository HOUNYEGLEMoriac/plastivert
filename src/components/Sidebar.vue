<template>
  <aside class="pv-sidebar" aria-label="Navigation de l'espace">
    <RouterLink to="/" class="pv-sidebar-brand">Plastivert</RouterLink>

    <nav class="pv-sidebar-nav">
      <RouterLink v-for="item in items" :key="item.to" :to="item.to">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icon(item.icon)"></svg>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="pv-sidebar-foot">
      <p class="pv-sidebar-name">{{ auth.profile?.nom || 'Compte' }}</p>
      <p class="pv-sidebar-role">{{ ROLE_LABELS[auth.role] || '' }}</p>
      <button type="button" class="pv-btn pv-btn-secondary pv-sm" @click="switchProfile">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icon('logout')"></svg>
        Changer de profil
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import { navFor, icon, ROLE_LABELS } from './navConfig.js'

const auth = useAuthStore()
const router = useRouter()
const items = computed(() => navFor(auth.role))

function switchProfile() {
  auth.logout()
  router.push('/profil')
}
</script>