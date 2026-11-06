<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Administration</p>
      <h1>Gestion des centres</h1>
      <p>Validez, refusez ou désactivez les centres de recyclage.</p>
    </header>

    <section class="pv-card">
      <h2>En attente de validation ({{ pending.length }})</h2>
      <p v-if="!pending.length" class="pv-muted">Aucun centre en attente.</p>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Centre</th><th>Quartier</th><th>Plastiques</th><th>Inscrit le</th><th></th></tr></thead>
          <tbody>
            <tr v-for="c in pending" :key="c.id">
              <td>{{ c.nom }}<br /><span class="pv-muted">{{ c.adresse }}</span></td>
              <td>{{ c.quartier }}</td>
              <td>{{ (c.plastiquesAcceptes || []).join(', ') }}</td>
              <td>{{ c.dateInscription ? formatDate(c.dateInscription) : '—' }}</td>
              <td class="actions">
                <button type="button" class="pv-btn pv-btn-primary pv-sm" @click="setStatut(c, 'valide', true)">Valider</button>
                <button type="button" class="pv-btn pv-btn-secondary pv-sm" @click="setStatut(c, 'refuse', false)">Refuser</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="pv-card">
      <h2>Centres validés ({{ valides.length }})</h2>
      <p v-if="!valides.length" class="pv-muted">Aucun centre validé.</p>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Centre</th><th>Quartier</th><th>Prix au kilo</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            <tr v-for="c in valides" :key="c.id">
              <td>{{ c.nom }}<br /><span class="pv-muted">{{ c.adresse }}</span></td>
              <td>{{ c.quartier }}</td>
              <td>{{ prix(c) }}</td>
              <td><span class="badge" :class="c.actif ? 'valide' : 'en_attente'"><span class="dot"></span>{{ c.actif ? 'Actif' : 'Inactif' }}</span></td>
              <td class="actions">
                <button type="button" class="pv-btn pv-btn-secondary pv-sm" @click="setStatut(c, 'valide', !c.actif)">{{ c.actif ? 'Désactiver' : 'Activer' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRootStore } from '../../stores/index.js'
import { formatDate } from '../../utils/helpers.js'

const root = useRootStore()
const all = computed(() => root.centres.list || [])
const pending = computed(() => all.value.filter((c) => c.statut === 'en_attente'))
const valides = computed(() => all.value.filter((c) => c.statut === 'valide'))

const prix = (c) => Object.entries(c.prix || {}).map(([t, p]) => `${t} ${p}`).join(' · ') || '—'

// Le store fusionne par identifiant et sauvegarde
function setStatut(c, statut, actif) {
  root.centres.update({ ...c, statut, actif })
}
</script>

<style scoped>
.pv-card { margin-bottom: var(--space-4); }
.pv-card h2 { margin-bottom: var(--space-4); }
.actions { display: flex; gap: var(--space-2); justify-content: flex-end; white-space: nowrap; }
</style>