<template>
  <div class="pv-page">
    <header class="pv-header">
      <div class="pv-container pv-header-inner">
        <RouterLink to="/" class="pv-logo">Plastivert</RouterLink>

        <nav id="pv-nav" class="pv-nav" :class="{ open }" aria-label="Navigation principale">
          <RouterLink to="/">Accueil</RouterLink>
          <RouterLink to="/carte">Carte des centres</RouterLink>
          <RouterLink to="/comment-ca-marche">Comment ça marche</RouterLink>
          <RouterLink :to="space.to" class="pv-btn pv-btn-primary pv-nav-cta">{{ space.label }}</RouterLink>
        </nav>

        <button
          class="pv-burger"
          type="button"
          :aria-expanded="open"
          aria-controls="pv-nav"
          aria-label="Ouvrir le menu"
          @click="open = !open"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>

    <main class="pv-main"><slot /></main>

    <footer class="pv-footer">
      <div class="pv-container pv-footer-inner">
        <div>
          <strong>Plastivert</strong>
          <p>Plateforme de mise en relation entre collecteurs de plastique et centres de recyclage, à Abomey-Calavi.</p>
        </div>
        <div>
          <RouterLink to="/carte">Carte des centres</RouterLink>
          <RouterLink to="/comment-ca-marche">Comment ça marche</RouterLink>
        </div>
        <div>
          <p>contact@plastivert.bj</p>
          <p class="pv-muted">Données de démonstration</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const auth = useAuthStore()
const route = useRoute()
const open = ref(false)

// Lien vers l'espace personnel selon le profil connecté
const space = computed(() => {
  if (!auth.isAuthenticated()) return { to: '/profil', label: 'Se connecter' }
  const home = { collecteur: '/collecteur', centre: '/centre', admin: '/admin' }
  return { to: home[auth.role] || '/profil', label: 'Mon espace' }
})

watch(() => route.fullPath, () => { open.value = false })
</script>