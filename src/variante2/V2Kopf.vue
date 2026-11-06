<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import V2Mark from './V2Mark.vue'
import V2Menue from './V2Menue.vue'
import { TEL, TEL_LINK, useV2, wrap } from './stil'

const route = useRoute()
const { basis, kopf, nav, anfrage } = useV2()
const titel = computed(() => (route.meta.title as string | undefined) ?? '')
const hell = computed(() => kopf.value === 'weiss')
</script>

<template>
  <header v-if="kopf === 'leiste'">
    <div class="bg-navy text-white">
      <div :class="wrap" class="flex min-h-20 items-center justify-between gap-8 lg:min-h-24">
        <RouterLink :to="basis" aria-label="Schüssele Präzision – Startseite" class="flex items-center gap-2.5 text-white no-underline">
          <V2Mark class="h-10 w-auto text-[#1fa9ba] lg:h-12" />
          <span class="flex flex-col leading-none">
            <span class="text-[1.125rem] font-extrabold tracking-[-0.01em] lg:text-[1.25rem]">SCHÜSSELE</span>
            <span class="mt-1 text-[0.6rem] tracking-[0.3em] text-[#1fa9ba]">·PRÄZISION·</span>
          </span>
        </RouterLink>

        <nav aria-label="Hauptnavigation" class="hidden lg:block">
          <ul class="m-0 flex list-none items-center gap-9 p-0 text-[1.0625rem]">
            <li v-for="n in nav" :key="n.label">
              <RouterLink :to="n.to" class="text-white no-underline hover:text-[#74d3de]" exact-active-class="!text-[#74d3de]">{{ n.label }}</RouterLink>
            </li>
            <li>
              <RouterLink :to="anfrage" class="text-[#74d3de] no-underline hover:underline">Anfrage →</RouterLink>
            </li>
            <li class="border-l border-white/30 pl-9">
              <a :href="TEL_LINK" class="text-white no-underline font-mono hover:underline">{{ TEL }}</a>
            </li>
          </ul>
        </nav>

        <V2Menue />
      </div>
    </div>
  </header>

  <header v-else :class="hell ? 'bg-white text-navy' : 'bg-navy text-white'">
    <div
      :class="[wrap, hell ? 'pb-8 lg:pt-[clamp(2rem,3.9vw,3.5rem)] lg:pb-12' : 'pb-7 lg:pt-8 lg:pb-9']"
      class="pt-3 lg:flex lg:items-start lg:justify-between lg:gap-12"
    >
      <div>
        <div class="flex items-center justify-between">
          <RouterLink
            :to="basis"
            aria-label="Schüssele Präzision – Startseite"
            class="flex min-h-12 items-center gap-2.5 no-underline"
            :class="hell ? 'text-navy' : 'text-white'"
          >
            <V2Mark class="h-10 w-auto text-[#1fa9ba]" />
            <span class="flex flex-col leading-none">
              <span class="text-[1.125rem] font-extrabold tracking-[-0.01em]">SCHÜSSELE</span>
              <span class="mt-1 text-[0.6rem] tracking-[0.3em]" :class="hell ? 'text-teal-dark' : 'text-[#1fa9ba]'">·PRÄZISION·</span>
            </span>
          </RouterLink>
          <V2Menue :hell="hell" />
        </div>

        <h1
          class="m-0 leading-[0.95] font-semibold tracking-[-0.045em]"
          :class="hell
            ? 'mt-8 text-[clamp(3rem,13vw,6.5rem)] lg:mt-10 lg:text-[clamp(4rem,7vw,6.5rem)]'
            : 'mt-6 text-[clamp(2.75rem,12vw,5.5rem)] lg:mt-6 lg:text-[clamp(3.5rem,6vw,5.5rem)]'"
        >
          {{ titel }}
        </h1>
      </div>

      <nav aria-label="Hauptnavigation" class="hidden w-[18.75rem] shrink-0 lg:block">
        <ul class="m-0 list-none border-t p-0" :class="hell ? 'border-navy/20' : 'border-white/35'">
          <li v-for="n in nav" :key="n.label" class="border-b" :class="hell ? 'border-navy/20' : 'border-white/35'">
            <RouterLink
              :to="n.to"
              class="flex items-center justify-between px-[1.875rem] no-underline transition-colors"
              :class="hell
                ? 'py-3.5 text-[1.0625rem] text-navy hover:bg-navy/[0.04]'
                : 'py-2.5 text-[1rem] text-white hover:bg-white/10'"
              :exact-active-class="hell ? '!text-teal-dark' : '!text-[#74d3de]'"
            >
              <span>{{ n.label }}</span><span class="font-mono">{{ n.nr }}</span>
            </RouterLink>
          </li>
          <li class="border-b" :class="hell ? 'border-navy/20' : 'border-white/35'">
            <RouterLink
              :to="anfrage"
              class="flex items-center justify-between px-[1.875rem] no-underline transition-colors"
              :class="hell
                ? 'py-3.5 text-[1.0625rem] text-teal-dark hover:bg-navy/[0.04]'
                : 'py-2.5 text-[1rem] text-[#74d3de] hover:bg-white/10'"
            >
              <span>Anfrage</span><span aria-hidden="true">→</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
