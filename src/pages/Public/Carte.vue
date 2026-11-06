<template>
  <PublicLayout>
    <section class="pv-container pv-section">
      <h1 class="pv-h1">Carte des centres</h1>
      <p class="pv-lead">Géolocalisez les centres de recyclage autour d’Abomey-Calavi, Cotonou et Porto-Novo.</p>

      <div class="pv-toolbar">
        <div class="pv-chips" role="group" aria-label="Filtrer par type de plastique">
          <button type="button" class="pv-chip" :class="{ active: !filter }" @click="filter = ''">Tous</button>
          <button v-for="t in TYPES" :key="t" type="button" class="pv-chip" :class="{ active: filter === t }" @click="filter = t">{{ t }}</button>
        </div>
        <button type="button" class="pv-btn pv-btn-secondary" @click="locate">Me localiser</button>
      </div>
      <p v-if="geoMessage" class="pv-note" role="status">{{ geoMessage }}</p>

      <div class="pv-map-layout">
        <div ref="mapEl" class="pv-map" aria-label="Carte des centres"></div>

        <aside class="pv-list" aria-label="Liste des centres">
          <h2>{{ userPos ? 'Centres les plus proches' : 'Centres de recyclage' }}</h2>
          <p v-if="!rows.length" class="pv-muted">Aucun centre ne correspond à ce filtre.</p>

          <article v-for="c in rows" :key="c.id" class="pv-centre">
            <div class="pv-centre-head">
              <h3>{{ c.nom }}</h3>
              <span v-if="c.distance !== null" class="pv-dist">{{ formatKm(c.distance) }}</span>
            </div>
            <p class="pv-muted">{{ c.quartier }} · {{ c.adresse }}</p>
            <p class="pv-muted">{{ c.horaires }}</p>
            <ul class="pv-prices">
              <li v-for="(p, type) in c.prix" :key="type"><span>{{ type }}</span><strong>{{ p }} FCFA/kg</strong></li>
            </ul>
            <div class="pv-centre-actions">
              <button type="button" class="pv-btn pv-btn-secondary pv-sm" @click="focus(c)">Voir sur la carte</button>
              <a class="pv-btn pv-btn-secondary pv-sm" target="_blank" rel="noopener" :href="route(c)">Itinéraire</a>
              <a v-if="c.contact" class="pv-btn pv-btn-secondary pv-sm" :href="'tel:' + c.contact.replace(/\s/g, '')">Appeler</a>
            </div>
          </article>
        </aside>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import PublicLayout from '../../components/PublicLayout.vue'
import { useRootStore } from '../../stores/index.js'

const root = useRootStore()
const TYPES = ['PET', 'PEHD', 'SACHETS', 'PP']
const filter = ref('')
const userPos = ref(null)
const geoMessage = ref('')
const mapEl = ref(null)

// Objets Leaflet gardés hors de la réactivité Vue
let map = null
let layer = null
let userMarker = null
const markers = new Map()

// Distance en km entre deux points (formule de Haversine)
function distanceKm(lat1, lon1, lat2, lon2) {
  const rad = (d) => (d * Math.PI) / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
const formatKm = (d) => d.toFixed(1).replace('.', ',') + ' km'
const route = (c) => `https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`

// Centres validés et actifs, filtrés puis triés (distance si connue, sinon nom)
const rows = computed(() => {
  const list = (root.centres.valides || [])
    .filter((c) => !filter.value || (c.plastiquesAcceptes || []).includes(filter.value))
    .map((c) => ({
      ...c,
      distance: userPos.value ? distanceKm(userPos.value.lat, userPos.value.lng, c.latitude, c.longitude) : null
    }))
  return list.sort((a, b) => (a.distance !== null ? a.distance - b.distance : a.nom.localeCompare(b.nom)))
})

function drawMarkers() {
  if (!map) return
  layer.clearLayers()
  markers.clear()
  const icon = L.divIcon({ className: 'plv-marker', html: '<span></span>', iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] })
  rows.value.forEach((c) => {
    const prix = Object.entries(c.prix || {}).map(([t, p]) => `${t} : ${p} FCFA/kg`).join('<br>')
    const m = L.marker([c.latitude, c.longitude], { icon })
      .bindPopup(`<strong>${c.nom}</strong><br>${c.quartier}<br>${c.horaires}<br>${prix}`)
    m.addTo(layer)
    markers.set(c.id, m)
  })
}

function focus(c) {
  if (!map) return
  map.setView([c.latitude, c.longitude], 14)
  markers.get(c.id)?.openPopup()
  mapEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function locate() {
  if (!navigator.geolocation) {
    geoMessage.value = 'La géolocalisation n’est pas disponible sur cet appareil.'
    return
  }
  geoMessage.value = 'Recherche de votre position…'
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userPos.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      geoMessage.value = ''
      userMarker?.remove()
      userMarker = L.circleMarker([userPos.value.lat, userPos.value.lng], {
        radius: 8, color: '#fff', weight: 3, fillColor: '#1D4ED8', fillOpacity: 1
      }).addTo(map).bindPopup('Votre position')
      map.setView([userPos.value.lat, userPos.value.lng], 12)
    },
    (err) => {
      geoMessage.value = err.code === 1
        ? 'Accès à la position refusé. Autorisez-le dans votre navigateur pour trier par distance.'
        : 'Position indisponible pour le moment.'
    },
    { enableHighAccuracy: false, timeout: 10000 }
  )
}

onMounted(async () => {
  await nextTick()
  map = L.map(mapEl.value, { zoomControl: false }).setView([6.43, 2.38], 11)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
  }).addTo(map)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  layer = L.layerGroup().addTo(map)
  drawMarkers()
})

watch(rows, drawMarkers)
onBeforeUnmount(() => { map?.remove(); map = null })
</script>