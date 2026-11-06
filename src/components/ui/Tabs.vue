<template>
  <div class="tabs" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab"
      :class="{ active: active === tab.value }"
      @click="active = tab.value"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { watch } from "vue"
import { ref } from 'vue'

const props = defineProps({
  tabs: { type: Array, required: true, default: () => [] },
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const active = ref(props.modelValue || props.tabs[0]?.value || '')

watch(() => props.modelValue, (val) => { active.value = val })
</script>
