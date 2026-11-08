<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BrandLogo from './BrandLogo.vue'

type NavLink = { to: { path: string; hash?: string }; label: string }

const route = useRoute()
const open = ref(false)
const section = ref('')
const links: NavLink[] = [
  { to: { path: '/', hash: '#leistungen' }, label: 'Leistungen' },
  { to: { path: '/werkstatt' }, label: 'Werkstatt' },
  { to: { path: '/anfrage' }, label: 'Anfrage' },
  { to: { path: '/', hash: '#kontakt' }, label: 'Kontakt' },
]

const isActive = (l: NavLink) =>
  l.to.hash ? route.path === '/' && section.value === l.to.hash : route.path === l.to.path

function updateSection() {
  if (route.path !== '/') {
    section.value = ''
    return
  }
  const line = window.innerHeight * 0.4
  const atBottom = window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  let current = ''
  for (const id of ['leistungen', 'kontakt']) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= line) current = '#' + id
  }
  section.value = atBottom ? '#kontakt' : current
}

onMounted(() => {
  window.addEventListener('scroll', updateSection, { passive: true })
  window.addEventListener('resize', updateSection)
  updateSection()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateSection)
  window.removeEventListener('resize', updateSection)
})
watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    updateSection()
  },
)
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-navy">

    <div class="mx-auto flex min-h-25 max-w-[1800px] items-center gap-4 px-pad">
      <RouterLink to="/" class="mr-auto flex items-center gap-3 py-2 no-underline"
        aria-label="Schüssele Präzision – Startseite" @click="open = false">
        <BrandLogo variant="mark" tone="dark" class="h-11 w-auto shrink-0 nav:h-20" aria-hidden="true" />
        <span class="flex flex-col items-center font-brand text-lg leading-[1.1] nav:text-2xl">
          <span class="font-extrabold tracking-[0.06em] text-white">SCHÜSSELE</span>
          <span class="-mr-[0.3em] text-[0.78em] font-normal tracking-[0.3em] text-teal">PRÄZISION</span>
        </span>
      </RouterLink>

      <nav id="hauptnav" aria-label="Hauptnavigation"
        class="nav:static nav:mr-4 nav:flex nav:flex-row nav:gap-7 nav:border-0 nav:bg-transparent nav:p-0"
        :class="open ? 'absolute inset-x-0 top-full flex flex-col border-b border-white/10 bg-navy px-pad pt-2 pb-4' : 'hidden'">
        <RouterLink v-for="l in links" :key="l.label" :to="l.to"
          class="border-b border-white/15 py-3 text-base font-semibold no-underline nav:border-b-2 nav:py-1.5 nav:hover:border-teal"
          :class="isActive(l) ? 'text-teal nav:border-teal nav:text-white' : 'text-white nav:border-transparent'"
          :aria-current="isActive(l) ? 'page' : undefined" @click="open = false">
          {{ l.label }}
        </RouterLink>
      </nav>

      <a href="tel:+4917622759201"
        class="hidden items-center gap-1.5 border border-white/60 px-3.5 py-2.5 font-mono text-sm whitespace-nowrap text-white no-underline transition-colors hover:border-white hover:bg-white hover:text-navy nav:inline-flex">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4">
          <path
            d="M21 16.4v2.9a2 2 0 0 1-2.2 2A18 18 0 0 1 2.7 5.2 2 2 0 0 1 4.7 3h2.9a1.6 1.6 0 0 1 1.6 1.3l.6 3a1.6 1.6 0 0 1-.5 1.5l-1.4 1.3a14 14 0 0 0 6 6l1.3-1.4a1.6 1.6 0 0 1 1.5-.5l3 .6a1.6 1.6 0 0 1 1.3 1.6Z"
            fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
        <span>0176 22759201</span>
      </a>

      <button type="button" class="flex size-11 cursor-pointer flex-col justify-center gap-1.5 px-2.5 nav:hidden"
        :aria-expanded="open" aria-controls="hauptnav" @click="open = !open">
        <span class="sr-only">Menü</span>
        <span class="block h-[1.5px] bg-white transition-transform" :class="open && 'translate-y-[3.75px] rotate-45'" />
        <span class="block h-[1.5px] bg-white transition-transform"
          :class="open && '-translate-y-[3.75px] -rotate-45'" />
      </button>
    </div>

    <a href="tel:+4917622759201"
      class="flex items-center justify-center gap-2 border-t border-white/10 py-2 font-mono text-sm text-white no-underline nav:hidden">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4 text-teal">
        <path
          d="M21 16.4v2.9a2 2 0 0 1-2.2 2A18 18 0 0 1 2.7 5.2 2 2 0 0 1 4.7 3h2.9a1.6 1.6 0 0 1 1.6 1.3l.6 3a1.6 1.6 0 0 1-.5 1.5l-1.4 1.3a14 14 0 0 0 6 6l1.3-1.4a1.6 1.6 0 0 1 1.5-.5l3 .6a1.6 1.6 0 0 1 1.3 1.6Z"
          fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
      </svg>
      0176 22 75 92 01
    </a>
  </header>
</template>
