import { createApp } from 'vue'
// Schriften lokal eingebunden (kein Laden von Google)
import '@fontsource/fira-code/300.css'
import '@fontsource/fira-code/400.css'
import '@fontsource/fira-code/500.css'
import '@fontsource/fira-code/600.css'
import '@fontsource/fira-code/700.css'
// Montserrat nur noch für den Schriftzug im Logo (wie auf der Visitenkarte)
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/800.css'
import './assets/base.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
