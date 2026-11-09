import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import { VARIANTEN } from './variante2/stil'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '' } },
    { path: '/werkstatt', name: 'werkstatt', component: () => import('./views/WerkstattView.vue'), meta: { title: 'Werkstatt & Maschinen' } },
    { path: '/anfrage', name: 'anfrage', component: () => import('./views/AnfrageView.vue'), meta: { title: 'Anfrage' } },
    ...VARIANTEN.map(({ basis, kopf }) => ({
      path: basis,
      component: () => import('./variante2/V2Layout.vue'),
      meta: { eigenesLayout: true, kopf },
      children: [
        { path: '', component: () => import('./variante2/V2Start.vue'), meta: { title: '', start: true } },
        { path: 'werkstatt', component: () => import('./variante2/V2Werkstatt.vue'), meta: { title: 'Werkstatt' } },
        { path: 'anfrage', component: () => import('./variante2/V2Anfrage.vue'), meta: { title: 'Anfrage' } },
        { path: 'impressum', component: () => import('./variante2/V2Impressum.vue'), meta: { title: 'Impressum' } },
        { path: 'datenschutz', component: () => import('./variante2/V2Datenschutz.vue'), meta: { title: 'Datenschutz' } },
        { path: ':pathMatch(.*)*', redirect: basis },
      ],
    })),
    { path: '/v2:x(a|b|c)/:rest(.*)*', redirect: (to) => `/v2/${(to.params.rest as string[] | undefined)?.join('/') ?? ''}` },
    { path: '/impressum', name: 'impressum', component: () => import('./views/ImpressumView.vue'), meta: { title: 'Impressum' } },
    { path: '/datenschutz', name: 'datenschutz', component: () => import('./views/DatenschutzView.vue'), meta: { title: 'Datenschutz' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) {
      const top = to.meta.eigenesLayout ? 0 : 128
      return new Promise((resolve) => {
        let versuche = 0
        const pruefen = () => {
          if (document.querySelector(to.hash) || versuche++ > 20) resolve({ el: to.hash, top })
          else setTimeout(pruefen, 50)
        }
        setTimeout(pruefen, _from.path === to.path ? 0 : 50)
      })
    }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const t = to.meta.title as string | undefined
  document.title = t ? `${t} – Schüssele Präzision` : 'Schüssele Präzision'
})

export default router
