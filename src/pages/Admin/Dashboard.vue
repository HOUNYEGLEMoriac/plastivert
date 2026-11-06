<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Administration</p>
      <h1>Tableau de bord</h1>
      <p>Suivez l’impact de Plastivert à Abomey-Calavi.</p>
    </header>

    <div class="kpis">
      <div v-for="k in kpis" :key="k.label" class="pv-kpi">
        <span class="pv-kpi-label">{{ k.label }}</span>
        <span class="pv-kpi-value">{{ fmt(k.value) }}<small v-if="k.unit">{{ k.unit }}</small></span>
      </div>
    </div>

    <div class="cols">
      <section v-for="c in charts" :key="c.title" class="pv-card">
        <h2>{{ c.title }}</h2>
        <p v-if="!c.rows.length" class="pv-muted">Pas encore de données.</p>
        <div v-else class="bars">
          <div v-for="r in c.rows" :key="r.k" class="bar">
            <span>{{ r.k }}</span>
            <span class="track"><i :style="{ width: r.w + '%' }"></i></span>
            <b>{{ r.v }}</b>
          </div>
        </div>
      </section>

      <section class="pv-card">
        <h2>Dernières activités</h2>
        <p v-if="!recent.length" class="pv-muted">Aucune activité.</p>
        <ul v-else class="recent">
          <li v-for="l in recent" :key="l.id">
            <div>
              <strong>{{ l.typePlastique }}</strong>
              <span class="pv-muted">{{ nomCollecteur(l.collecteurId) }} · {{ formatDate(l.dateReception || l.datePrevue) }}</span>
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
import { useRootStore } from '../../stores/index.js'
import { formatDate } from '../../utils/helpers.js'

const root = useRootStore()
const STATUTS = { annonce: 'Annoncé', recu: 'Reçu', paye: 'Payé' }
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))
const lots = computed(() => root.lots.list || [])

const kpis = computed(() => [
  { label: 'Plastique collecté', value: root.stats?.collected, unit: 'kg' },
  { label: 'Argent versé', value: root.stats?.paye, unit: 'FCFA' },
  { label: 'Collecteurs actifs', value: root.stats?.collecteursActifs },
  { label: 'Centres actifs', value: root.stats?.centresActifs }
])

// Transforme { clé: valeur } en lignes de barres proportionnelles
const toBars = (obj, sortByKey = false) => {
  const e = Object.entries(obj).sort((a, b) => (sortByKey ? a[0].localeCompare(b[0]) : b[1] - a[1]))
  const max = Math.max(1, ...e.map((x) => x[1]))
  return e.map(([k, v]) => ({ k, v, w: Math.round((v / max) * 100) }))
}
const monthLabel = (key) => new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })

const charts = computed(() => {
  const mois = {}, types = {}, quartiers = {}
  lots.value.forEach((l) => {
    const m = String(l.dateReception || l.datePrevue || '').slice(0, 7)
    if (m) mois[monthLabelKey(m)] = (mois[monthLabelKey(m)] || 0) + 1
    types[l.typePlastique] = (types[l.typePlastique] || 0) + 1
  })
  ;(root.centres.valides || []).forEach((c) => { quartiers[c.quartier] = (quartiers[c.quartier] || 0) + 1 })
  const moisBars = toBars(mois, true).map((r) => ({ ...r, k: monthLabel(r.k) }))
  return [
    { title: 'Lots par mois', rows: moisBars },
    { title: 'Lots par type de plastique', rows: toBars(types) },
    { title: 'Centres par quartier', rows: toBars(quartiers) }
  ]
})
const monthLabelKey = (m) => m

const recent = computed(() =>
  [...lots.value]
    .sort((a, b) => String(b.dateReception || b.datePrevue).localeCompare(String(a.dateReception || a.datePrevue)))
    .slice(0, 6)
)
const nomCollecteur = (id) => (root.collecteurs.list || []).find((c) => c.id === id)?.nom || id
</script>

<style scoped>
.kpis { display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
@media (min-width: 640px) { .kpis { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .kpis { grid-template-columns: repeat(4, 1fr); } }
.cols { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 900px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.pv-card h2 { margin-bottom: var(--space-4); }
.bars { display: grid; gap: var(--space-3); }
.bar { display: grid; grid-template-columns: 110px 1fr 32px; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.track { display: block; background: #EEF2F6; border-radius: 5px; }
.track i { display: block; height: 10px; border-radius: 5px; background: var(--color-primary); }
.bar b { text-align: right; font-weight: var(--font-weight-medium); color: var(--color-text); font-variant-numeric: tabular-nums; }
.recent { list-style: none; margin: 0; padding: 0; }
.recent li { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.recent li:last-child { border-bottom: 0; }
.recent li > div { display: flex; flex-direction: column; gap: 2px; }
</style>