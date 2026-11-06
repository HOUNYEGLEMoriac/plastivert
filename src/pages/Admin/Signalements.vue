<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Administration</p>
      <h1>Signalements de dépôts sauvages</h1>
      <p>Vérifiez et traitez chaque signalement.</p>
    </header>

    <div class="tabs" role="tablist">
      <button
        v-for="t in TABS"
        :key="t.key"
        type="button"
        role="tab"
        class="pv-chip"
        :class="{ active: activeTab === t.key }"
        :aria-selected="activeTab === t.key"
        @click="activeTab = t.key"
      >
        {{ t.label }} <span class="count">{{ count(t.key) }}</span>
      </button>
    </div>

    <p v-if="!visible.length" class="pv-card pv-muted">Aucun signalement dans cette catégorie.</p>

    <article v-for="s in visible" :key="s.id" class="pv-card report">
      <div class="report-main">
        <h3>{{ s.quartier || 'Quartier non précisé' }}</h3>
        <p>{{ s.description || 'Sans description.' }}</p>
        <p class="pv-muted">{{ s.date ? formatDate(s.date) : '' }}</p>
        <a
          v-if="s.latitude != null && s.longitude != null"
          class="pv-muted link"
          target="_blank"
          rel="noopener"
          :href="`https://www.openstreetmap.org/?mlat=${s.latitude}&mlon=${s.longitude}#map=17/${s.latitude}/${s.longitude}`"
        >Voir la position sur la carte</a>
        <img v-if="s.photo" :src="s.photo" alt="Photo du signalement" class="photo" />
      </div>
      <div class="report-actions">
        <button v-if="s.statut !== 'en_cours'" type="button" class="pv-btn pv-btn-secondary pv-sm" @click="setStatut(s, 'en_cours')">En cours</button>
        <button v-if="s.statut !== 'traite'" type="button" class="pv-btn pv-btn-primary pv-sm" @click="setStatut(s, 'traite')">Marquer traité</button>
        <button v-if="s.statut !== 'refuse'" type="button" class="pv-btn pv-btn-secondary pv-sm" @click="setStatut(s, 'refuse')">Refuser</button>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRootStore } from '../../stores/index.js'
import { formatDate } from '../../utils/helpers.js'

const root = useRootStore()
const TABS = [
  { key: 'nouveau', label: 'Nouveaux' },
  { key: 'en_cours', label: 'En cours' },
  { key: 'traite', label: 'Traités' },
  { key: 'refuse', label: 'Refusés' }
]
const activeTab = ref('nouveau')

const all = computed(() => root.signalements.list || [])
const count = (key) => all.value.filter((s) => s.statut === key).length
const visible = computed(() => all.value.filter((s) => s.statut === activeTab.value))

// Le store fusionne l'objet par identifiant et sauvegarde
function setStatut(s, statut) {
  root.signalements.update({ ...s, statut })
}
</script>

<style scoped>
.tabs { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }
.count { margin-left: var(--space-1); font-size: var(--font-size-xs); color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
.report { display: flex; flex-direction: column; gap: var(--space-4); }
@media (min-width: 768px) { .report { flex-direction: row; justify-content: space-between; align-items: flex-start; } }
.report h3 { margin: 0 0 var(--space-1); font-size: var(--font-size-base); color: var(--color-text); }
.report p { margin: 0 0 var(--space-1); }
.report-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.link { display: inline-block; margin-bottom: var(--space-2); }
.photo { display: block; max-width: 320px; width: 100%; margin-top: var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); }
</style>