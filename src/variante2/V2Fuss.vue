<script setup lang="ts">
import V2Mark from './V2Mark.vue'
import { MAIL, fliess, TEL, TEL_LINK, useV2, wrap } from './stil'

const { basis, pfad } = useV2()
const jahr = new Date().getFullYear()
</script>

<template>
  <footer class="bg-navy text-white">
    <div :class="wrap" class="pt-[clamp(3.5rem,8vw,7.5rem)] pb-[clamp(2rem,3vw,3rem)]">
      <p class="m-0 text-[0.875rem] text-[#74d3de]">Anfrage</p>
      <p class="mt-5 mb-0 flex flex-col leading-[1.1] tracking-[-0.035em]">
        <a :href="TEL_LINK" class="block font-mono text-[min(8.6vw,4.5rem)] whitespace-nowrap text-[#74d3de] no-underline hover:underline lg:order-2 lg:text-[clamp(1.75rem,4.4vw,4rem)]">{{ TEL }}</a>
        <a :href="`mailto:${MAIL}`" class="mt-3 block font-mono text-[4.6vw] whitespace-nowrap text-white no-underline hover:underline lg:order-1 lg:mt-0 lg:text-[clamp(1.75rem,4.4vw,4rem)]">{{ MAIL }}</a>
      </p>

      <div class="mt-[clamp(3rem,5vw,4.5rem)] grid items-center gap-6 border-t border-white/15 pt-8 md:grid-cols-[1fr_auto_1fr]">
        <RouterLink :to="basis" aria-label="Schüssele Präzision – Startseite" class="flex w-fit items-center gap-2 text-white no-underline">
          <V2Mark class="h-12 w-auto text-[#1fa9ba]" />
          <span class="flex flex-col leading-none">
            <span class="text-[1.125rem] font-extrabold tracking-[-0.01em]">SCHÜSSELE</span>
            <span class="mt-1 text-[0.6rem] tracking-[0.3em] text-[#1fa9ba]">·PRÄZISION·</span>
          </span>
        </RouterLink>
        <p class="m-0 text-[1.0625rem] text-white/85" :class="fliess">Mirco Schüssele<span class="hidden md:inline"> · </span><br class="md:hidden" />Vogesenstraße 1 · 77743 Neuried</p>
        <p class="m-0 text-[0.8125rem] text-white/75 md:text-right">
          <RouterLink :to="pfad('/impressum')" class="text-white/75 no-underline hover:underline">Impressum</RouterLink>
          ·
          <RouterLink :to="pfad('/datenschutz')" class="text-white/75 no-underline hover:underline">Datenschutz</RouterLink>
          <span class="mt-1 block text-white/50 md:mt-0 md:ml-3 md:inline">© {{ jahr }} Schüssele Präzision</span>
        </p>
      </div>
    </div>
  </footer>
</template>
