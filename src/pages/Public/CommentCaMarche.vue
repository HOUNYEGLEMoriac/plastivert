<template>
  <div class="app-shell">
    <main class="main">
      <header class="page-header">
        <h1>Comment ça marche</h1>
        <p>
          Un processus simple entre un collecteur et un centre de recyclage.
        </p>
      </header>

      <div class="steps" style="display:grid; gap:var(--space-4); ">
        <div class="step-card" v-for="step in steps" :key="step.number">
          <div class="step-number">{{ step.number }}</div>
          <h3 style="margin:0 0 var(--space-2); ">{{ step.title }}</h3>
          <p style="margin:0 0 var(--space-4); color: var(--color-text-secondary); ">{{ step.text }}</p>
          <ul style="margin:0 0 var(--space-4); padding-left: var(--space-5); color: var(--color-text-secondary); ">
            <li v-for="item in step.items" :key="item" style="margin-bottom: var(--space-1); ">{{ item }}</li>
          </ul>
        </div>
      </div>

      <section class="grid grid-2" style="margin-top: var(--space-8); gap:var(--space-4); ">
        <div class="card">
          <h2 style="margin:0 0 var(--space-3); ">Pour les collecteurs</h2>
          <ul style="margin:0; padding-left: var(--space-5); color: var(--color-text-secondary); ">
            <li v-for="item in collecteurs" :key="item" style="margin-bottom: var(--space-1); ">{{ item }}</li>
          </ul>
        </div>
        <div class="card">
          <h2 style="margin:0 0 var(--space-3); ">Pour les centres</h2>
          <ul style="margin:0; padding-left: var(--space-5); color: var(--color-text-secondary); ">
            <li v-for="item in centres" :key="item" style="margin-bottom: var(--space-1); ">{{ item }}</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
const steps = [
  {
    number: '1',
    title: 'Ramasser',
    text: 'Rassembler les emballages plastiques dans la rue ou les markets.',
    items: [
      'Un ramasseur récupère les bouteilles et emballages traitables.',
      'Les plastiques sont triés et mis de côté.',
      'Le poids approximatif du lot est estimé pour l’annonce.'
    ]
  },
  {
    number: '2',
    title: 'Trouver un centre',
    text: 'Utilisez la carte pour voir les centres recyclants et leurs prix au kilo.',
    items: [
      'La carte affiche les centres valides et leurs adresses.',
      'Chaque centre indique les plastiques acceptés et le prix au kilo.',
      'Le collecteur choisit le centre le plus proche ou le plus avantageux.'
    ]
  },
  {
    number: '3',
    title: 'Annoncer son lot',
    text: 'L’annonce s’effectue par téléphone, avec un estimateur de prix.',
    items: [
      'Le collecteur indique le centre, le type de plastique et le poids estimé.',
      'Le montant estimé est affiché en temps réel (poids × prix).',
      'Le centre valide l’horaire et la réception est prévue.'
    ]
  },
  {
    number: '4',
    title: 'Être payé',
    text: 'À la réception, le poids réel est mesuré et le paiement est effectif.',
    items: [
      'Le centre constate le poids réel du lot.',
      'Le paiement peut être en espèces ou mobile money.',
      'Le lot passe à payé et la valeur est ajoutée aux statistiques de la ville.'
    ]
  }
]

const collecteurs = [
  'Avoir un prix clair avant de partir, et gagner plus vite.',
  'Voir le centre le plus proche et éviter les allers-retours inutiles.',
  'Être payé au poids réel et respecté pour sa récolte.'
]

const centres = [
  'Avoir du matériau de plus, le temps fait et prédit.',
  'Valider les prix au kilo et les tarifs par type de plastique.',
  'Recueillir le paiement et suivre le stock reçu.'
]
</script>
