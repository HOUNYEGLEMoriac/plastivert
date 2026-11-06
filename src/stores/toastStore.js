import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'plastivert:toasts'

export const useToastStore = defineStore('toasts', () => {
  const toasts = ref([])
  const isVisible = ref(false)

  function add(type, message) {
    const id = `toast-${Date.now()}`
    toasts.value.push({ id, type, message })
    isVisible.value = true
  }

  function remove(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
    if (toasts.value.length === 0) {
      isVisible.value = false
    }
  }

  function clear() {
    toasts.value = []
    isVisible.value = false
  }

  return { toasts, isVisible, add, remove, clear }
})
