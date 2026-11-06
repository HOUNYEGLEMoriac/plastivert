<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Centre de recyclage</p>
      <h1>Lots reçus</h1>
      <p>Lots annoncés et reçus pour votre centre.</p>
    </header>

    <section class="pv-card">
      <div class="pv-card-head">
        <h2>{{ rows.length }} lot{{ rows.length > 1 ? 's' : '' }}</h2>
        <RouterLink to="/centre/dashboard" class="pv-btn pv-btn-secondary pv-sm">Tableau de bord</RouterLink>
      </div>

      <p v-if="!rows.length" class="pv-muted">Aucun lot pour le moment.</p>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Collecteur</th>
              <th>Plastique</th>
              <th class="num">Poids estimé</th>
              <th class="num">Poids réel</th>
              <th>Prévu le</th>
              <th>Reçu le</th>
              <th>Statut</th>
              <th class="num">Montant versé</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in rows" :key="l.id">
              <td>{{ nomCollecteur(l.collecteurId) }}</td>
              <td>{{ l.typePlastique }}</td>
              <td class="num">{{ formatKg(l.poidsEstime) }}</td>
              <td class="num">{{ l.poidsReel ? formatKg(l.poidsReel) : '—' }}</td>
              <td>{{ formatDate(l.datePrevue) }}</td>
              <td>{{ l.dateReception ? formatDate(l.dateReception) : '—' }}</td>
              <td><span class="badge" :class="l.statut"><span class="dot"></span>{{ STATUTS[l.statut] || l.statut }}</span></td>
              <td class="num">{{ l.montantPaye ? formatMoney(l.montantPaye) : '—' }}</td>
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

// Lots du centre connecté, du plus récent au plus ancien
const rows = computed(() => {
  const id = auth.profile?.centreId
  return (root.lots.list || [])
    .filter((l) => l.centreId === id)
    .sort((a, b) => String(b.dateReception || b.datePrevue).localeCompare(String(a.dateReception || a.datePrevue)))
})

const nomCollecteur = (id) => (root.collecteurs.list || []).find((c) => c.id === id)?.nom || id
</script>

<style scoped>
.num { text-align: right; font-variant-numeric: tabular-nums; }
</style>