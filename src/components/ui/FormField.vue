<template>
  <div class="field" :class="{ 'has-error': error }">
    <label :for="id">{{ label }}</label>
    <div class="field-input">
      <slot :error="error" :value="modelValue" />
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="help" class="help">{{ help }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.value,
  set: (v) => emit('update:modelValue', v)
})
</script>

<style scoped>
.field-input { position: relative; }
.field-input :deep(input), .field-input :deep(textarea), .field-input :deep(select) {
  width: 100%;
}
</style>
