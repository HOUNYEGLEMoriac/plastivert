<template>
  <!-- Avec la prop "to", le bouton devient un vrai lien de navigation -->
  <RouterLink v-if="to" :to="to" class="btn" :class="classes">
    <slot />
  </RouterLink>
  <button
    v-else
    class="btn"
    :class="classes"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span class="spinner" v-if="loading" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  type: {
    type: String,
    default: 'secondary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'danger', 'success'].includes(v)
  },
  size: {
    type: String,
    default: 'm',
    validator: (v) => ['m', 'g'].includes(v)
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  to: { type: [String, Object], default: null }
})
defineEmits(['click'])

const classes = computed(() => [
  props.type || 'secondary',
  props.size || 'm',
  { 'btn-loading': props.loading, disabled: props.disabled || props.loading }
])
</script>

<style scoped>
.btn { text-decoration: none; }
.btn:hover { text-decoration: none; }
</style>