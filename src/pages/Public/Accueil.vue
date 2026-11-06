<template>
  <PublicLayout>
    <section class="pv-container pv-hero">
      <h1>Relier les collecteurs de plastique aux centres de recyclage d’Abomey-Calavi</h1>
      <p>Trouvez où vendre votre plastique, à quel prix, et suivez vos lots du dépôt au paiement.</p>
      <div class="pv-actions">
        <RouterLink to="/carte" class="pv-btn pv-btn-primary">Voir la carte des centres</RouterLink>
        <RouterLink to="/profil" class="pv-btn pv-btn-secondary">Accéder à mon espace</RouterLink>
      </div>
    </section>

    <section class="pv-container" aria-label="Chiffres clés">
      <div class="pv-kpis">
        <div v-for="k in kpis" :key="k.label" class="pv-kpi">
          <span class="pv-kpi-label">{{ k.label }}</span>
          <span class="pv-kpi-value">{{ fmt(k.value) }}<small v-if="k.unit">{{ k.unit }}</small></span>
          <span class="pv-kpi-note">{{ k.note }}</span>
        </div>
      </div>
      <p class="pv-muted pv-demo">Données de démonstration</p>
    </section>

    <section class="pv-container pv-two">
      <article class="pv-panel">
        <h2>Le problème</h2>
        <p>Les emballages plastiques s’accumulent dans les rues d’Abomey-Calavi. Beaucoup sont brûlés ou jetés, alors que ceux qui les ramassent ne savent pas où les vendre, ni à quel prix.</p>
      </article>
      <article class="pv-panel">
        <h2>La solution</h2>
        <p>Une plateforme simple qui indique aux collecteurs les centres de recyclage proches, leurs prix au kilo, et permet d’annoncer un lot puis de suivre son paiement.</p>
      </article>
    </section>

    <section class="pv-container">
      <h2 class="pv-h2">Comment ça marche</h2>
      <div class="pv-steps">
        <div v-for="(s, i) in steps" :key="s.title" class="pv-step">
          <span class="pv-step-num">{{ i + 1 }}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="s.icon"></svg>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </section>

    <section class="pv-container">
      <h2 class="pv-h2">Pour qui</h2>
      <div class="pv-three">
        <article v-for="w in who" :key="w.title" class="pv-panel">
          <h3>{{ w.title }}</h3>
          <p>{{ w.text }}</p>
        </article>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '../../components/PublicLayout.vue'
import { useRootStore } from '../../stores/index.js'

const root = useRootStore()
const stats = computed(() => root.stats || {})
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))

const kpis = computed(() => [
  { label: 'Plastique détourné', value: stats.value.collected, unit: 'kg', note: 'Pesé et reçu en centre' },
  { label: 'Argent versé', value: stats.value.paye, unit: 'FCFA', note: 'Payé aux collecteurs' },
  { label: 'Collecteurs actifs', value: stats.value.collecteursActifs, unit: '', note: 'Inscrits sur la plateforme' },
  { label: 'Centres actifs', value: stats.value.centresActifs, unit: '', note: 'Centres validés' }
])

const steps = [
  { title: 'Ramasser', text: 'Collectez et triez le plastique par type.', icon: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' },
  { title: 'Trouver un centre', text: 'Repérez le centre le plus proche et ses prix au kilo.', icon: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>' },
  { title: 'Annoncer son lot', text: 'Indiquez le type et le poids estimé avant de venir.', icon: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>' },
  { title: 'Être payé', text: 'Le centre pèse le lot, puis vous paie en espèces ou mobile money.', icon: '<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7l12-3v3M16 14h3"/>' }
]

const who = [
  { title: 'Collecteurs', text: 'Trouver un centre, comparer les prix et suivre ses paiements.' },
  { title: 'Centres de recyclage', text: 'Recevoir des lots annoncés et organiser son approvisionnement.' },
  { title: 'La ville', text: 'Moins de plastique brûlé ou abandonné, mesuré lot après lot.' }
]
</script>