<script setup lang="ts">
import BrandLogo from './BrandLogo.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy py-6 text-[0.95rem] text-white/80 md:py-7">
    <!-- drei Spalten: links Adresse & Kontakt, Mitte Logo, rechts Rechtliches (mobil untereinander, Logo zuerst) -->
    <div class="mx-auto grid max-w-wrap items-center gap-6 px-pad text-center md:grid-cols-[1fr_auto_1fr] md:gap-14 md:text-left">
      <!-- links -->
      <div class="space-y-3">
        <p>Mirco Schüssele<br />Vogesenstraße 1<br />77743 Neuried</p>
        <p class="flex flex-col gap-1.5 font-mono md:items-start">
          <a href="tel:+4917622759201" class="text-white">0176 22 75 92 01</a>
          <a href="mailto:info@schuessele-praezision.de" class="text-white">info@schuessele-praezision.de</a>
        </p>
      </div>

      <!-- Mitte: komplettes Logo wie auf der Visitenkarte -->
      <RouterLink
        to="/"
        aria-label="Schüssele Präzision – Startseite"
        class="order-first mx-auto block w-40 md:order-none md:w-44"
      >
        <BrandLogo variant="full" tone="dark" class="h-auto w-full" />
      </RouterLink>

      <!-- rechts -->
      <nav aria-label="Rechtliches" class="flex flex-col items-center gap-1.5 md:items-end">
        <RouterLink to="/anfrage" class="text-white">Anfrage</RouterLink>
        <RouterLink to="/impressum" class="text-white">Impressum</RouterLink>
        <RouterLink to="/datenschutz" class="text-white">Datenschutz</RouterLink>
        <span class="font-mono text-sm opacity-60">© {{ year }} Schüssele Präzision</span>
      </nav>
    </div>
  </footer>
</template>
