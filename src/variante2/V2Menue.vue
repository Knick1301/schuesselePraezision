<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fliess, TEL, TEL_LINK, useV2 } from './stil'

defineProps<{ hell?: boolean }>()

const route = useRoute()
const { basis, nav, anfrage } = useV2()
const offen = ref(false)

watch(offen, (o) => document.documentElement.classList.toggle('overflow-hidden', o))
watch(() => route.fullPath, () => (offen.value = false))

const beiEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') offen.value = false
}
onMounted(() => window.addEventListener('keydown', beiEscape))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', beiEscape)
  document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <button
    type="button"
    class="-mr-3 flex min-h-12 cursor-pointer items-center gap-2.5 px-3 text-[1rem] lg:hidden"
    :class="hell ? 'text-navy' : 'text-white'"
    aria-controls="v2-menue"
    :aria-expanded="offen"
    @click="offen = true"
  >
    Menü
    <span class="flex w-5 flex-col gap-[5px]" aria-hidden="true">
      <span class="h-px" :class="hell ? 'bg-navy' : 'bg-white'"></span><span class="h-px" :class="hell ? 'bg-navy' : 'bg-white'"></span>
    </span>
  </button>

  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
    >
      <div
        v-if="offen"
        id="v2-menue"
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
        class="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy px-5 pt-3 pb-8 font-sans text-white lg:hidden"
      >
        <div class="flex items-center justify-between">
          <RouterLink :to="basis" class="text-[1.125rem] tracking-[-0.03em] text-white no-underline" @click="offen = false">SCHÜSSELE</RouterLink>
          <button
            type="button"
            class="-mr-3 flex min-h-12 cursor-pointer items-center gap-2.5 px-3 text-[1rem] text-white"
            @click="offen = false"
          >
            Schließen
            <span class="relative block size-4" aria-hidden="true">
              <span class="absolute top-1/2 left-0 h-px w-full rotate-45 bg-white"></span>
              <span class="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-white"></span>
            </span>
          </button>
        </div>

        <nav aria-label="Hauptnavigation" class="mt-10">
          <ul class="m-0 list-none border-t border-white/45 p-0">
            <li v-for="n in nav" :key="n.label" class="border-b border-white/45">
              <RouterLink
                :to="n.to"
                class="flex min-h-16 items-center justify-between text-[1.75rem] tracking-[-0.02em] text-white no-underline"
                @click="offen = false"
              >
                <span>{{ n.label }}</span><span class="text-[0.875rem] text-white/60 font-mono">{{ n.nr }}</span>
              </RouterLink>
            </li>
            <li class="border-b border-white/45">
              <RouterLink
                :to="anfrage"
                class="flex min-h-16 items-center justify-between text-[1.75rem] tracking-[-0.02em] text-white no-underline"
                @click="offen = false"
              >
                <span>Anfrage</span><span class="text-[1.25rem]" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <div class="mt-auto pt-12">
          <a :href="TEL_LINK" class="block font-mono text-[1.75rem] text-[#74d3de] no-underline">{{ TEL }}</a>
          <p class="mt-2 mb-0 text-[1rem] text-white/80" :class="fliess">Vogesenstraße 1 · 77743 Neuried</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
