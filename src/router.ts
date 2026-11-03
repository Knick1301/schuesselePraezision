import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '' } },
    { path: '/werkstatt', name: 'werkstatt', component: () => import('./views/WerkstattView.vue'), meta: { title: 'Werkstatt' } },
    { path: '/anfrage', name: 'anfrage', component: () => import('./views/AnfrageView.vue'), meta: { title: 'Anfrage' } },
    { path: '/impressum', name: 'impressum', component: () => import('./views/ImpressumView.vue'), meta: { title: 'Impressum' } },
    { path: '/datenschutz', name: 'datenschutz', component: () => import('./views/DatenschutzView.vue'), meta: { title: 'Datenschutz' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 128 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t ? `${t} – Schüssele Präzision` : 'Schüssele Präzision'
})

export default router
