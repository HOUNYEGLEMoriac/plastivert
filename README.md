# Plastivert

Application de mise en relation entre collecteurs de plastique et centres de recyclage à Abomey-Calavi (Bénin).

## Stack

- Vue 3 + Vite (JavaScript)
- Vue Router, Pinia
- Leaflet (OpenStreetMap, sans clé API)
- lucide-vue-next (icônes SVG linéaires)
- @fontsource-variable/inter (police locale)
- CSS fait main avec variables CSS (design tokens)
- Graphiques SVG faits main
- PWA (manifest + cache des assets)
- Aucune librairie UI, aucun backend (données JSON + localStorage)

## Lancement

```bash
npm install
npm run dev      # serveur de développement
npm run build    # build de production
npm run preview  # prévisualiser le build
```

## Profils de démonstration

Depuis la page d’accueil, cliquez sur "Se connecter" ou accédez directement à /profil pour choisir un profil :

| Rôle | Email | Description |
|------|-------|-------------|
| Collecteur | afi@demo.plastivert.bj | Ramasseur qui collecte du plastique |
| Centre partenaire | centre@demo.plastivert.bj | Centre de recyclage (Centre Zoundja) |
| Administrateur | admin@demo.plastivert.bj | Gestion des centres, comptes et signalements |

*Note : il n’y a pas de véritable authentification. Le choix du profil simule une connexion.*

## Parcours V1 (bout en bout)

1. **Collecteur** annonce un lot (centre, type de plastique, poids estimé, date) → montant estimé affiché.
2. **Centre** confirme la réception avec le poids réel et enregistre le paiement (montant, date, mode : espèces ou mobile money).
3. **Collecteur** voit son historique mis à jour (lot passé en "reçu" puis "payé", kg et gains totaux).
4. **Admin** voit les chiffres d’impact mis à jour (kg collectés, argent versé, centres actifs, etc.).

## Structure du code

```
src/
  components/ui/    # Composants UI réutilisables (Button, FormField, Select, etc.)
  components/icons/ # Icônes SVG
  pages/            # Pages par rôle (Public, Collecteur, Centre, Admin)
  router/           # Configuration Vue Router avec gardes de rôle
  stores/           # Stores Pinia (auth, centres, collecteurs, lots, signalements, paiements, toasts)
  services/         # Accès aux données (point unique pour brancher une API plus tard)
  data/             # Fichiers JSON de démonstration
  styles/           # Tokens de design et styles de base
  utils/            # Helpers (formatage, distance Haversine)
```

## Données

Toutes les données sont dans src/data/ (fichiers JSON fictifs) et persiste dans le localStorage du navigateur. Ce sont des données de démonstration uniquement.
