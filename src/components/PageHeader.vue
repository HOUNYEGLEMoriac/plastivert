<template>
  <header class="page-header">
    <div class="breadcrumb">
      <template v-if="breadcrumb">
        <a v-for="(item, i) in breadcrumb" :key="item.title" @click="go(item.path)">
          {{ item.title }}
          <span v-if="i < breadcrumb.length - 1">/</span>
        </a>
      </template>
    </div>
    <h1>{{ title }}</h1>
    <p v-if="description" style="margin: var(--space-1) 0 0; color: var(--color-text-secondary); ">
      {{ description }}
    </p>
    <div class="actions">
      <slot />
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  breadcrumb: { type: Array, default: null },
  title: { type: String, default: '' },
  description: { type: String, default: '' }
})

const router = useRouter()

const go = (path) => {
  router.push(path)
}
</script>
