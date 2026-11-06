<template>
  <div class="dropdown">
    <button class="btn secondary" @click="toggle">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 9l6 6 6-6" /></svg>
      <slot name="trigger" />
    </button>
    <Transition name="fade">
      <div v-if="open" class="dropdown-menu">
        <button
          v-for="item in items"
          :key="item.value"
          class="dropdown-item"
          @click="select(item.value)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: '' }
})

const emit = defineEmits(['update:modelValue', 'select'])

const open = ref(false)

const toggle = () => { open.value = !open.value }

const select = (value) => {
  emit('update:modelValue', value)
  emit('select', value)
  open.value = false
}

watch(() => props.modelValue, (val) => { if (open.value) open.value = false })
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 150ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
