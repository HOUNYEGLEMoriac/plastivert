<template>
  <TransitionGroup name="slide">
    <div v-if="toasts.length" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="`toast ${toast.type}`"
        role="alert"
      >
        <span :class="`dot ${toast.type}`" aria-hidden="true" />
        <span>{{ toast.message }}</span>
        <button class="close" @click="remove(toast.id)">×</button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '../stores/toastStore.js'

const toastStore = useToastStore()

const toasts = computed(() => toastStore.toasts)

const remove = (id) => {
  toastStore.remove(id)
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 150ms ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateX(20px); }
.toast-container { right: var(--space-4); top: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2); z-index: 1000; position: fixed; max-width: 360px; }
.toast { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); background: var(--color-surface); border: 1px solid var(--color-border); box-shadow: var(--shadow-md); min-width: 240px; max-width: 360px; font-size: var(--font-size-sm); position: relative; }
.toast.success { border-left: 3px solid var(--color-success); background: #f0fdf4; }
.toast.error { border-left: 3px solid var(--color-danger); background: #fef2f2; }
.toast.info { border-left: 3px solid var(--color-info); background: #eff6ff; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.toast.success .dot { background: var(--color-success); }
.toast.error .dot { background: var(--color-danger); }
.toast.info .dot { background: var(--color-info); }
.close { position: absolute; top: 4px; right: 4px; border: none; background: none; font-size: 18px; line-height: 1; cursor: pointer; color: var(--color-text-muted); }
.close:hover { color: var(--color-text); }
</style>
