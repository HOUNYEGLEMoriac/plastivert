<template>
  <div class="empty">
    <component :is="icon" v-if="icon" aria-hidden="true" />
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <button
      v-if="actionLabel"
      class="btn primary"
      @click="onAction"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  icon: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  onAction: { type: Function, default: () => {} }
})

const IconComponent = computed(() => {
  if (!props.icon) return null
  try {
    return defineAsyncComponent(() => import(`../icons/${props.icon}.vue`))
  } catch {
    return null
  }
})
</script>
