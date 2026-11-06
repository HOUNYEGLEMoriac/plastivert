import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:centres'

export const useCentresStore = defineStore('centres', () => {
  const list = ref([])
  const loading = ref(false)

  const byId = computed(() => {
    const map = {}
    list.value.forEach((c) => { map[c.id] = c })
    return map
  })

  const valides = computed(() => list.value.filter((c) => c.statut === 'valide' && c.actif))

  const enAttente = computed(() => list.value.filter((c) => c.statut === 'en_attente' || c.statut === 'en_attente'))

  async function load() {
    loading.value = true
    try {
      const data = await getAll('centres')
      const saved = loadState()[STORAGE_KEY] || []
      const merged = data.map((c) => {
        const existing = saved.find((s) => s.id === c.id)
        return existing ? { ...c, ...existing, id: c.id } : { ...c }
      })
      list.value = merged
      persist()
    } catch (err) {
      console.error('Impossible de charger les centres', err)
      list.value = await getAll('centres')
    } finally {
      loading.value = false
    }
  }

  function persist() {
    const state = loadState()
    state[STORAGE_KEY] = list.value
    saveState(state)
  }

  function getActive() {
    return list.value.filter((c) => c.actif)
  }

  function getValides() {
    return list.value.filter((c) => c.statut === 'valide')
  }

  function update(centre) {
    const idx = list.value.findIndex((c) => c.id === centre.id)
    if (idx >= 0) {
      list.value[idx] = { ...list.value[idx], ...centre }
      persist()
    }
  }

  async function add(centre) {
    const next = await getAll('centres')
    centre.id = `c${next.length + 1}`
    list.value.push(centre)
    persist()
  }

  function remove(id) {
    list.value = list.value.filter((c) => c.id !== id)
    persist()
  }

  return {
    list,
    byId,
    loading,
    valides,
    enAttente,
    load,
    getActive,
    getValides,
    update,
    add,
    remove
  }
})
