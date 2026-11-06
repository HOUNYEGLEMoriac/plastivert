<template>
  <FormField
    :label="label"
    :help="help"
    :error="error"
    :id="id"
  >
    <textarea
      :id="id"
      v-model="localValue"
      class="textarea"
      :class="{ error: error }"
      rows="4"
      @input="handleInput"
    />
  </FormField>
</template>

<script setup>
import FormField from './FormField.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)

const handleInput = (e) => {
  localValue.value = e.target.value
  emit('update:modelValue', localValue.value)
}

watch(() => props.modelValue, (val) => {
  localValue.value = val
})
</script>
