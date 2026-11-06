// Navigation de l'espace connecté, par rôle. Chemins = routes de src/router/index.js
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  building: '<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/>',
  inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h6l1 2h4l1-2h6"/>',
  wallet: '<path d="M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 7l12-3v3M16 14h3"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
  alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  logout: '<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>'
}

const NAV = {
  collecteur: [
    { to: '/collecteur', label: 'Mon espace', short: 'Espace', icon: 'home' },
    { to: '/collecteur/lots', label: 'Mes lots', short: 'Lots', icon: 'list' },
    { to: '/collecteur/annonce', label: 'Annoncer un lot', short: 'Annoncer', icon: 'plus' },
    { to: '/carte', label: 'Carte des centres', short: 'Carte', icon: 'map' }
  ],
  centre: [
    { to: '/centre/dashboard', label: 'Tableau de bord', short: 'Accueil', icon: 'chart' },
    { to: '/centre/mon-centre', label: 'Mon centre', short: 'Centre', icon: 'building' },
    { to: '/centre/lots', label: 'Lots reçus', short: 'Lots', icon: 'inbox' },
    { to: '/centre/paiements', label: 'Paiements', short: 'Paiements', icon: 'wallet' }
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Tableau de bord', short: 'Accueil', icon: 'chart' },
    { to: '/admin/centres', label: 'Gestion des centres', short: 'Centres', icon: 'check' },
    { to: '/admin/comptes', label: 'Gestion des comptes', short: 'Comptes', icon: 'users' },
    { to: '/admin/signalements', label: 'Signalements', short: 'Alertes', icon: 'alert' }
  ]
}

export const ROLE_LABELS = { collecteur: 'Collecteur', centre: 'Centre de recyclage', admin: 'Administrateur' }
export const icon = (name) => ICONS[name] || ''
export const navFor = (role) => NAV[role] || []