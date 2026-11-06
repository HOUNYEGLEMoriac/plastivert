import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:signalements'

export const useSignalementsStore = defineStore('signalements', () => {
  const list = ref([])
  const loading = ref(false)

  const statuts = ['nouveau', 'en_cours', 'traite', 'refuse']

  const byStatut = computed(() => (s) => list.value.filter((x) => x.statut === s))

  async function load() {
    loading.value = true
    try {
      const data = await getAll('signalements')
      const saved = loadState()[STORAGE_KEY] || []
      list.value = data.map((s) => {
        const existing = saved.find((x) => x.id === s.id)
        return existing ? { ...s, ...existing } : { ...s }
      })
      persist()
    } catch (err) {
      console.error('Impossible de charger les signalements', err)
      list.value = await getAll('signalements')
    } finally {
      loading.value = false
    }
  }

  function persist() {
    const state = loadState()
    state[STORAGE_KEY] = list.value
    saveState(state)
  }

  function update(signalement) {
    const idx = list.value.findIndex((s) => s.id === signalement.id)
    if (idx >= 0) {
      list.value[idx] = { ...list.value[idx], ...signalement }
      persist()
    }
  }

  async function add(signalement) {
    const next = await getAll('signalements')
    signalement.id = `s${next.length + 1}`
    signalement.statut = 'nouveau'
    list.value.push(signalement)
    persist()
  }

  return {
    list,
    loading,
    statuts,
    byStatut,
    load,
    update,
    add
  }
})
