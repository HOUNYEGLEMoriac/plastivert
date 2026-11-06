<template>
  <nav class="pv-bottomnav" aria-label="Navigation mobile">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icon(item.icon)"></svg>
      <span>{{ item.short }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import { navFor, icon } from './navConfig.js'

const auth = useAuthStore()
const items = computed(() => navFor(auth.role))
</script>