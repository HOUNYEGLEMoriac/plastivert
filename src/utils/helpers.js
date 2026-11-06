/**
 * Mise en forme et calculs utiles.
 */

/** Format monétaire Bénin (FCFA). */
export function formatMoney(value) {
  return `${Math.round(value).toLocaleString('fr-BJ')} FCFA`
}

/** Format poids en kg avec 1 décimale. */
export function formatKg(value) {
  return `${Number(value).toFixed(1)} kg`
}

/** Formate une date au format jour mois année. */
export function formatDate(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Intl.DateTimeFormat('fr-BJ', options).format(date)
}

/** Retourne le mois et année (ex: Septembre 2025). */
export function formatMonthMonth(value) {
  if (!value) return 'Non réceptionné'
  const monthIndex = Number(value.slice(5, 7)) - 1
  const year = value.slice(0, 4)
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  return `${months[monthIndex]} ${year}`
}

/** Calcule la distance en km entre deux coordonnées (formule de Haversine). */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Number((R * c).toFixed(1))
}
