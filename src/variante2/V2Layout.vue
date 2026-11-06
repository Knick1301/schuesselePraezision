<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import V2Kopf from './V2Kopf.vue'
import V2Fuss from './V2Fuss.vue'

const route = useRoute()
const startseite = computed(() => route.meta.start === true)
</script>

<template>
  <div class="font-sans text-navy">
    <a
      href="#inhalt"
      class="absolute -top-12 left-4 z-[100] bg-navy px-4 py-2 text-white no-underline focus:top-4"
    >Zum Inhalt springen</a>
    <V2Kopf v-if="!startseite" />
    <main id="inhalt">
      <RouterView />
    </main>
    <V2Fuss />
  </div>
</template>
