import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: 'CNC-Drehen und -Fräsen in Neuried' } },
    { path: '/anfrage', name: 'anfrage', component: () => import('./views/AnfrageView.vue'), meta: { title: 'Anfrage' } },
    { path: '/impressum', name: 'impressum', component: () => import('./views/ImpressumView.vue'), meta: { title: 'Impressum' } },
    { path: '/datenschutz', name: 'datenschutz', component: () => import('./views/DatenschutzView.vue'), meta: { title: 'Datenschutz' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 80 }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title as string} – Schüssele Präzision`
})

export default router
