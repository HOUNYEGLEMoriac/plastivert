<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Centre de recyclage</p>
      <h1>Tableau de bord</h1>
      <p>Suivez la réception, les paiements et le stock de votre centre.</p>
    </header>

    <div class="kpis">
      <div class="pv-kpi"><span class="pv-kpi-label">Lots reçus</span><span class="pv-kpi-value">{{ stats.recus }}</span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Plastique reçu</span><span class="pv-kpi-value">{{ fmt(stats.kgs) }}<small>kg</small></span></div>
      <div class="pv-kpi"><span class="pv-kpi-label">Lots payés</span><span class="pv-kpi-value">{{ stats.payes }}</span></div>
    </div>

    <div class="cols">
      <section class="pv-card">
        <h2>Lots reçus par mois</h2>
        <p v-if="!stats.mois.length" class="pv-muted">Pas encore de lot reçu.</p>
        <div v-else class="bars">
          <div v-for="m in stats.mois" :key="m.k" class="bar">
            <span>{{ m.label }}</span>
            <span class="track"><i :style="{ width: m.w + '%' }"></i></span>
            <b>{{ m.v }}</b>
          </div>
        </div>
      </section>

      <section class="pv-card">
        <h2>Stock reçu par type</h2>
        <p v-if="!stats.types.length" class="pv-muted">Pas encore de stock.</p>
        <div v-else class="bars">
          <div v-for="t in stats.types" :key="t.k" class="bar">
            <span>{{ t.k }}</span>
            <span class="track"><i :style="{ width: t.w + '%' }"></i></span>
            <b>{{ fmt(t.v) }} kg</b>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'

const auth = useAuthStore()
const root = useRootStore()
const fmt = (v) => new Intl.NumberFormat('fr-FR').format(Math.round(Number(v) || 0))

const bars = (obj, byKey) => {
  const e = Object.entries(obj).sort((a, b) => (byKey ? a[0].localeCompare(b[0]) : b[1] - a[1]))
  const max = Math.max(1, ...e.map((x) => x[1]))
  return e.map(([k, v]) => ({ k, v, w: Math.round((v / max) * 100) }))
}

const stats = computed(() => {
  const mine = (root.lots.list || []).filter((l) => l.centreId === auth.profile?.centreId)
  const recus = mine.filter((l) => l.statut === 'recu' || l.statut === 'paye')
  const mois = {}, types = {}
  let kgs = 0
  recus.forEach((l) => {
    const m = String(l.dateReception || '').slice(0, 7)
    if (m) mois[m] = (mois[m] || 0) + 1
    types[l.typePlastique] = (types[l.typePlastique] || 0) + (l.poidsReel || 0)
    kgs += l.poidsReel || 0
  })
  return {
    recus: recus.length,
    kgs,
    payes: recus.filter((l) => l.statut === 'paye').length,
    mois: bars(mois, true).map((r) => ({ ...r, label: new Date(r.k + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }) })),
    types: bars(types, false)
  }
})
</script>

<style scoped>
.kpis { display: grid; grid-template-columns: 1fr; gap: var(--space-4); margin-bottom: var(--space-4); }
@media (min-width: 640px) { .kpis { grid-template-columns: repeat(3, 1fr); } }
.cols { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 900px) { .cols { grid-template-columns: 1fr 1fr; align-items: start; } }
.pv-card h2 { margin-bottom: var(--space-4); }
.bars { display: grid; gap: var(--space-3); }
.bar { display: grid; grid-template-columns: 90px 1fr 56px; align-items: center; gap: var(--space-3); font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.track { display: block; background: #EEF2F6; border-radius: 5px; }
.track i { display: block; height: 10px; border-radius: 5px; background: var(--color-primary); }
.bar b { text-align: right; font-weight: var(--font-weight-medium); color: var(--color-text); font-variant-numeric: tabular-nums; white-space: nowrap; }
</style>