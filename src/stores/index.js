import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useAuthStore } from './authStore'
import { useCentresStore } from './centresStore'
import { useCollecteursStore } from './collecteursStore'
import { useLotsStore } from './lotsStore'
import { useSignalementsStore } from './signalementsStore'
import { usePaiementsStore } from './paiementsStore'
import { useUsersStore } from './usersStore'

export const useRootStore = defineStore('root', () => {
  const auth = useAuthStore()
  const centres = useCentresStore()
  const collecteurs = useCollecteursStore()
  const lots = useLotsStore()
  const signalements = useSignalementsStore()
  const paiements = usePaiementsStore()
  const users = useUsersStore()

  // Centres validés et actifs (computed : on lit .value à l'intérieur du store)
  const centresValides = computed(() => (centres.valides || []).filter((c) => c.actif))

  // Chiffres d'impact affichés sur l'accueil et le tableau de bord
  const stats = computed(() => {
    const lotsList = lots.list || []
    const collected = lotsList
      .filter((l) => l.statut === 'paye' || l.statut === 'recu')
      .reduce((acc, l) => acc + (l.poidsReel || 0), 0)
    const paye = lotsList
      .filter((l) => l.statut === 'paye')
      .reduce((acc, l) => acc + (l.montantPaye || 0), 0)
    const collecteursActifs = (collecteurs.actifs || []).length
    const centresActifs = centresValides.value.length
    return { collected, paye, collecteursActifs, centresActifs }
  })

  // Charge tous les stores (chacun gère son propre état initial)
  const loadAll = async () => {
    try {
      await Promise.all([
        auth.load?.(),
        centres.load?.(),
        collecteurs.load?.(),
        lots.load?.(),
        signalements.load?.(),
        paiements.load?.(),
        users.load?.(),
      ])
    } catch (err) {
      console.error('Erreur lors du chargement des données', err)
    }
  }

  return {
    auth,
    centres,
    collecteurs,
    lots,
    signalements,
    paiements,
    users,
    centresValides,
    stats,
    loadAll,
  }
})