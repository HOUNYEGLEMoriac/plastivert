import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:collecteurs'

export const useCollecteursStore = defineStore('collecteurs', () => {
  const list = ref([])
  const loading = ref(false)

  const byId = computed(() => {
    const map = {}
    list.value.forEach((c) => { map[c.id] = c })
    return map
  })

  const actifs = computed(() => list.value.filter((c) => c.actif))

  async function load() {
    loading.value = true
    try {
      const data = await getAll('collecteurs')
      const saved = loadState()[STORAGE_KEY] || []
      list.value = data.map((c) => {
        const existing = saved.find((s) => s.id === c.id)
        return existing ? { ...c, ...existing } : { ...c }
      })
      persist()
    } catch (err) {
      console.error('Impossible de charger les collecteurs', err)
      list.value = await getAll('collecteurs')
    } finally {
      loading.value = false
    }
  }

  function persist() {
    const state = loadState()
    state[STORAGE_KEY] = list.value
    saveState(state)
  }

  function getById(id) {
    return list.value.find((c) => c.id === id)
  }

  function update(collecteur) {
    const idx = list.value.findIndex((c) => c.id === collecteur.id)
    if (idx >= 0) {
      list.value[idx] = { ...list.value[idx], ...collecteur }
      persist()
    }
  }

  function toggleActive(id, actif) {
    const idx = list.value.findIndex((c) => c.id === id)
    if (idx >= 0) {
      list.value[idx].actif = actif
      persist()
    }
  }

  return {
    list,
    byId,
    loading,
    actifs,
    load,
    getById,
    update,
    toggleActive
  }
})
