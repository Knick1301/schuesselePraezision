<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'

const year = new Date().getFullYear()
const INSTAGRAM = 'https://www.instagram.com/'
</script>

<template>
  <footer class="bg-navy py-6 text-[0.95rem] text-white/80 md:py-7">
    <div class="mx-auto grid max-w-wide items-center gap-6 px-pad text-center md:grid-cols-[1fr_auto_1fr_auto] md:gap-14 md:text-left">
      <div class="space-y-3">
        <p>Mirco Schüssele<br />Vogesenstraße 1<br />77743 Neuried</p>
        <p class="flex flex-col gap-1.5 font-mono md:items-start">
          <a href="tel:+4917622759201" class="text-white">0176 22 75 92 01</a>
          <a href="mailto:info@schuessele-praezision.de" class="text-white">info@schuessele-praezision.de</a>
        </p>
      </div>

      <RouterLink
        to="/"
        aria-label="Schüssele Präzision – Startseite"
        class="order-first mx-auto block w-40 md:order-none md:w-44"
      >
        <BrandLogo variant="full" tone="dark" class="h-auto w-full" />
      </RouterLink>

      <nav aria-label="Rechtliches" class="flex flex-col items-center gap-1.5 md:items-end">
        <RouterLink to="/werkstatt" class="text-white">Werkstatt</RouterLink>
        <RouterLink to="/anfrage" class="text-white">Anfrage</RouterLink>
        <RouterLink to="/impressum" class="text-white">Impressum</RouterLink>
        <RouterLink to="/datenschutz" class="text-white">Datenschutz</RouterLink>
        <span class="font-mono text-sm opacity-60">© {{ year }} Schüssele Präzision</span>
      </nav>

      <a
        :href="INSTAGRAM"
        target="_blank"
        rel="noopener"
        aria-label="Schüssele Präzision auf Instagram"
        class="mx-auto flex size-11 items-center justify-center text-white transition-colors hover:text-teal md:mx-0"
      >
        <svg viewBox="0 0 24 24" class="size-7" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  </footer>
</template>
