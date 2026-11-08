<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ bilder: { src: string; text: string }[] }>()
const index = defineModel<number | null>({ default: null })
const dialog = ref<HTMLDialogElement>()

watch(index, async (i) => {
  await nextTick()
  if (i === null) dialog.value?.close()
  else if (!dialog.value?.open) dialog.value?.showModal()
})

const schliessen = () => (index.value = null)
const blaettern = (schritt: number) => {
  if (index.value === null) return
  const n = props.bilder.length
  index.value = (index.value + schritt + n) % n
}
const taste = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') blaettern(1)
  if (e.key === 'ArrowLeft') blaettern(-1)
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-0 h-dvh max-h-none w-screen max-w-none bg-navy/95 p-0 text-white backdrop:bg-transparent"
    aria-label="Bildansicht"
    @close="schliessen"
    @keydown="taste"
    @click.self="schliessen"
  >
    <div v-if="index !== null" class="flex h-full flex-col" @click.self="schliessen">
      <div class="flex items-center justify-between px-pad py-3">
        <span class="font-mono text-sm text-white/70">{{ index + 1 }} / {{ bilder.length }}</span>
        <button type="button" class="flex size-11 cursor-pointer items-center justify-center" @click="schliessen">
          <span class="sr-only">Schließen</span>
          <span class="relative block size-6" aria-hidden="true">
            <span class="absolute top-1/2 left-0 h-[2px] w-full rotate-45 bg-white" />
            <span class="absolute top-1/2 left-0 h-[2px] w-full -rotate-45 bg-white" />
          </span>
        </button>
      </div>

      <figure class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-pad pb-6" @click.self="schliessen">
        <img :src="bilder[index]!.src" :alt="bilder[index]!.text" class="max-h-full max-w-full min-h-0 object-contain" />
        <figcaption class="font-mono text-sm text-white/80">{{ bilder[index]!.text }}</figcaption>
      </figure>

      <button
        v-if="bilder.length > 1"
        type="button"
        class="absolute top-1/2 left-2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-navy/60 text-2xl md:left-6"
        @click="blaettern(-1)"
      >
        <span class="sr-only">Vorheriges Bild</span><span aria-hidden="true">←</span>
      </button>
      <button
        v-if="bilder.length > 1"
        type="button"
        class="absolute top-1/2 right-2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center bg-navy/60 text-2xl md:right-6"
        @click="blaettern(1)"
      >
        <span class="sr-only">Nächstes Bild</span><span aria-hidden="true">→</span>
      </button>
    </div>
  </dialog>
</template>
