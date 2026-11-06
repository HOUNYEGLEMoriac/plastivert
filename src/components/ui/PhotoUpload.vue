<template>
  <div class="photo-upload">
    <div
      class="photo-preview"
      :class="{ hidden: !preview || loading }"
      @click="triggerClick"
    >
      <img :src="preview" alt="Apercu" />
    </div>
    <label class="photo-input">
      <input
        ref="input"
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        @change="handleFile"
      />
      <span class="photo-text">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        {{ loading ? 'Chargement...' : 'Prendre une photo' }}
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Photo' }
})

const emit = defineEmits(['update:modelValue'])

const input = ref(null)
const preview = ref('')
const loading = ref(false)

const triggerClick = () => {
  input.value?.click()
}

const handleFile = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  loading.value = true
  const reader = new FileReader()
  reader.onload = () => {
    preview.value = reader.result
    emit('update:modelValue', reader.result)
    loading.value = false
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

defineExpose({ triggerClick })
</script>

<style scoped>
.photo-preview {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-2);
  cursor: pointer;
}
.photo-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}
.photo-preview.hidden { display: none; }
.photo-input {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-3);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
.photo-text { display: flex; align-items: center; gap: var(--space-2); }
</style>
