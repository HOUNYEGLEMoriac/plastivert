<template>
  <SelectField v-bind="$props">
    <select
      :id="id"
      v-model="localValue"
      class="select"
      :class="{ error: error }"
      @change="handleChange"
    >
      <option value="">-- Sélectionner --</option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
  </SelectField>
</template>

<script setup>
import SelectField from './FormField.vue'
import { ref, watch } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  id: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: '' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const localValue = ref(props.modelValue)

const handleChange = (e) => {
  localValue.value = e.target.value
  emit('update:modelValue', localValue.value)
  emit('change', localValue.value)
}

watch(() => props.modelValue, (val) => {
  localValue.value = val
})
</script>
