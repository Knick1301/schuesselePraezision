<script setup lang="ts">
import MillingMachine from '../components/MillingMachine.vue'
import V2Blatt from './V2Blatt.vue'
import V2Platzhalter from './V2Platzhalter.vue'
import { fliess, useV2, wrap } from './stil'

const { anfrage, kopf } = useV2()

const bilder = import.meta.glob<string>('./fotos/*.jpg', { eager: true, import: 'default' })
const bild = (name: string) => bilder[`./fotos/${name}.jpg`]

const fotos = [
  { label: 'Hermle UWF 1202 S', datei: 'hermle', gross: true },
  { label: 'Martin-Drehbank', datei: 'drehbank' },
  { label: 'Werkstück in der Fräsmaschine', datei: 'werkstueck' },
  { label: 'Werkbank mit Messgerät', datei: 'werkbank' },
  { label: 'Bohren in der Fräsmaschine', datei: 'bohren' },
  { label: 'Säulenbohrmaschine', datei: 'bohrmaschine' },
]

const schriftfeld = [
  { name: 'Benennung', wert: 'Werkstatt', breit: true },
  { name: 'Betrieb', wert: 'Schüssele Präzision', breit: false },
  { name: 'Ort', wert: 'Neuried', breit: false },
  { name: 'Inhaber', wert: 'Mirco Schüssele', breit: true },
]

const maschinen = [
  { verfahren: 'Fräsen', name: 'Hermle UWF 1202 S' },
  { verfahren: 'Drehen', name: '' },
  { verfahren: 'Messen / Prüfen', name: '' },
]
</script>

<template>
  <V2Blatt :zeilen="['A', 'B', 'C']">
    <section :class="wrap" class="pt-11 pb-[clamp(2.5rem,5vw,4rem)] lg:pt-14" aria-label="Werkstatt">
      <div class="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0">
        <div class="lg:col-start-1 lg:row-start-1">
          <h1 v-if="kopf === 'leiste'" class="m-0 mb-6 text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold">Werkstatt</h1>
          <p class="m-0 max-w-[34rem] text-[1.25rem] leading-snug text-navy/80 md:text-[1.375rem]" :class="fliess">
            So sieht es bei uns aus.
            <V2Platzhalter>Platzhalter: kurzer Satz zur Werkstatt, z. B. seit wann es den Betrieb gibt</V2Platzhalter>
          </p>
          <RouterLink :to="anfrage" class="mt-8 inline-flex min-h-12 items-center gap-2 bg-navy px-6 text-white no-underline transition-colors hover:bg-teal-dark">
            Zeichnung schicken <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <dl class="order-3 m-0 grid w-full max-w-[30rem] lg:order-none lg:col-start-1 lg:row-start-2 lg:mt-14 lg:self-start grid-cols-2 border border-navy/70 bg-white font-mono text-[0.8125rem] text-navy">
            <div
              v-for="(f, i) in schriftfeld"
              :key="f.name"
              class="px-3 py-2"
              :class="[f.breit ? 'col-span-2' : '', i > 0 ? 'border-t border-navy/70' : '', !f.breit && i % 2 === 1 ? 'border-r border-navy/70' : '']"
            >
              <dt class="text-[0.6875rem] text-navy/60">{{ f.name }}</dt>
              <dd class="m-0">{{ f.wert }}</dd>
            </div>
          </dl>
        <MillingMachine class="order-2 mx-auto h-auto w-full max-w-[40rem] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mr-0" />
      </div>
    </section>
  </V2Blatt>

  <section :class="wrap" class="pt-[clamp(2.5rem,5vw,4rem)]" aria-label="Fotos aus der Werkstatt">
      <div class="grid gap-5 md:grid-cols-3 md:grid-rows-[16rem_16rem_18rem]">
        <figure
          v-for="f in fotos"
          :key="f.label"
          class="m-0 flex flex-col"
          :class="f.gross ? 'h-72 md:col-span-2 md:row-span-2 md:h-auto' : 'h-72 md:h-auto'"
        >
          <div class="relative flex-1 overflow-hidden bg-navy/[0.06]">
            <img :src="bild(f.datei)" :alt="f.label" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover" />
          </div>
          <figcaption class="mt-2 text-[0.8125rem] text-navy/60">{{ f.label }}</figcaption>
        </figure>
      </div>
  </section>

  <section class="bg-white" aria-labelledby="maschinen-titel">
    <div :class="wrap" class="pt-[clamp(3rem,5vw,4.5rem)] pb-[clamp(3rem,6vw,5rem)]">
      <div class="grid gap-4 lg:grid-cols-[22.5rem_1fr] lg:items-baseline">
        <h2 id="maschinen-titel" class="m-0 text-[clamp(2.25rem,3.2vw,2.875rem)] leading-tight font-semibold tracking-[-0.03em]">Maschinen</h2>
        <p class="m-0 max-w-[40rem] text-[1.125rem] leading-snug text-navy/75 md:text-[1.1875rem]" :class="fliess">
          Damit Sie einschätzen können, ob Ihr Teil bei uns passt.
        </p>
      </div>

      <div class="mt-[clamp(2rem,3vw,2.5rem)] border-t border-navy/15">
        <div class="hidden grid-cols-[4rem_1fr_14rem_1fr] gap-6 border-b border-navy/15 py-3 text-[0.8125rem] text-navy/60 md:grid">
          <span>Pos.</span><span>Maschine</span><span>Verfahren</span><span>Arbeitsbereich</span>
        </div>
        <dl
          v-for="(m, i) in maschinen"
          :key="m.verfahren"
          class="m-0 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-1.5 border-b border-navy/15 py-5 md:grid-cols-[4rem_1fr_14rem_1fr] md:gap-6 md:py-6"
        >
          <dt class="text-[0.8125rem] text-navy/60 md:sr-only">Pos.</dt>
          <dd class="m-0 font-mono">{{ i + 1 }}</dd>
          <dt class="text-[0.8125rem] text-navy/60 md:sr-only">Maschine</dt>
          <dd class="m-0"><template v-if="m.name">{{ m.name }}</template><V2Platzhalter v-else>Platzhalter: Hersteller / Typ</V2Platzhalter></dd>
          <dt class="text-[0.8125rem] text-navy/60 md:sr-only">Verfahren</dt>
          <dd class="m-0 text-[1.125rem] font-semibold tracking-[-0.01em]">{{ m.verfahren }}</dd>
          <dt class="text-[0.8125rem] text-navy/60 md:sr-only">Arbeitsbereich</dt>
          <dd class="m-0"><V2Platzhalter>Platzhalter</V2Platzhalter></dd>
        </dl>
      </div>
    </div>
  </section>

  <section :class="wrap" class="flex flex-wrap items-center justify-between gap-6 py-[clamp(2.5rem,5vw,4rem)]">
    <p class="m-0 text-[1.25rem]" :class="fliess">Passt Ihr Teil? Schicken Sie uns die Zeichnung.</p>
    <RouterLink
      :to="anfrage"
      class="inline-flex min-h-12 items-center gap-2 bg-navy px-6 text-white no-underline transition-colors hover:bg-teal-dark"
    >Zum Anfrageformular <span aria-hidden="true">→</span></RouterLink>
  </section>
</template>
