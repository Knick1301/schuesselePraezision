<script setup lang="ts">
import SectionTitle from '../components/SectionTitle.vue'
import PlaceholderText from '../components/PlaceholderText.vue'
import PhotoPlaceholder from '../components/PhotoPlaceholder.vue'

const maschinen = [
  { verfahren: 'Fräsen' },
  { verfahren: 'Drehen' },
  { verfahren: 'Messen / Prüfen' },
]
</script>

<template>
  <section class="mx-auto max-w-wide px-pad pt-12 pb-14 md:pt-16 md:pb-20">
    <header class="mb-10 max-w-[46rem] lg:mb-14">
      <SectionTitle class="mb-0">Werkstatt</SectionTitle>
      <p class="mt-5 max-w-[40rem] text-lg">
        So sieht es bei uns aus.
        <PlaceholderText>Platzhalter: kurzer Satz zur Werkstatt, z. B. seit wann es den Betrieb gibt</PlaceholderText>
      </p>
    </header>

    <div class="grid gap-6 md:grid-cols-3 md:grid-rows-[16rem_16rem_18rem]">
      <PhotoPlaceholder label="CNC-Fräsmaschine, Arbeitsraum" class="h-72 md:col-span-2 md:row-span-2 md:h-auto" />
      <PhotoPlaceholder label="Drehteile aus der Fertigung" class="h-56 md:h-auto" />
      <PhotoPlaceholder label="Mirco Schüssele an der Maschine" class="h-56 md:h-auto" />
      <PhotoPlaceholder label="Messen und Prüfen" class="h-56 md:h-auto" />
      <PhotoPlaceholder label="Werkzeuge und Spannmittel" class="h-56 md:h-auto" />
      <PhotoPlaceholder label="Werkstatt von außen" class="h-56 md:h-auto" />
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
              <td><PlaceholderText>Platzhalter: Hersteller / Typ</PlaceholderText></td>
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
