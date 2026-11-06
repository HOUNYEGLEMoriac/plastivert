<template>
  <div class="leaflet-custom-marker" :style="style">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" fill="white" />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
})

const style = computed(() => ({
  left: `${props.longitude}px`,
  top: `${props.latitude}px`,
  transform: 'rotate(0deg)'
}))
</script>

<style>
.leaflet-custom-marker {
  position: absolute;
  width: 32px;
  height: 32px;
  text-align: center;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  z-index: 1000;
  pointer-events: none;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
}
.leaflet-custom-marker svg {
  margin-top: 4px;
}
</style>
