<script setup lang="ts">
import BrandLogo from '../components/BrandLogo.vue'
import V2Menue from './V2Menue.vue'
import { TEL, TEL_LINK, useV2, wrap } from './stil'

const { basis, nav, anfrage } = useV2()
</script>

<template>
  <header class="bg-navy text-white">
    <div :class="wrap" class="flex min-h-20 items-center justify-between gap-8 lg:min-h-25">
      <RouterLink :to="basis" aria-label="Schüssele Präzision – Startseite" class="flex items-center gap-3 py-2 no-underline">
        <BrandLogo variant="mark" tone="dark" class="h-11 w-auto shrink-0 lg:h-20" aria-hidden="true" />
        <span class="flex flex-col items-center font-brand text-lg leading-[1.1] lg:text-2xl">
          <span class="font-extrabold tracking-[0.06em] text-white">SCHÜSSELE</span>
          <span class="-mr-[0.3em] text-[0.78em] font-normal tracking-[0.3em] text-teal">PRÄZISION</span>
        </span>
      </RouterLink>

      <nav aria-label="Hauptnavigation" class="hidden lg:block">
        <ul class="m-0 flex list-none items-center gap-9 p-0 text-[1.0625rem]">
          <li v-for="n in nav" :key="n.label">
            <RouterLink :to="n.to" class="text-white no-underline hover:text-[#74d3de]" exact-active-class="!text-[#74d3de]">{{ n.label }}</RouterLink>
          </li>
          <li>
            <RouterLink :to="anfrage" class="text-white no-underline hover:text-[#74d3de]" exact-active-class="!text-[#74d3de]">Anfrage</RouterLink>
          </li>
          <li class="border-l border-white/30 pl-9">
            <a :href="TEL_LINK" class="font-mono text-white no-underline hover:underline">{{ TEL }}</a>
          </li>
        </ul>
      </nav>

      <V2Menue />
    </div>
  </header>
</template>
