<script setup lang="ts">
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
</script>

<template>
  <RouterView v-if="route.meta.eigenesLayout" />
  <template v-else>
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
</template>
