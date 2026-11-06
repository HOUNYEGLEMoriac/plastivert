import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAll, getById, saveAll } from '../services/dataService'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:users'

export const useUsersStore = defineStore('users', () => {
  const list = ref([])
  const loading = ref(false)

  const actifs = computed(() => list.value.filter((u) => u.actif))

  async function load() {
    loading.value = true
    try {
      const data = await getAll('users')
      const saved = loadState()[STORAGE_KEY] || []
      const merged = data.map((u) => {
        const existing = saved.find((s) => s.id === u.id)
        return existing ? { ...u, ...existing } : { ...u }
      })
      list.value = merged
      persist()
    } catch (err) {
      console.error('Impossible de charger les utilisateurs', err)
      list.value = await getAll('users')
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
    return list.value.find((u) => u.id === id)
  }

  function update(user) {
    const idx = list.value.findIndex((u) => u.id === user.id)
    if (idx >= 0) {
      list.value[idx] = { ...list.value[idx], ...user }
      persist()
    }
  }

  function toggleActive(id, actif) {
    const idx = list.value.findIndex((u) => u.id === id)
    if (idx >= 0) {
      list.value[idx].actif = actif
      persist()
    }
  }

  return {
    list,
    loading,
    actifs,
    load,
    getById,
    update,
    toggleActive
  }
})
