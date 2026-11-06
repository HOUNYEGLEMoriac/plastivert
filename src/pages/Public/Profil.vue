<template>
  <div class="app-shell">
    <main class="main">
      <header class="page-header">
        <h1>Choisir un profil de démonstration</h1>
        <p>
          Choisissez un compte de démonstration pour explorer l’application.
          Cette démo vous permet de tester chaque espace sans compte réel.
        </p>
      </header>

      <div class="grid grid-3" style="gap: var(--space-4); ">
        <div class="card" style="padding: var(--space-5); text-align:center; ">
          <div style="margin:0 0 var(--space-3); color: var(--color-primary); ">
            <Users />
          </div>
          <h2 style="margin:0 0 var(--space-2); ">Collecteur</h2>
          <p style="margin:0 0 var(--space-4); color: var(--color-text-secondary); font-size: var(--font-size-sm); ">
            Un ramasseur, une association ou un producteur qui collecte du plastique.
          </p>
          <Button type="primary" size="m" style="width:100%;" @click="loginAs('collecteur')">
            Continuer en tant que collecteur
          </Button>
        </div>
        <div class="card" style="padding: var(--space-5); text-align:center; ">
          <div style="margin:0 0 var(--space-3); color: var(--color-primary); ">
            <Map />
          </div>
          <h2 style="margin:0 0 var(--space-2); ">Centre partenaire</h2>
          <p style="margin:0 0 var(--space-4); color: var(--color-text-secondary); font-size: var(--font-size-sm); ">
            Un recyclage qui reçoit, valide, pèse et paye les lots.
          </p>
          <Button type="primary" size="m" style="width:100%;" @click="loginAs('centre')">
            Continuer en tant que centre
          </Button>
        </div>
        <div class="card" style="padding: var(--space-5); text-align:center; ">
          <div style="margin:0 0 var(--space-3); color: var(--color-primary); ">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
          </div>
          <h2 style="margin:0 0 var(--space-2); ">Administrateur</h2>
          <p style="margin:0 0 var(--space-4); color: var(--color-text-secondary); font-size: var(--font-size-sm); ">
            Valider les centres, gérer les comptes et lire les statistiques.
          </p>
          <Button type="primary" size="m" style="width:100%;" @click="loginAs('admin')">
            Continuer en tant qu’administrateur
          </Button>
        </div>
      </div>

      <div style="margin-top: var(--space-6); text-align:center; color: var(--color-text-muted); font-size: var(--font-size-sm); ">
        <p>
          À tout moment, vous pouvez changer de profil depuis l’en-tête de votre espace.
          Seul le profil connecté est visible dans les espaces dédiés.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore.js'
import { useRouter } from 'vue-router'
import Users from '../../components/icons/Users.vue'
import Map from '../../components/icons/Map.vue'
import Button from '../../components/ui/Button.vue'

const auth = useAuthStore()
const router = useRouter()

const loginAs = (role) => {
  auth.loginDemo(role)
  const routes = {
    collecteur: '/collecteur',
    centre: '/centre',
    admin: '/admin'
  }
  router.push(routes[role])
}
</script>
