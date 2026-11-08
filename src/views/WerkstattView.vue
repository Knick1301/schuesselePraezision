<script setup lang="ts">
import SectionTitle from '../components/SectionTitle.vue'
import PlaceholderText from '../components/PlaceholderText.vue'

const bilder = import.meta.glob<string>('../assets/fotos/*.jpg', { eager: true, import: 'default' })
const fotos = [
  { label: 'Hermle UWF 1202 S', datei: 'hermle', gross: true },
  { label: 'Martin-Drehbank', datei: 'drehbank' },
  { label: 'An der Fräsmaschine', datei: 'mitarbeiter' },
  { label: 'Werkbank mit Messgerät', datei: 'werkbank' },
  { label: 'Bohren in der Fräsmaschine', datei: 'bohren' },
  { label: 'Säulenbohrmaschine', datei: 'bohrmaschine' },
].map((f) => ({ ...f, src: bilder[`../assets/fotos/${f.datei}.jpg`] }))

const schriftfeld = [
  { name: 'Benennung', wert: 'Werkstatt', breit: true },
  { name: 'Betrieb', wert: 'Schüssele Präzision' },
  { name: 'Ort', wert: 'Neuried' },
  { name: 'Inhaber', wert: 'Mirco Schüssele' },
  { name: 'Mitarbeiter', wert: 'Jannik Enderle' },
]

const maschinen = [
  { verfahren: 'Fräsen', name: 'Hermle UWF 1202 S' },
  { verfahren: 'Drehen', name: '' },
  { verfahren: 'Messen / Prüfen', name: '' },
]
</script>

<template>
  <section class="mx-auto max-w-wide px-pad pt-12 pb-14 md:pt-16 md:pb-20">
    <header class="mb-10 grid gap-8 lg:mb-14 lg:grid-cols-[minmax(0,46rem)_auto] lg:items-end lg:justify-between">
      <div>
        <SectionTitle class="mb-0">Werkstatt</SectionTitle>
        <p class="mt-5 max-w-[40rem] text-lg">
          So sieht es bei uns aus.
          <PlaceholderText>Platzhalter: kurzer Satz zur Werkstatt, z. B. seit wann es den Betrieb gibt</PlaceholderText>
        </p>
      </div>
      <dl class="grid w-full max-w-[380px] grid-cols-2 border border-navy/70 bg-white font-mono text-[0.8rem] text-navy">
        <div
          v-for="(f, i) in schriftfeld"
          :key="f.name"
          class="px-3 py-1.5"
          :class="[f.breit ? 'col-span-2' : '', i > 0 ? 'border-t border-navy' : '', !f.breit && i % 2 === 1 ? 'border-r' : '']"
        >
          <dt class="text-[0.72rem] tracking-[0.06em] uppercase opacity-75">{{ f.name }}</dt>
          <dd class="whitespace-nowrap">{{ f.wert }}</dd>
        </div>
      </dl>
    </header>

    <div class="grid gap-6 md:grid-cols-3 md:grid-rows-[16rem_16rem_18rem]">
      <figure
        v-for="f in fotos"
        :key="f.datei"
        class="flex flex-col"
        :class="f.gross ? 'h-72 md:col-span-2 md:row-span-2 md:h-auto' : 'h-72 md:h-auto'"
      >
        <div class="relative flex-1 overflow-hidden border border-navy bg-paper">
          <img :src="f.src" :alt="f.label" loading="lazy" decoding="async" class="absolute inset-0 size-full object-cover" />
        </div>
        <figcaption class="mt-2 font-mono text-xs text-navy/60">{{ f.label }}</figcaption>
      </figure>
    </div>
  </section>

  <section class="border-y border-navy/15 bg-paper" aria-labelledby="maschinen-title">
    <div class="mx-auto max-w-wide px-pad py-14 md:py-20">
      <header class="mb-10 max-w-[46rem] lg:mb-14">
        <SectionTitle id="maschinen-title" class="mb-0">Maschinen</SectionTitle>
        <p class="mt-5 max-w-[40rem] text-lg">
          Damit Sie einschätzen können, ob Ihr Teil bei uns passt.
        </p>
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
              <td><template v-if="m.name">{{ m.name }}</template><PlaceholderText v-else>Platzhalter: Hersteller / Typ</PlaceholderText></td>
              <td>{{ m.verfahren }}</td>
              <td class="font-mono text-sm"><PlaceholderText>Platzhalter</PlaceholderText></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="mx-auto flex max-w-wide flex-wrap items-center justify-between gap-6 px-pad py-14 md:py-16">
    <p class="text-lg">Passt Ihr Teil? Schicken Sie uns die Zeichnung.</p>
    <RouterLink
      to="/anfrage"
      class="inline-flex min-h-[2.9rem] items-center justify-center border border-navy bg-navy px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:border-teal-dark hover:bg-teal-dark"
    >Zum Anfrageformular</RouterLink>
  </section>
</template>
