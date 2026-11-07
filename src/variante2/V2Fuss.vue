<script setup lang="ts">
import BrandLogo from '../components/BrandLogo.vue'
import { MAIL, TEL, TEL_LINK, useV2 } from './stil'

const { basis, pfad } = useV2()
const jahr = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy py-6 text-[0.95rem] text-white/80 md:py-7">
    <div class="mx-auto grid max-w-wide items-center gap-6 px-pad text-center md:grid-cols-[1fr_auto_1fr] md:gap-14 md:text-left">
      <div class="space-y-3">
        <p class="m-0">Mirco Schüssele<br />Vogesenstraße 1<br />77743 Neuried</p>
        <p class="m-0 flex flex-col gap-1.5 font-mono md:items-start">
          <a :href="TEL_LINK" class="text-white">{{ TEL }}</a>
          <a :href="`mailto:${MAIL}`" class="text-white">{{ MAIL }}</a>
        </p>
      </div>

      <RouterLink :to="basis" aria-label="Schüssele Präzision – Startseite" class="order-first mx-auto block w-40 md:order-none md:w-44">
        <BrandLogo variant="full" tone="dark" class="h-auto w-full" />
      </RouterLink>

      <nav aria-label="Rechtliches" class="flex flex-col items-center gap-1.5 md:items-end">
        <RouterLink :to="pfad('/werkstatt')" class="text-white">Werkstatt</RouterLink>
        <RouterLink :to="pfad('/anfrage')" class="text-white">Anfrage</RouterLink>
        <RouterLink :to="pfad('/impressum')" class="text-white">Impressum</RouterLink>
        <RouterLink :to="pfad('/datenschutz')" class="text-white">Datenschutz</RouterLink>
        <span class="font-mono text-sm opacity-60">© {{ jahr }} Schüssele Präzision</span>
      </nav>
    </div>
  </footer>
</template>
