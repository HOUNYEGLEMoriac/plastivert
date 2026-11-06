import usersData from '../data/users.json'
import adminsData from '../data/admins.json'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadState, saveState } from '../services/storageService'

const STORAGE_KEY = 'plastivert:auth'

export const useAuthStore = defineStore('auth', () => {
  const profile = ref(null)
  const role = computed(() => profile.value ? profile.value.role : null)

  function isAuthenticated() {
    return !!profile.value
  }

  function isRole(r) {
    return role.value === r
  }

  function loginDemo(role) {
    const account = computeAccount(role)
    profile.value = account
    saveState(loadState())
  }

  function logout() {
    profile.value = null
  }

  function switchProfile(role) {
    logout()
    loginDemo(role)
  }

  /** Chargement des données de démo depuis les fichiers JSON */
  async function load() {
    // On initialise le profil démo à partir des données fictives
    // Ne fait rien si des données existent déjà (pour ne pas écraser un vrai login)
    if (profile.value) return
    const account = computeAccount('collecteur')
    if (account) {
      profile.value = account
    }
  }

  function computeAccount(role) {
    const users = usersData
    const admins = adminsData
    const admin = admins.find((a) => a.role === 'admin') || users.find((a) => a.role === 'admin')
    const user = users.find((u) => u.role === role)
    const account = user || admin || users[0] || null
    if (!account) return null
    return {
      id: account.id,
      role: account.role,
      nom: account.nom,
      email: account.email,
      telephone: account.telephone,
      centreId: account.centreId,
      collecteurId: account.collecteurId
    }
  }

  return { profile, role, isAuthenticated, isRole, loginDemo, logout, switchProfile, load }
})
