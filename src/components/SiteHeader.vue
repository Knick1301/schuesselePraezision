<script setup lang="ts">
import { ref } from 'vue'
import BrandLogo from './BrandLogo.vue'

const open = ref(false)
const links = [
  { to: { path: '/', hash: '#leistungen' }, label: 'Leistungen' },
  { to: { path: '/anfrage' }, label: 'Anfrage' },
  { to: { path: '/', hash: '#kontakt' }, label: 'Kontakt' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-white/10 bg-navy">

    <div class="mx-auto flex min-h-20 max-w-[1800px] items-center gap-4 px-pad">
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
          class="border-b border-white/15 py-3 text-base font-semibold text-white no-underline nav:border-transparent nav:py-1.5 nav:hover:border-teal"
          @click="open = false">
          {{ l.label }}
        </RouterLink>
      </nav>

      <a href="tel:+4917622759201"
        class="inline-flex items-center gap-1.5 border border-white/60 px-3.5 py-2.5 font-mono text-sm whitespace-nowrap text-white no-underline transition-colors hover:border-white hover:bg-white hover:text-navy">
        <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4">
          <path d="M7 2h10v20H7zM10 18.5h4" fill="none" stroke="currentColor" stroke-width="1.6"
            stroke-linejoin="round" />
        </svg>
        <span class="max-[420px]:sr-only">0176 22 75 92 01</span>
      </a>

      <button type="button" class="flex size-11 cursor-pointer flex-col justify-center gap-1.5 px-2.5 nav:hidden"
        :aria-expanded="open" aria-controls="hauptnav" @click="open = !open">
        <span class="sr-only">Menü</span>
        <span class="block h-[1.5px] bg-white transition-transform" :class="open && 'translate-y-[3.75px] rotate-45'" />
        <span class="block h-[1.5px] bg-white transition-transform"
          :class="open && '-translate-y-[3.75px] -rotate-45'" />
      </button>
    </div>
  </header>
</template>
