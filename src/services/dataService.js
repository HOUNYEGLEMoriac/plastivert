/**
 * Service d'accès aux données.
 * Lecture des fichiers JSON de démonstration (modules ES chargés par Vite).
 * La sauvegarde est gérée par les stores (localStorage).
 * À brancher plus tard sur une vraie API sans changer le reste de l'application.
 */

// Vite charge tous les JSON du dossier data au démarrage
const modules = import.meta.glob('../data/*.json', { eager: true, import: 'default' })

export async function getAll(collection) {
  const data = modules[`../data/${collection}.json`]
  if (!data) {
    throw new Error(`Collection introuvable : ${collection}`)
  }
  // Copie pour ne pas modifier les données d'origine
  return JSON.parse(JSON.stringify(data))
}

export async function getById(collection, id) {
  const list = await getAll(collection)
  return list.find((item) => item.id === id)
}

export async function saveAll(collection, items) {
  return items
}