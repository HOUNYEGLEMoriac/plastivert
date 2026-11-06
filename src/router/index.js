import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: () => import('./../pages/Public/Accueil.vue')
    },
    {
      path: '/carte',
      name: 'carte',
      component: () => import('./../pages/Public/Carte.vue'),
      meta: { public: true }
    },
    {
      path: '/comment-ca-marche',
      name: 'commentCaMarche',
      component: () => import('./../pages/Public/CommentCaMarche.vue')
    },
    {
      path: '/profil',
      name: 'profil',
      component: () => import('./../pages/Public/Profil.vue')
    },
    {
      path: '/collecteur',
      name: 'collecteur',
      component: () => import('./../pages/Collecteur/Collecteur.vue'),
      meta: { requiresAuth: true, role: 'collecteur' }
    },
    {
      path: '/collecteur/lots',
      name: 'collecteur-lots',
      component: () => import('./../pages/Collecteur/Lots.vue'),
      meta: { requiresAuth: true, role: 'collecteur' }
    },
    {
      path: '/collecteur/annonce',
      name: 'collecteur-annonce',
      component: () => import('./../pages/Collecteur/Annonce.vue'),
      meta: { requiresAuth: true, role: 'collecteur' }
    },
    {
      path: '/centre',
      name: 'centre',
      component: () => import('./../pages/Centre/Centre.vue'),
      meta: { requiresAuth: true, role: 'centre' }
    },
    {
      path: '/centre/dashboard',
      name: 'centre-dashboard',
      component: () => import('./../pages/Centre/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'centre' }
    },
    {
      path: '/centre/mon-centre',
      name: 'centre-mon-centre',
      component: () => import('./../pages/Centre/MonCentre.vue'),
      meta: { requiresAuth: true, role: 'centre' }
    },
    {
      path: '/centre/lots',
      name: 'centre-lots',
      component: () => import('./../pages/Centre/Lots.vue'),
      meta: { requiresAuth: true, role: 'centre' }
    },
    {
      path: '/centre/paiements',
      name: 'centre-paiements',
      component: () => import('./../pages/Centre/Paiements.vue'),
      meta: { requiresAuth: true, role: 'centre' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('./../pages/Admin/Admin.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('./../pages/Admin/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/centres',
      name: 'admin-centres',
      component: () => import('./../pages/Admin/CentreManager.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/comptes',
      name: 'admin-comptes',
      component: () => import('./../pages/Admin/Comptes.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/signalements',
      name: 'admin-signalements',
      component: () => import('./../pages/Admin/Signalements.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const requiresAuth = to.meta.requiresAuth
  const requiredRole = to.meta.role

  if (requiresAuth && !auth.isAuthenticated()) {
    return { name: 'profil' }
  }

  if (requiresAuth && requiredRole && !auth.isRole(requiredRole)) {
    return { name: 'accueil' }
  }

  return true
})

export default router
