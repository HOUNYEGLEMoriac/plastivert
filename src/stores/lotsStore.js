import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:lots'

export const useLotsStore = defineStore('lots', () => {
  const list = ref([])
  const loading = ref(false)

  const byId = computed(() => {
    const map = {}
    list.value.forEach((l) => { map[l.id] = l })
    return map
  })

  const byCollecteur = computed(() => (id) =>
    list.value.filter((l) => l.collecteurId === id)
  )

  const byCentre = computed(() => (id) =>
    list.value.filter((l) => l.centreId === id)
  )

  const stats = computed(() => {
    const byMonth = {}
    let totalKg = 0
    let totalPaye = 0
    list.value.forEach((l) => {
      const month = l.dateReception ? l.dateReception.slice(0, 7) : 'non-reçu'
      byMonth[month] = (byMonth[month] || 0) + 1
      if (l.statut === 'paye') {
        totalKg += l.poidsReel || 0
        totalPaye += l.montantPaye || 0
      } else if (l.statut === 'recu') {
        totalKg += l.poidsReel || 0
      }
    })
    return { byMonth, totalKg, totalPaye }
  })

  async function load() {
    loading.value = true
    try {
      const data = await getAll('lots')
      const saved = loadState()[STORAGE_KEY] || []
      const merged = data.map((l) => {
        const existing = saved.find((s) => s.id === l.id)
        return existing ? { ...l, ...existing } : { ...l }
      })
      list.value = merged
      persist()
    } catch (err) {
      console.error('Impossible de charger les lots', err)
      list.value = await getAll('lots')
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
    return list.value.find((l) => l.id === id)
  }

  function add(lot) {
    lot.id = `l${list.value.length + 1}`
    list.value.push(lot)
    persist()
  }

  function update(lot) {
    const idx = list.value.findIndex((l) => l.id === lot.id)
    if (idx >= 0) {
      list.value[idx] = { ...list.value[idx], ...lot }
      persist()
    }
  }

  function remove(id) {
    list.value = list.value.filter((l) => l.id !== id)
    persist()
  }

  return {
    list,
    byId,
    loading,
    stats,
    byCollecteur,
    byCentre,
    load,
    getById,
    add,
    update,
    remove
  }
})
