<template>
  <div class="app-shell">
    <main class="main">
      <PageHeader
        title="Valider réception et enregistrer paiement"
        description="Enregistrez le paiement de chaque collecteur."
        :breadcrumb="[{ title: 'Accueil', path: '/' }, { title: 'Centre', path: '/centre' }, { title: 'Paiements', path: '/centre/paiements' }]"
      >
        <Button type="secondary" size="m" :to="{ name: 'centre-lots' }">
          Voir les lots
        </Button>
      </PageHeader>

      <section class="card" style="padding: var(--space-4); ">
        <h2 style="margin:0 0 var(--space-3); ">Enregistrer un paiement</h2>
        <form @submit.prevent="submit" class="grid grid-2" style="gap: var(--space-4); ">
          <div class="card" style="padding: var(--space-4); ">
            <Select
              :options="lotOptions"
              v-model="form.lotId"
              label="Lot"
              :error="errors.lotId"
            />
            <Input
              v-model="form.poidsReel"
              type="number"
              min="0.1"
              step="0.1"
              label="Poids réel pesé (kg)"
              :error="errors.poidsReel"
              placeholder="Ex: 11.8"
            />
            <Input
              v-model="form.montant"
              type="number"
              min="0"
              step="0.01"
              label="Montant versé (FCFA)"
              :error="errors.montant"
            />
            <Input
              v-model="form.date"
              type="date"
              label="Date du paiement"
              :error="errors.date"
            />
            <Select
              :options="modeOptions"
              v-model="form.mode"
              label="Mode de paiement"
              :error="errors.mode"
            />
            <p v-if="errors.generic" class="error" role="alert">{{ errors.generic }}</p>
            <Button type="primary" size="g" :loading="submitting" style="width:100%; ">
              <Check />
              {{ submitting ? 'Enregistrement...' : 'Enregistrer le paiement' }}
            </Button>
          </div>
          <div class="card" style="padding: var(--space-4); ">
            <h2 style="margin:0 0 var(--space-3); ">Récapitulatif</h2>
            <div class="summary">
              <div class="summary-row">
                <span class="label">Lot</span>
                <span>{{ selectedLot?.typePlastique || '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Poids réel du lot</span>
                <span>{{ selectedLot?.poidsReel ? formatKg(selectedLot.poidsReel) : '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Montant</span>
                <strong>{{ form.montant ? formatMoney(form.montant) : '—' }}</strong>
              </div>
              <div class="summary-row">
                <span class="label">Date</span>
                <span>{{ form.date ? formatDate(form.date) : '—' }}</span>
              </div>
              <div class="summary-row">
                <span class="label">Mode</span>
                <span>{{ form.mode || '—' }}</span>
              </div>
            </div>
          </div>
        </form>
      </section>

      <section class="card" style="padding: var(--space-4); margin-top: var(--space-4); ">
        <h2 style="margin:0 0 var(--space-3); ">Historique des paiements</h2>
        <DataTable
          :data="sortedPaiements"
          :columns="paiementColumns"
          :get-item-key="(p) => p.id"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore.js'
import { useRootStore } from '../../stores/index.js'
import { formatMoney, formatDate, formatKg } from '../../utils/helpers.js'
import { useToastStore } from '../../stores/toastStore.js'
import Button from '../../components/ui/Button.vue'
import PageHeader from '../../components/PageHeader.vue'
import Select from '../../components/ui/Select.vue'
import Input from '../../components/ui/Input.vue'
import Check from '../../components/icons/Check.vue'
import DataTable from '../../components/ui/DataTable.vue'

const auth = useAuthStore()
const root = useRootStore()
const toastStore = useToastStore()
const toast = toastStore

const lots = computed(() => root.lots.list)

const lotOptions = computed(() => {
  const centreId = auth.profile.centreId
  return [
    { value: '', label: '-- Choisir un lot --' },
    ...lots.value
      .filter((l) => l.centreId === centreId && (l.statut === 'annonce' || l.statut === 'recu'))
      .map((l) => ({ value: l.id, label: `${l.typePlastique} — ${l.poidsEstime} kg — ${l.statut}` }))
  ]
})

const modeOptions = [
  { value: 'especes', label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile money' }
]

const form = ref({ lotId: '', poidsReel: '', montant: '', date: '', mode: 'especes' })
const errors = ref({})
const submitting = ref(false)

const selectedLot = computed(() => lots.value.find((l) => l.id === form.value.lotId) || null)

const validate = () => {
  const e = {}
  if (!form.value.lotId) e.lotId = 'Choisissez un lot.'
  if (!form.value.poidsReel || Number(form.value.poidsReel) <= 0) e.poidsReel = 'Indiquez le poids réel.'
  if (!form.value.montant || Number(form.value.montant) <= 0) e.montant = 'Montant invalide.'
  if (!form.value.date) e.date = 'Indiquez une date.'
  if (!form.value.mode) e.mode = 'Choisissez un mode.'
  errors.value = e
  return Object.keys(e).length === 0
}

const submit = () => {
  if (!validate()) return
  submitting.value = true
  const lot = root.lots.getById(form.value.lotId)
  const centre = root.centres.byId[lot.centreId]
  const prix = centre?.prix?.[lot.typePlastique] || 0
  const poidsReel = Number(form.value.poidsReel)

  // Confirmer réception avec poids réel
  lot.poidsReel = poidsReel
  lot.statut = 'recu'
  root.lots.update(lot)

  // Enregistrer le paiement
  const paye = Math.min(Number(form.value.montant), poidsReel * prix)
  lot.montantPaye = paye
  lot.statut = 'paye'
  root.lots.update(lot)

  root.paiements.add({
    lotId: form.value.lotId,
    montant: Number(form.value.montant),
    date: form.value.date,
    mode: form.value.mode
  })

  submitting.value = false
  toast.add('success', `Lot validé et paiement de ${formatMoney(paye)} enregistré.`)
}

const sortedPaiements = computed(() => {
  const centreId = auth.profile.centreId
  return [...root.paiements.list]
    .filter((p) => {
      const lot = lots.value.find((l) => l.id === p.lotId)
      return lot && lot.centreId === centreId
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})

const paiementColumns = [
  { key: 'lotId', label: 'Lot' },
  { key: 'montant', label: 'Montant', format: (v) => formatMoney(v) },
  { key: 'date', label: 'Date', format: (v) => formatDate(v) },
  { key: 'mode', label: 'Mode' }
]
</script>

<style scoped>
.card { border: 1px solid var(--color-border); border-radius: var(--radius-md); }
.summary { display: flex; flex-direction: column; gap: var(--space-2); }
.summary-row { display: flex; justify-content: space-between; font-size: var(--font-size-sm); padding-bottom: var(--space-2); border-bottom: 1px solid var(--color-border); }
.summary-row .label { color: var(--color-text-muted); }
.summary-row.total { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); border: none; padding-top: var(--space-2); }
</style>
