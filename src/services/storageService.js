/**
 * Accès localStorage avec clé de préfixe pour l'application.
 * Constante pour que l'admin puisse réinitialiser.
 */
const KEY = 'plastivert_v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function clearState() {
  localStorage.removeItem(KEY)
}
