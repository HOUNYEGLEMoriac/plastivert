<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Collecteur</p>
      <h1>Mon espace collecteur</h1>
      <p>Retrouvez les centres proches et annoncez vos lots.</p>
    </header>

    <section class="pv-card pv-welcome">
      <div>
        <h2>Bienvenue, {{ auth.profile?.nom || 'collecteur' }}</h2>
        <p>Annoncez un lot, suivez son avancement et consultez ce que vous avez gagné.</p>
      </div>
      <div class="pv-actions">
        <RouterLink to="/collecteur/annonce" class="pv-btn pv-btn-primary">Annoncer un lot</RouterLink>
        <RouterLink to="/collecteur/lots" class="pv-btn pv-btn-secondary">Voir mes lots</RouterLink>
      </div>
    </section>

    <section class="pv-card">
      <div class="pv-card-head">
        <h2>{{ userPos ? 'Centres les plus proches' : 'Centres de recyclage' }}</h2>
        <button v-if="!userPos" type="button" class="pv-btn pv-btn-secondary pv-sm" @click="locate">Me localiser</button>
      </div>
      <p v-if="geoMessage" class="pv-note" role="status">{{ geoMessage }}</p>

      <p v-if="!rows.length" class="pv-muted">Aucun centre disponible pour le moment.</p>

      <div class="pv-list-plain">
        <article v-for="c in rows" :key="c.id" class="pv-centre">
          <div class="pv-centre-head">
            <h3>{{ c.nom }}</h3>
            <span v-if="c.distance !== null" class="pv-dist">{{ formatKm(c.distance) }}</span>
          </div>
          <p class="pv-muted">{{ c.quartier }} · {{ c.horaires }}</p>
          <ul class="pv-prices">
            <li v-for="t in c.plastiquesAcceptes" :key="t"><span>{{ t }}</span><strong>{{ c.prix[t] }} FCFA/kg</strong></li>
          </ul>
          <div class="pv-centre-actions">
            <a class="pv-btn pv-btn-secondary pv-sm" target="_blank" rel="noopener" :href="route(c)">Itinéraire</a>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'

const auth = useAuthStore()
const root = useRootStore()
const userPos = ref(null)
const geoMessage = ref('')

function distanceKm(lat1, lon1, lat2, lon2) {
  const rad = (d) => (d * Math.PI) / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
const formatKm = (d) => d.toFixed(1).replace('.', ',') + ' km'
const route = (c) => `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`

const rows = computed(() => {
  const list = (root.centres.valides || []).map((c) => ({
    ...c,
    distance: userPos.value ? distanceKm(userPos.value.lat, userPos.value.lng, c.latitude, c.longitude) : null
  }))
  return list.sort((a, b) => (a.distance !== null ? a.distance - b.distance : a.nom.localeCompare(b.nom)))
})

function locate() {
  if (!navigator.geolocation) {
    geoMessage.value = 'La géolocalisation n’est pas disponible sur cet appareil.'
    return
  }
  geoMessage.value = 'Recherche de votre position…'
  navigator.geolocation.getCurrentPosition(
    (pos) => { userPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }; geoMessage.value = '' },
    () => { geoMessage.value = 'Position indisponible. Autorisez la géolocalisation pour trier par distance.' },
    { timeout: 10000 }
  )
}
</script>