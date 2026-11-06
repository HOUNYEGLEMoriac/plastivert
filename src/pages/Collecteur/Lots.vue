<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Collecteur</p>
      <h1>Mes lots</h1>
      <p>Suivez vos lots annoncés, reçus et payés.</p>
    </header>

    <div class="totals">
      <div class="pv-kpi"><span class="pv-kpi-label">Lots</span><span class="pv-kpi-value">{{ rows.length }}</span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Plastique apporté</span><span class="pv-kpi-value">{{ fmt(totalKg) }}<small>kg</small></span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Total gagné</span><span class="pv-kpi-value">{{ fmt(totalGagne) }}<small>FCFA</small></span></div>
    </div>

    <section class="pv-card">
      <div class="pv-card-head">
        <h2>Historique</h2>
        <RouterLink to="/collecteur/annonce" class="pv-btn pv-btn-primary pv-sm">Annoncer un lot</RouterLink>
      </div>

      <p v-if="!rows.length" class="pv-muted">Aucun lot pour le moment. Annoncez votre premier lot pour le voir apparaître ici.</p>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Centre</th>
              <th>Plastique</th>
              <th class="num">Poids estimé</th>
              <th class="num">Poids réel</th>
              <th>Prévu le</th>
              <th>Statut</th>
              <th class="num">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in rows" :key="l.id">
              <td>{{ root.centres.byId[l.centreId]?.nom || l.centreId }}</td>
              <td>{{ l.typePlastique }}</td>
              <td class="num">{{ formatKg(l.poidsEstime) }}</td>
              <td class="num">{{ l.poidsReel ? formatKg(l.poidsReel) : '—' }}</td>
              <td>{{ formatDate(l.datePrevue) }}</td>
              <td><span class="badge" :class="l.statut"><span class="dot"></span>{{ STATUTS[l.statut] || l.statut }}</span></td>
              <td class="num">{{ l.statut === 'paye' ? formatMoney(l.montantPaye) : formatMoney(l.montantEstime) + ' (estimé)' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'
import { formatKg, formatMoney, formatDate } from '../../utils/helpers.js'

const auth = useAuthStore()
const root = useRootStore()
const STATUTS = { annonce: 'Annoncé', recu: 'Reçu', paye: 'Payé' }
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))

// Identifiant du collecteur connecté
const me = computed(() => auth.profile?.collecteurId || auth.profile?.id)

const rows = computed(() =>
  (root.lots.list || [])
    .filter((l) => l.collecteurId === me.value)
    .sort((a, b) => String(b.datePrevue).localeCompare(String(a.datePrevue)))
)

const totalKg = computed(() => rows.value.filter((l) => l.statut !== 'annonce').reduce((s, l) => s + (l.poidsReel || 0), 0))
const totalGagne = computed(() => rows.value.filter((l) => l.statut === 'paye').reduce((s, l) => s + (l.montantPaye || 0), 0))
</script>

<style scoped>
.totals { display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
@media (min-width: 640px) { .totals { grid-template-columns: repeat(3, 1fr); } }
.num { text-align: right; font-variant-numeric: tabular-nums; }
</style>