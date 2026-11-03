<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a
    href="#inhalt"
    class="absolute -top-12 left-4 z-[100] bg-navy px-4 py-2 text-white no-underline focus:top-4"
  >Zum Inhalt springen</a>
  <SiteHeader />
  <main id="inhalt">
    <RouterView />
  </main>
  <SiteFooter />
</template>
