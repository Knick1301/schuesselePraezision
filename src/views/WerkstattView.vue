<script setup lang="ts">
import { ref } from 'vue'
import SectionTitle from '../components/SectionTitle.vue'
import BildAnsicht from '../components/BildAnsicht.vue'
import PlaceholderText from '../components/PlaceholderText.vue'

const bilder = import.meta.glob<string>('../assets/fotos/*.jpg', { eager: true, import: 'default' })
const fotos = [
  { label: 'Hermle UWF 1202 S', datei: 'hermle', form: 'breit', pos: 'object-[50%_85%]' },
  { label: 'Mirco Schüssele und seine Hermle, liebevoll "Hermine" genannt', datei: 'mirco-hermle', form: 'hoch', pos: '' },
  { label: 'Herstellen einer Vorrichtung', datei: 'bohren', form: 'hoch', pos: '' },
  { label: 'Werkstattausstattung', datei: 'werkbank', form: 'breit', pos: 'object-[50%_85%]' },
  { label: 'Programmieren an der Steuerung', datei: 'programmieren', form: 'hoch', pos: 'object-[50%_70%]' },
  { label: 'Arbeiten an der Fräsmaschine', datei: 'an-der-hermle', form: 'hoch', pos: '' },
  { label: 'Vermessen der gefrästen Passung', datei: 'einrichten', form: 'hoch', pos: '' },
  { label: 'Martin-Drehbank', datei: 'drehbank', form: 'breit', pos: 'object-[50%_75%]' },
  { label: 'Alzmetall Bohrmaschinen', datei: 'bohrmaschine', form: 'hoch', pos: '' },
].map((f) => ({ ...f, src: bilder[`../assets/fotos/${f.datei}.jpg`] }))

const schriftfeld = [
  { name: 'Benennung', wert: 'Werkstatt', breit: true },
  { name: 'Betrieb', wert: 'Schüssele Präzision' },
  { name: 'Ort', wert: 'Neuried' },
  { name: 'Inhaber', wert: 'Mirco Schüssele', breit: true },
]

const maschinen = [
  { name: 'Hermle UWF 1202 S', verfahren: 'Fräsen', bereich: 'X 850 · Y 650 · Z 500 mm' },
  { name: 'Martin KM', verfahren: 'Drehen', bereich: 'Ø 400 mm · Länge 2000 mm' },
  { name: 'Bohrmaschine Alzmetall AB 3 ESV', verfahren: 'Bohren', bereich: '–' },
  { name: 'MAG-Schweißgerät', verfahren: 'Schweißen', bereich: '–' },
  { name: 'WIG-Schweißgerät', verfahren: 'Schweißen', bereich: '–' },
  { name: 'Messmittel', verfahren: 'Mess- und Prüftechnik', bereich: '–' },
  { name: 'Eisele Kaltkreissäge', verfahren: 'Sägen', bereich: '–' },
  { name: 'Forte Bandsäge', verfahren: 'Sägen', bereich: '–' },
  { name: 'Werkstattpresse hydraulisch 50Tonnen', verfahren: 'Pressen', bereich: '–' },
]

const ansicht = ref<number | null>(null)
const ansichtBilder = fotos.map((f) => ({ src: f.src!, text: f.label }))
</script>

<template>
  <section class="mx-auto max-w-wide px-pad pt-12 pb-14 md:pt-16 md:pb-20">
    <header class="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[minmax(0,46rem)_auto] lg:items-end lg:justify-between">
      <div>
        <SectionTitle class="mb-0">Werkstatt</SectionTitle>
        <p class="mt-5 max-w-[40rem] text-lg">
          So sieht es bei uns aus. <br />
          Hier entstehen aus Ideen präzise Werkstücke - mit moderner Technik, handwerklichem Können und Leidenschaft für
          die Zerspanung.
        </p>
      </div>
      <dl
        class="grid w-full max-w-[380px] grid-cols-2 border border-navy/70 bg-white font-mono text-[0.8rem] text-navy">
        <div v-for="(f, i) in schriftfeld" :key="f.name" class="px-3 py-1.5"
          :class="[f.breit ? 'col-span-2' : '', i > 0 ? 'border-t border-navy' : '', !f.breit && i % 2 === 1 ? 'border-r' : '']">
          <dt class="text-[0.72rem] tracking-[0.06em] uppercase opacity-75">{{ f.name }}</dt>
          <dd class="whitespace-nowrap">{{ f.wert }}</dd>
        </div>
      </dl>
    </header>

    <div class="grid gap-6 md:grid-cols-3">
      <figure v-for="f in fotos" :key="f.datei" class="flex flex-col" :class="{ 'md:col-span-2': f.form === 'breit' }">
        <button type="button" class="relative cursor-zoom-in overflow-hidden border border-navy bg-paper p-0" :class="{
          'aspect-[4/3] md:aspect-auto md:flex-1': f.form === 'breit',
          'aspect-[3/4]': f.form === 'hoch',
        }" @click="ansicht = fotos.indexOf(f)">
          <span class="sr-only">{{ f.label }} vergrößern</span>
          <img :src="f.src" :alt="f.label" loading="lazy" decoding="async"
            class="absolute inset-0 size-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            :class="f.pos" />
        </button>
        <figcaption class="mt-2 font-mono text-xs text-navy/60">{{ f.label }}</figcaption>
      </figure>
    </div>
    <BildAnsicht v-model="ansicht" :bilder="ansichtBilder" />
  </section>

  <section id="maschinen" class="border-y border-navy/15 bg-paper" aria-labelledby="maschinen-title">
    <div class="mx-auto max-w-wide px-pad py-14 md:py-20">
      <header class="mb-10 max-w-[46rem] lg:mb-14">
        <SectionTitle id="maschinen-title" class="mb-0">Maschinen</SectionTitle>
      </header>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[640px] border-collapse border border-navy bg-white">
          <caption class="sr-only">Maschinen von Schüssele Präzision</caption>
          <thead class="bg-paper font-mono text-xs tracking-[0.08em] uppercase">
            <tr class="border-b border-navy text-left">
              <th scope="col" class="p-4 font-normal">Pos.</th>
              <th scope="col" class="p-4 font-normal">Maschine</th>
              <th scope="col" class="p-4 font-normal">Verfahren</th>
              <th scope="col" class="p-4 font-normal">Arbeitsbereich</th>
            </tr>
          </thead>
          <tbody class="align-top [&_td]:p-4 [&_tr]:border-b [&_tr]:border-navy/20">
            <tr v-for="(m, i) in maschinen" :key="i">
              <td class="w-16 font-mono text-sm">{{ i + 1 }}</td>
              <td>{{ m.name }}</td>
              <td>{{ m.verfahren }}</td>
              <td class="font-mono text-sm">{{ m.bereich }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-6 px-pad py-14 md:py-16">
    <p class="text-lg">Präzision beginnt mit Ihrer Anfrage!</p>
    <RouterLink to="/anfrage"
      class="inline-flex min-h-[2.9rem] items-center justify-center border border-navy bg-navy px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:border-teal-dark hover:bg-teal-dark">
      Jetzt Fertigungsanfrage stellen</RouterLink>
  </section>
</template>
