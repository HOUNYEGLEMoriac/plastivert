<template>
  <span class="badge" :class="status">
    <span class="dot" aria-hidden="true" />
    <span v-if="showLabel">{{ label }}</span>
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    validator: (v) => ['annonce','recu','paye','nouveau','en_cours','traite','valide','en_attente','refuse'].includes(v)
  },
  label: { type: String, default: '' },
  showLabel: { type: Boolean, default: true }
})
</script>
