<script setup lang="ts">
import { ref } from 'vue'
import MillingMachine from '../components/MillingMachine.vue'
import SectionTitle from '../components/SectionTitle.vue'
import PlaceholderText from '../components/PlaceholderText.vue'

const mapLoaded = ref(false)
const mapSrc =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('Vogesenstraße 1, 77743 Neuried') +
  '&output=embed'

const titleBlock = [
  { label: 'Betrieb', value: 'Schüssele Präzision' },
  { label: 'Ort', value: 'Neuried' },
]
</script>

<template>

  <!-- Ab Desktop fast so hoch wie das Fenster; unten bleiben ca. 9rem frei, damit der nächste Abschnitt hereinschaut -->
  <section class="border-b border-navy/20 bg-paper bg-grid p-3 lg:flex lg:min-h-[min(calc(100svh-15rem),56rem)] lg:flex-col lg:p-5" aria-labelledby="hero-title">
    <!-- Blattrahmen (doppelte Linie) mit Zonen am Rand -->
    <div class="relative m-[5px] border border-navy/45 outline outline-offset-[5px] outline-navy/20 lg:flex lg:flex-1 lg:items-center">
      <span aria-hidden="true"
        class="pointer-events-none absolute top-1.5 right-0 left-8 flex font-mono text-[0.65rem] text-navy/50">
        <i v-for="n in 6" :key="n" class="flex-1 text-center not-italic">{{ n }}</i>
      </span>
      <span aria-hidden="true"
        class="pointer-events-none absolute top-8 bottom-0 left-2 flex flex-col font-mono text-[0.65rem] text-navy/50">
        <i v-for="z in ['A', 'B', 'C']" :key="z" class="flex flex-1 items-center not-italic">{{ z }}</i>
      </span>


      <div
        class="mx-auto w-full max-w-[1600px] px-pad pt-11 pb-6 lg:flex lg:items-center lg:justify-between lg:gap-16 lg:pt-12 lg:pb-8">
        <div class="max-w-[34rem] lg:w-[30rem] lg:shrink-0">
          <h1 id="hero-title"
            class="mb-[0.4em] text-[clamp(1.9rem,5vw,3rem)] leading-tight font-semibold tracking-[-0.01em] text-balance">
            CNC-Drehen <span class="whitespace-nowrap">und -Fräsen</span> in&nbsp;Neuried
          </h1>
          <p class="mb-7 max-w-[30rem] text-[clamp(1rem,2.2vw,1.2rem)]">
            Dreh- und Frästeile aus Metall nach Ihrer Zeichnung.
            Inhabergeführt von Mirco Schüssele.
          </p>
          <div class="flex flex-wrap gap-3">
            <RouterLink to="/anfrage"
              class="inline-flex min-h-[2.9rem] items-center justify-center border border-navy bg-navy px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:border-teal-dark hover:bg-teal-dark">Zum
              Anfrageformular</RouterLink>
            <a href="mailto:info@schuessele-praezision.de?subject=Anfrage"
              class="inline-flex min-h-[2.9rem] items-center justify-center border border-navy bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-navy no-underline transition-colors hover:bg-navy hover:text-white">Zeichnung
              per E-Mail</a>
          </div>
        </div>

        <div class="mt-14 flex flex-col lg:mt-0 lg:w-[56%] lg:max-w-[980px] 2xl:w-[62%]">
          <MillingMachine class="mb-2 h-auto w-full" />

          <dl class="ml-auto grid w-full max-w-[340px] grid-cols-2 border border-navy bg-white font-mono text-[0.7rem]">
            <div class="col-span-2 px-2 py-1">
              <dt class="text-[0.6rem] tracking-[0.08em] uppercase opacity-60">Benennung</dt>
              <dd>Universal-Fräsmaschine</dd>
            </div>
            <div v-for="(f, i) in titleBlock" :key="f.label" class="border-t border-navy px-2 py-1"
              :class="i === 0 && 'border-r'">
              <dt class="text-[0.6rem] tracking-[0.08em] uppercase opacity-60">{{ f.label }}</dt>
              <dd class="whitespace-nowrap">{{ f.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>


  <section id="leistungen" class="mx-auto max-w-wrap px-pad py-14 md:pt-14 md:pb-16" aria-labelledby="leistungen-title">
    <header class="mb-10 max-w-[640px]">
      <SectionTitle id="leistungen-title">Was wir machen</SectionTitle>
      <p>
        Wir fertigen Teile aus Metall auf CNC-Dreh- und Fräsmaschinen. Sie schicken die
        Zeichnung, wir sagen Ihnen, ob und wann wir es machen können.
      </p>
    </header>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[560px] border-collapse border border-navy">
        <caption class="sr-only">Leistungen von Schüssele Präzision</caption>
        <thead class="bg-paper font-mono text-xs tracking-[0.08em] uppercase">
          <tr class="border-b border-navy text-left">
            <th scope="col" class="p-4 font-normal">Verfahren</th>
            <th scope="col" class="p-4 font-normal">Typische Teile</th>
            <th scope="col" class="p-4 font-normal">Arbeitsbereich</th>
          </tr>
        </thead>
        <tbody class="align-top [&_td]:p-4 [&_th]:p-4 [&_tr]:border-b [&_tr]:border-navy/20">
          <tr>
            <th scope="row" class="w-[22%] text-left font-semibold">Drehen</th>
            <td>Wellen, Bolzen, Buchsen, Flansche – alles, was rund ist.</td>
            <td class="font-mono text-sm whitespace-nowrap">
              Ø max. <PlaceholderText>Platzhalter</PlaceholderText> mm<br />
              Länge max. <PlaceholderText>Platzhalter</PlaceholderText> mm
            </td>
          </tr>
          <tr>
            <th scope="row" class="text-left font-semibold">Fräsen</th>
            <td>Platten, Halter, Gehäuse, Taschen und Bohrbilder.</td>
            <td class="font-mono text-sm whitespace-nowrap">
              X / Y / Z <PlaceholderText>Platzhalter</PlaceholderText> mm<br />
              Achsen: <PlaceholderText>Platzhalter</PlaceholderText>
            </td>
          </tr>
          <tr>
            <th scope="row" class="text-left font-semibold">Metall&shy;bearbeitung</th>
            <td>
              <PlaceholderText>Platzhalter: z. B. Sägen, Bohren, Gewinde schneiden – beim Kunden erfragen
              </PlaceholderText>
            </td>
            <td class="font-mono text-sm">–</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-12 grid gap-8 md:grid-cols-3">
      <div>
        <h3 class="mb-1.5 text-[1.05rem] font-semibold">Werkstoffe</h3>
        <p>
          <PlaceholderText>Platzhalter: z. B. Stahl, Edelstahl, Aluminium, Messing, Kunststoff</PlaceholderText>
        </p>
      </div>
      <div>
        <h3 class="mb-1.5 text-[1.05rem] font-semibold">Stückzahlen</h3>
        <p>
          <PlaceholderText>Platzhalter: z. B. ab 1 Stück bis … Stück</PlaceholderText>
        </p>
      </div>
      <div>
        <h3 class="mb-1.5 text-[1.05rem] font-semibold">Was wir nicht machen</h3>
        <p>
          <PlaceholderText>Platzhalter: beim Kunden erfragen, z. B. Großserien, Schweißen, Beschichten</PlaceholderText>
        </p>
      </div>
    </div>
  </section>

  <!-- Kontakt -->
  <section id="kontakt" class="mx-auto max-w-wrap border-t border-navy/15 px-pad py-14 md:pt-16 md:pb-24" aria-labelledby="kontakt-title">
    <SectionTitle id="kontakt-title" class="mb-10">Kontakt</SectionTitle>

    <div class="grid gap-8 nav:grid-cols-[1fr_1.4fr] nav:gap-16">
      <address class="space-y-4 not-italic">
        <p>
          <strong>Schüssele Präzision</strong><br />
          Mirco Schüssele<br />
          Vogesenstraße 1<br />
          77743 Neuried
        </p>
        <p class="flex flex-col gap-1.5 font-mono">
          <a href="tel:+4917622759201" class="text-2xl text-navy">0176 22 75 92 01</a>
          <a href="mailto:info@schuessele-praezision.de">info@schuessele-praezision.de</a>
        </p>
        <p>Erreichbar: <PlaceholderText>Platzhalter: Öffnungszeiten</PlaceholderText>
        </p>
      </address>

      <div class="relative aspect-[4/3] border border-navy bg-paper">
        <iframe v-if="mapLoaded" :src="mapSrc" title="Karte: Vogesenstraße 1, 77743 Neuried" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade" class="absolute inset-0 size-full border-0" />
        <div v-else class="absolute inset-0 flex flex-col items-start justify-center gap-4 p-6 text-[0.9rem]">
          <p>
            Die Karte wird von Google Maps geladen. Dabei werden Daten an Google übertragen.
            Mehr dazu in der <RouterLink to="/datenschutz">Datenschutzerklärung</RouterLink>.
          </p>
          <button type="button"
            class="inline-flex min-h-[2.9rem] cursor-pointer items-center justify-center border border-navy bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
            @click="mapLoaded = true">Karte laden</button>
        </div>
      </div>
    </div>
  </section>
</template>
