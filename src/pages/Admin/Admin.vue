<template>
  <div class="app-shell">
    <main class="main">
      <PageHeader
        title="Espace administrateur"
        description="Gérez les centres, les comptes et suivez l'impact de la plateforme."
        :breadcrumb="[{ title: 'Accueil', path: '/' }, { title: 'Admin', path: '/admin' }]"
      >
        <Button type="secondary" size="m" :to="{ name: 'admin-dashboard' }">
          Tableau de bord
        </Button>
      </PageHeader>

      <section class="grid grid-2" style="gap: var(--space-4); ">
        <div class="card" style="padding: var(--space-4); ">
          <h2 style="margin:0 0 var(--space-3); ">Gestion des centres</h2>
          <RouterLink to="/admin/centres">
            <Button type="secondary" size="m" style="width:100%; ">
              <Check />
              Gérer les centres
            </Button>
          </RouterLink>
        </div>
        <div class="card" style="padding: var(--space-4); ">
          <h2 style="margin:0 0 var(--space-3); ">Gestion des comptes</h2>
          <RouterLink to="/admin/comptes">
            <Button type="secondary" size="m" style="width:100%; ">
              <Users />
              Gérer les comptes
            </Button>
          </RouterLink>
        </div>
        <div class="card" style="padding: var(--space-4); ">
          <h2 style="margin:0 0 var(--space-3); ">Signalements</h2>
          <RouterLink to="/admin/signalements">
            <Button type="secondary" size="m" style="width:100%; ">
              <Alert />
              Traiter les signalements
            </Button>
          </RouterLink>
        </div>
        <div class="card" style="padding: var(--space-4); ">
          <h2 style="margin:0 0 var(--space-3); ">Tableau de bord</h2>
          <RouterLink to="/admin/dashboard">
            <Button type="secondary" size="m" style="width:100%; ">
              <MapPin />
              Voir les statistiques
            </Button>
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import MapPin from '../../components/icons/MapPin.vue'
import Users from '../../components/icons/Users.vue'
import Check from '../../components/icons/Check.vue'
import Alert from '../../components/icons/Alert.vue'
import Button from '../../components/ui/Button.vue'
import PageHeader from '../../components/PageHeader.vue'
</script>
