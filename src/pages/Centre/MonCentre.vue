<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Centre de recyclage</p>
      <h1>Modifier la fiche de mon centre</h1>
      <p>Horaires, plastiques acceptés et prix au kilo.</p>
    </header>

    <p v-if="!monCentre" class="pv-card pv-muted">Aucun centre associé à ce compte.</p>

    <form v-else class="grid2" novalidate @submit.prevent="submit">
      <section class="pv-card">
        <h2>Informations générales</h2>
        <div v-for="f in FIELDS" :key="f.key" class="field">
          <label :for="f.key">{{ f.label }}</label>
          <input :id="f.key" v-model="form[f.key]" type="text" :aria-invalid="!!errors[f.key]" />
          <p v-if="errors[f.key]" class="err" role="alert">{{ errors[f.key] }}</p>
        </div>
      </section>

      <section class="pv-card">
        <h2>Plastiques acceptés et prix</h2>
        <div v-for="t in TYPES" :key="t.id" class="type">
          <label class="check">
            <input v-model="accepted[t.id]" type="checkbox" />
            <span>{{ t.label }}</span>
          </label>
          <div class="price">
            <input v-model="form.prix[t.id]" type="number" min="0" step="5" inputmode="numeric" :disabled="!accepted[t.id]" :aria-label="'Prix au kilo pour ' + t.label" />
            <span>FCFA/kg</span>
          </div>
          <p v-if="priceErrors[t.id]" class="err" role="alert">{{ priceErrors[t.id] }}</p>
        </div>

        <div class="pv-actions">
          <button type="submit" class="pv-btn pv-btn-primary" :disabled="submitting">{{ submitting ? 'Enregistrement…' : 'Enregistrer la fiche' }}</button>
          <RouterLink to="/centre" class="pv-btn pv-btn-secondary">Annuler</RouterLink>
        </div>
      </section>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'
import { useToastStore } from '../../stores/toastStore.js'

const auth = useAuthStore()
const root = useRootStore()
const toast = useToastStore()

const FIELDS = [
  { key: 'nom', label: 'Nom du centre' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'quartier', label: 'Quartier' },
  { key: 'horaires', label: 'Horaires' },
  { key: 'contact', label: 'Contact' }
]
const TYPES = [
  { id: 'PET', label: 'PET (bouteilles)' },
  { id: 'PEHD', label: 'PEHD (bidons)' },
  { id: 'PP', label: 'PP (barquettes)' },
  { id: 'SACHETS', label: 'Sachets et films' }
]

const monCentre = computed(() => (root.centres.list || []).find((c) => c.id === auth.profile?.centreId))
const form = ref({ nom: '', adresse: '', quartier: '', horaires: '', contact: '', prix: {} })
const accepted = ref({})
const errors = ref({})
const priceErrors = ref({})
const submitting = ref(false)

// Remplit le formulaire avec les données actuelles du centre
watch(monCentre, (c) => {
  if (!c) return
  FIELDS.forEach((f) => { form.value[f.key] = c[f.key] || '' })
  form.value.prix = { ...(c.prix || {}) }
  accepted.value = Object.fromEntries(TYPES.map((t) => [t.id, (c.plastiquesAcceptes || []).includes(t.id)]))
}, { immediate: true })

function validate() {
  const e = {}
  const p = {}
  if (!form.value.nom.trim()) e.nom = 'Le nom est obligatoire.'
  if (!form.value.adresse.trim()) e.adresse = 'L’adresse est obligatoire.'
  if (!form.value.horaires.trim()) e.horaires = 'Les horaires sont obligatoires.'
  if (!form.value.contact.trim()) e.contact = 'Le contact est obligatoire.'
  TYPES.forEach((t) => {
    if (accepted.value[t.id] && !(Number(form.value.prix[t.id]) >= 0 && form.value.prix[t.id] !== '' && form.value.prix[t.id] != null)) {
      p[t.id] = 'Indiquez un prix valide.'
    }
  })
  if (!TYPES.some((t) => accepted.value[t.id])) e.nom = e.nom || 'Acceptez au moins un type de plastique.'
  errors.value = e
  priceErrors.value = p
  return !Object.keys(e).length && !Object.keys(p).length
}

function submit() {
  if (!validate()) return
  submitting.value = true
  const types = TYPES.filter((t) => accepted.value[t.id])
  root.centres.update({
    ...monCentre.value,
    nom: form.value.nom,
    adresse: form.value.adresse,
    quartier: form.value.quartier,
    horaires: form.value.horaires,
    contact: form.value.contact,
    plastiquesAcceptes: types.map((t) => t.id),
    prix: Object.fromEntries(types.map((t) => [t.id, Number(form.value.prix[t.id])]))
  })
  submitting.value = false
  try { toast.add('success', 'Fiche du centre enregistrée.') } catch { /* facultatif */ }
}
</script>

<style scoped>
.grid2 { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 900px) { .grid2 { grid-template-columns: 1fr 1fr; align-items: start; } }
.pv-card h2 { margin-bottom: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); margin-bottom: var(--space-4); }
.field label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text); }
input[type="text"], input[type="number"] { min-height: 44px; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-text); font-size: var(--font-size-sm); }
input:focus { outline: 2px solid var(--color-primary); outline-offset: 1px; border-color: var(--color-primary); }
input:disabled { background: #F1F5F9; color: var(--color-text-muted); }
input[aria-invalid="true"] { border-color: var(--color-danger); }
.type { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--color-border); }
.check { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-sm); }
.check input { width: 18px; height: 18px; accent-color: var(--color-primary); }
.price { display: flex; align-items: center; gap: var(--space-2); font-size: var(--font-size-xs); color: var(--color-text-muted); }
.price input { width: 110px; text-align: right; }
.err { width: 100%; margin: 0; font-size: var(--font-size-xs); color: var(--color-danger); }
.pv-actions { margin-top: var(--space-6); }
</style>