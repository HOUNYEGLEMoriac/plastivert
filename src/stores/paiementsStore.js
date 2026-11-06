import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:paiements'

export const usePaiementsStore = defineStore('paiements', () => {
  const list = ref([])
  const loading = ref(false)

  const byLot = computed(() => (id) => list.value.filter((p) => p.lotId === id))

  const stats = computed(() => {
    const total = list.value.reduce((acc, p) => acc + (p.montant || 0), 0)
    const byMonth = {}
    list.value.forEach((p) => {
      const month = p.date ? p.date.slice(0, 7) : 'non-date'
      byMonth[month] = (byMonth[month] || 0) + 1
    })
    return { total, byMonth }
  })

  async function load() {
    loading.value = true
    try {
      const data = await getAll('paiements')
      const saved = loadState()[STORAGE_KEY] || []
      list.value = data.map((p) => {
        const existing = saved.find((s) => s.id === p.id)
        return existing ? { ...p, ...existing } : { ...p }
      })
      persist()
    } catch (err) {
      console.error('Impossible de charger les paiements', err)
      list.value = await getAll('paiements')
    } finally {
      loading.value = false
    }
  }

  function persist() {
    const state = loadState()
    state[STORAGE_KEY] = list.value
    saveState(state)
  }

  function getByLot(lotId) {
    return list.value.filter((p) => p.lotId === lotId)
  }

  function add(payment) {
    payment.id = `p${list.value.length + 1}`
    list.value.push(payment)
    persist()
  }

  function remove(id) {
    list.value = list.value.filter((p) => p.id !== id)
    persist()
  }

  return {
    list,
    loading,
    byLot,
    stats,
    load,
    getByLot,
    add,
    remove
  }
})
