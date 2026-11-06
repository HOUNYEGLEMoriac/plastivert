<template>
  <div class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :class="['sortable', { active: sortKey === column.key }]"
            @click="toggleSort(column.key)"
          >
            {{ column.label }}
            <span v-if="sortKey === column.key" class="sort-icon">▼</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="getItemId(item)">
          <td
            v-for="column in columns"
            :key="column.key"
            :data-label="column.label"
          >
            <template v-if="column.format">
              {{ column.format(item[column.key]) }}
            </template>
            <template v-else>
              {{ item[column.key] }}
            </template>
          </td>
        </tr>
        <tr v-if="isEmpty">
          <td :colspan="columns.length">
            <Empty
              title="Aucun élément"
              message="Aucun enregistrement correspondant."
              icon="PlaceholderIcon"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Empty from './Empty.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  getItemKey: { type: Function, default: (item) => item.id }
})

const sortKey = ref(props.columns[0]?.key || '')
const sortOrder = ref('asc')

const sortableData = computed(() => {
  const list = [...props.data]
  if (!sortKey.value) return list
  list.sort((a, b) => {
    let va = a[sortKey.value]
    let vb = b[sortKey.value]
    if (typeof va === 'string') va = va.localeCompare(vb, 'fr')
    else va = Number(va); vb = Number(vb)
    return sortOrder.value === 'asc' ? va - vb : vb - va
  })
  return list
})

const isEmpty = computed(() => props.data.length === 0)

function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function getItemId(item) {
  return props.getItemKey ? props.getItemKey(item) : item.id
}
</script>

<style scoped>
.sort-icon { font-size: 10px; color: var(--color-text-muted); margin-left: 2px; }
.sortable.active .sort-icon { color: var(--color-primary); }
</style>
