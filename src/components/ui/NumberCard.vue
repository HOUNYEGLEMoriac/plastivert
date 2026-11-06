<template>
  <div class="card kpi">
    <p class="kpi-label">{{ label }}</p>
    <p class="kpi-value">
      {{ format(value) }}
      <span class="kpi-unit">{{ unit }}</span>
    </p>
    <p v-if="delta" class="kpi-delta">{{ delta }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  delta: { type: String, default: '' },
  format: { type: Function, default: (v) => String(v) }
})
</script>
