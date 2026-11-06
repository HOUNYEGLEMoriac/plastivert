<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Administration</p>
      <h1>Gestion des comptes</h1>
      <p>Activez ou désactivez les comptes des utilisateurs.</p>
    </header>

    <section class="pv-card">
      <div class="pv-card-head">
        <h2>{{ rows.length }} compte{{ rows.length > 1 ? 's' : '' }}</h2>
        <div class="pv-chips" role="group" aria-label="Filtrer par rôle">
          <button type="button" class="pv-chip" :class="{ active: !role }" @click="role = ''">Tous</button>
          <button v-for="(label, key) in ROLES" :key="key" type="button" class="pv-chip" :class="{ active: role === key }" @click="role = key">{{ label }}</button>
        </div>
      </div>

      <p v-if="!rows.length" class="pv-muted">Aucun compte.</p>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Nom</th><th>Rôle</th><th>Email</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            <tr v-for="u in rows" :key="u.id">
              <td>{{ u.nom }}</td>
              <td>{{ ROLES[u.role] || u.role }}</td>
              <td>{{ u.email }}</td>
              <td><span class="badge" :class="u.actif ? 'valide' : 'refuse'"><span class="dot"></span>{{ u.actif ? 'Actif' : 'Désactivé' }}</span></td>
              <td class="actions">
                <button type="button" class="pv-btn pv-btn-secondary pv-sm" @click="toggle(u)">{{ u.actif ? 'Désactiver' : 'Activer' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRootStore } from '../../stores/index.js'

const root = useRootStore()
const ROLES = { collecteur: 'Collecteur', centre: 'Centre', admin: 'Administrateur' }
const role = ref('')

const rows = computed(() => (root.users.list || []).filter((u) => !role.value || u.role === role.value))

function toggle(u) {
  root.users.update({ ...u, actif: !u.actif })
}
</script>

<style scoped>
.pv-card-head { flex-wrap: wrap; }
.actions { text-align: right; white-space: nowrap; }
</style>