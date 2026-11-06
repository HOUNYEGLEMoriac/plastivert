<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Centre de recyclage</p>
      <h1>Espace centre</h1>
      <p>Gérez votre centre, réceptionnez les lots et enregistrez les paiements.</p>
    </header>

    <div class="totals">
      <div class="pv-kpi"><span class="pv-kpi-label">Lots annoncés</span><span class="pv-kpi-value">{{ annonces }}</span><span class="pv-kpi-note">En attente de réception</span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Lots à payer</span><span class="pv-kpi-value">{{ aPayer }}</span><span class="pv-kpi-note">Reçus, paiement à enregistrer</span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Total versé</span><span class="pv-kpi-value">{{ fmt(totalPaye) }}<small>FCFA</small></span><span class="pv-kpi-note">Aux collecteurs</span></div>
    </div>

    <div class="cols">
      <section class="pv-card">
        <div class="pv-card-head">
          <h2>{{ monCentre?.nom || 'Mon centre' }}</h2>
          <RouterLink to="/centre/mon-centre" class="pv-btn pv-btn-secondary pv-sm">Modifier la fiche</RouterLink>
        </div>
        <p class="pv-muted">{{ monCentre?.adresse || '—' }}</p>
        <p class="pv-muted">{{ monCentre?.horaires || '' }}</p>
        <ul class="pv-prices">
          <li v-for="t in monCentre?.plastiquesAcceptes || []" :key="t">
            <span>{{ t }}</span><strong>{{ monCentre.prix?.[t] ?? '—' }} FCFA/kg</strong>
          </li>
        </ul>
      </section>

      <section class="pv-card">
        <div class="pv-card-head">
          <h2>Derniers lots</h2>
          <RouterLink to="/centre/lots" class="pv-btn pv-btn-secondary pv-sm">Tous les lots</RouterLink>
        </div>
        <p v-if="!lastLots.length" class="pv-muted">Aucun lot pour le moment.</p>
        <ul v-else class="lots">
          <li v-for="l in lastLots" :key="l.id">
            <div>
              <strong>{{ l.typePlastique }}</strong>
              <span class="pv-muted">{{ l.poidsReel ? formatKg(l.poidsReel) : formatKg(l.poidsEstime) + ' (estimé)' }} · {{ formatDate(l.dateReception || l.datePrevue) }}</span>
            </div>
            <span class="badge" :class="l.statut"><span class="dot"></span>{{ STATUTS[l.statut] || l.statut }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'
import { formatKg, formatDate } from '../../utils/helpers.js'

const auth = useAuthStore()
const root = useRootStore()
const STATUTS = { annonce: 'Annoncé', recu: 'Reçu', paye: 'Payé' }
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))

const monCentre = computed(() => (root.centres.list || []).find((c) => c.id === auth.profile?.centreId) || null)

// Lots du centre connecté, du plus récent au plus ancien
const lots = computed(() =>
  (root.lots.list || [])
    .filter((l) => l.centreId === auth.profile?.centreId)
    .sort((a, b) => String(b.dateReception || b.datePrevue).localeCompare(String(a.dateReception || a.datePrevue)))
)
const lastLots = computed(() => lots.value.slice(0, 5))
const annonces = computed(() => lots.value.filter((l) => l.statut === 'annonce').length)
const aPayer = computed(() => lots.value.filter((l) => l.statut === 'recu').length)
const totalPaye = computed(() => lots.value.filter((l) => l.statut === 'paye').reduce((s, l) => s + (l.montantPaye || 0), 0))
</script>

<style scoped>
.totals { display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
@media (min-width: 640px) { .totals { grid-template-columns: repeat(3, 1fr); } }
.cols { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 900px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.lots { list-style: none; margin: 0; padding: 0; }
.lots li { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.lots li:last-child { border-bottom: 0; }
.lots li > div { display: flex; flex-direction: column; gap: 2px; }
</style>