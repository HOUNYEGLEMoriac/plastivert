<template>
  <div>
    <header class="pv-pagehead">
      <p class="pv-crumb">Collecteur</p>
      <h1>Annoncer un lot</h1>
      <p>Connaissez le montant attendu avant de vous rendre au centre.</p>
    </header>

    <form class="pv-form-grid" novalidate @submit.prevent="submit">
      <section class="pv-card">
        <h2>Détails du lot</h2>

        <div class="field">
          <label for="centre">Centre de destination</label>
          <select id="centre" v-model="form.centreId" :aria-invalid="!!errors.centreId">
            <option value="">Choisir un centre</option>
            <option v-for="c in centres" :key="c.id" :value="c.id">{{ c.nom }} — {{ c.quartier }}</option>
          </select>
          <p v-if="errors.centreId" class="err" role="alert">{{ errors.centreId }}</p>
        </div>

        <div class="field">
          <label for="type">Type de plastique</label>
          <select id="type" v-model="form.typePlastique" :disabled="!form.centreId" :aria-invalid="!!errors.typePlastique">
            <option value="">{{ form.centreId ? 'Choisir un type' : 'Choisissez d’abord un centre' }}</option>
            <option v-for="t in availableTypes" :key="t" :value="t">{{ TYPES[t] }}</option>
          </select>
          <p v-if="errors.typePlastique" class="err" role="alert">{{ errors.typePlastique }}</p>
          <p v-else-if="prixKg" class="help">Prix du centre : {{ prixKg }} FCFA/kg</p>
        </div>

        <div class="field">
          <label for="poids">Poids estimé (kg)</label>
          <input id="poids" v-model="form.poidsEstime" type="number" min="0.1" step="0.1" inputmode="decimal" placeholder="Ex. 12" :aria-invalid="!!errors.poidsEstime" />
          <p v-if="errors.poidsEstime" class="err" role="alert">{{ errors.poidsEstime }}</p>
        </div>

        <div class="field">
          <label for="date">Date prévue</label>
          <input id="date" v-model="form.datePrevue" type="date" :min="today" :aria-invalid="!!errors.datePrevue" />
          <p v-if="errors.datePrevue" class="err" role="alert">{{ errors.datePrevue }}</p>
        </div>

        <p v-if="errors.generic" class="err" role="alert">{{ errors.generic }}</p>

        <div class="pv-actions">
          <button type="submit" class="pv-btn pv-btn-primary" :disabled="submitting">
            {{ submitting ? 'Enregistrement…' : 'Annoncer le lot' }}
          </button>
          <RouterLink to="/collecteur/lots" class="pv-btn pv-btn-secondary">Retour aux lots</RouterLink>
        </div>
      </section>

      <section class="pv-card">
        <h2>Résumé</h2>
        <dl class="summary">
          <div><dt>Centre</dt><dd>{{ selectedCentre?.nom || '—' }}</dd></div>
          <div><dt>Plastique</dt><dd>{{ form.typePlastique ? TYPES[form.typePlastique] : '—' }}</dd></div>
          <div><dt>Poids estimé</dt><dd>{{ Number(form.poidsEstime) > 0 ? formatKg(Number(form.poidsEstime)) : '—' }}</dd></div>
          <div><dt>Date prévue</dt><dd>{{ form.datePrevue ? formatDate(form.datePrevue) : '—' }}</dd></div>
          <div class="total"><dt>Montant estimé</dt><dd>{{ formatMoney(montant) }}</dd></div>
        </dl>
        <p class="help">Le montant définitif dépend du poids réel pesé par le centre.</p>
      </section>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'
import { useToastStore } from '../../stores/toastStore.js'
import { formatKg, formatMoney, formatDate } from '../../utils/helpers.js'

const auth = useAuthStore()
const root = useRootStore()
const toast = useToastStore()
const router = useRouter()

const TYPES = { PET: 'PET (bouteilles)', PEHD: 'PEHD (bidons)', PP: 'PP (barquettes)', SACHETS: 'Sachets et films' }
const today = new Date().toISOString().slice(0, 10)

const form = ref({ centreId: '', typePlastique: '', poidsEstime: '', datePrevue: '' })
const errors = ref({})
const submitting = ref(false)

const centres = computed(() => root.centres.valides || [])
const selectedCentre = computed(() => centres.value.find((c) => c.id === form.value.centreId))
// Seuls les types acceptés par le centre choisi sont proposés
const availableTypes = computed(() => (selectedCentre.value?.plastiquesAcceptes || []).filter((t) => TYPES[t]))
const prixKg = computed(() => selectedCentre.value?.prix?.[form.value.typePlastique] || 0)
const montant = computed(() => Math.round((Number(form.value.poidsEstime) || 0) * prixKg.value))

watch(() => form.value.centreId, () => {
  if (!availableTypes.value.includes(form.value.typePlastique)) form.value.typePlastique = ''
})

function validate() {
  const e = {}
  if (!form.value.centreId) e.centreId = 'Choisissez un centre.'
  if (!form.value.typePlastique) e.typePlastique = 'Choisissez un type de plastique.'
  if (!(Number(form.value.poidsEstime) > 0)) e.poidsEstime = 'Indiquez un poids supérieur à 0.'
  if (!form.value.datePrevue) e.datePrevue = 'Indiquez une date.'
  errors.value = e
  return Object.keys(e).length === 0
}

function submit() {
  if (!validate()) return
  submitting.value = true
  try {
    root.lots.add({
      collecteurId: auth.profile?.collecteurId || auth.profile?.id,
      centreId: form.value.centreId,
      typePlastique: form.value.typePlastique,
      poidsEstime: Number(form.value.poidsEstime),
      poidsReel: null,
      datePrevue: form.value.datePrevue,
      dateReception: null,
      statut: 'annonce',
      montantEstime: montant.value,
      montantPaye: null
    })
    try { toast.add('success', `Lot annoncé : ${formatMoney(montant.value)} attendus.`) } catch { /* notification facultative */ }
    router.push({ name: 'collecteur-lots' })
  } catch (err) {
    console.error(err)
    errors.value = { generic: 'Le lot n’a pas pu être enregistré. Réessayez.' }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.pv-form-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-4); }
@media (min-width: 900px) { .pv-form-grid { grid-template-columns: 1.2fr 1fr; align-items: start; } }
.pv-card h2 { margin-bottom: var(--space-4); }
.field { display: flex; flex-direction: column; gap: var(--space-1); margin-bottom: var(--space-4); }
.field label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--color-text); }
.field input, .field select { min-height: 44px; padding: 0 var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-surface); color: var(--color-text); font-size: var(--font-size-sm); }
.field input:focus, .field select:focus { outline: 2px solid var(--color-primary); outline-offset: 1px; border-color: var(--color-primary); }
.field select:disabled { background: #F1F5F9; color: var(--color-text-muted); }
.field [aria-invalid="true"] { border-color: var(--color-danger); }
.err { margin: 0; font-size: var(--font-size-xs); color: var(--color-danger); }
.help { margin: 0; font-size: var(--font-size-xs); color: var(--color-text-muted); }
.summary { margin: 0 0 var(--space-4); display: grid; gap: var(--space-2); }
.summary div { display: flex; justify-content: space-between; gap: var(--space-3); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border); font-size: var(--font-size-sm); }
.summary dt { color: var(--color-text-muted); }
.summary dd { margin: 0; color: var(--color-text); text-align: right; font-variant-numeric: tabular-nums; }
.summary .total { border-bottom: 0; font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); }
.summary .total dt { color: var(--color-text); }
</style>