<script setup lang="ts">
import MillingMachine from '../components/MillingMachine.vue'
import SectionTitle from '../components/SectionTitle.vue'
import PlaceholderText from '../components/PlaceholderText.vue'
import AerialView from '../components/AerialView.vue'
import PartSketch from '../components/PartSketch.vue'

const ADRESSE = 'Vogesenstraße 1, 77743 Neuried'
const routeGoogle = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADRESSE)}`

const facts = [
  { label: 'Stückzahlen', value: 'z. B. 1–500' },
  { label: 'Werkstoffe', value: 'z. B. Stahl, Alu' },
  { label: 'Region', value: 'z. B. Ortenau' },
]

const titleBlock = [
  { label: 'Betrieb', value: 'Schüssele Präzision' },
  { label: 'Ort', value: 'Neuried' },
]
</script>

<template>

  <section
    class="border-b border-navy/20 bg-paper bg-grid p-3 lg:flex lg:min-h-[min(calc(100svh-15rem),56rem)] lg:flex-col lg:p-5"
    aria-labelledby="hero-title">
    <div
      class="relative m-[5px] border border-navy/45 outline outline-offset-[5px] outline-navy/20 lg:flex lg:flex-1 lg:items-center">
      <span aria-hidden="true"
        class="pointer-events-none absolute top-1.5 right-0 left-8 flex font-mono text-[0.65rem] text-navy/50">
        <i v-for="n in 6" :key="n" class="flex-1 text-center not-italic">{{ n }}</i>
      </span>
      <span aria-hidden="true"
        class="pointer-events-none absolute top-8 bottom-0 left-2 flex flex-col font-mono text-[0.65rem] text-navy/50">
        <i v-for="z in ['A', 'B', 'C']" :key="z" class="flex flex-1 items-center not-italic">{{ z }}</i>
      </span>

      <div
        class="mx-auto w-full max-w-wide px-pad pt-11 pb-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:pt-12 lg:pb-8 xl:gap-20">
        <div class="max-w-[38rem] lg:pt-[8%]">
          <div>
            <h1 id="hero-title"
              class="mb-[0.4em] text-[clamp(2rem,4.6vw,4rem)] leading-[1.1] font-bold tracking-[-0.01em] text-balance">
              CNC-Drehen <span class="whitespace-nowrap">und -Fräsen</span> in&nbsp;Neuried
            </h1>
            <p class="mb-8 max-w-[38rem] text-[clamp(1rem,1.6vw,1.25rem)]">
              Dreh- und Frästeile aus Metall nach Ihrer Zeichnung.
              Inhabergeführt von Mirco Schüssele.
            </p>
            <RouterLink to="/anfrage"
              class="inline-flex min-h-[3rem] items-center justify-center border border-navy bg-navy px-6 py-3 text-base font-semibold text-white no-underline transition-colors hover:border-teal-dark hover:bg-teal-dark">Zum
              Anfrageformular</RouterLink>
          </div>

          <dl class="mt-10 grid max-w-[38rem] border-t border-navy/40 font-mono text-sm sm:grid-cols-3">
            <div v-for="(f, i) in facts" :key="f.label"
              class="flex items-baseline gap-3 border-b border-navy/15 py-2 sm:block sm:border-b-0 sm:pt-3 sm:pr-3 sm:pb-0"
              :class="i > 0 && 'sm:border-l sm:border-navy/20 sm:pl-3'">
              <dt class="w-28 shrink-0 text-[0.8125rem] text-navy/75 sm:mb-1 sm:w-auto">{{ f.label }}</dt>
              <dd>
                <PlaceholderText>{{ f.value }}</PlaceholderText>
              </dd>
            </div>
          </dl>
        </div>

        <div class="mt-14 flex flex-col justify-center lg:mt-0">
          <MillingMachine class="mb-2 h-auto w-full" />

          <dl
            class="ml-auto grid w-full max-w-[380px] grid-cols-2 border border-navy/70 bg-white font-mono text-[0.8rem] text-navy">
            <div class="col-span-2 px-3 py-1.5">
              <dt class="text-[0.72rem] tracking-[0.06em] uppercase opacity-75">Benennung</dt>
              <dd>CNC-Fräsmaschine</dd>
            </div>
            <div v-for="(f, i) in titleBlock" :key="f.label" class="border-t border-navy px-3 py-1.5"
              :class="i === 0 && 'border-r'">
              <dt class="text-[0.72rem] tracking-[0.06em] uppercase opacity-75">{{ f.label }}</dt>
              <dd class="whitespace-nowrap">{{ f.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section id="leistungen" class="border-b border-navy/15 bg-paper" aria-labelledby="leistungen-title">
    <div class="mx-auto max-w-wide px-pad py-16 md:py-24">
      <header class="mb-12 max-w-[46rem] lg:mb-14">
        <SectionTitle id="leistungen-title" class="mb-0">Leistungen</SectionTitle>
        <p class="mt-5 max-w-[40rem] text-lg">
          Wir fertigen Teile aus Metall auf CNC-Dreh- und Fräsmaschinen. Sie schicken die
          Zeichnung, wir sagen Ihnen, ob und wann wir es machen können.
        </p>
      </header>

      <div
        class="grid divide-y divide-navy/25 border-y border-navy lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr_auto] lg:divide-x lg:divide-y-0">
        <article class="py-10 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:pr-10">
          <PartSketch type="welle" class="mb-8 block h-36 w-full max-w-[300px]" />
          <h3 class="mb-2 text-2xl font-semibold">Drehen</h3>
          <p class="mb-6">Wellen, Bolzen, Buchsen, Flansche – alles, was rund ist.</p>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t border-navy/20 pt-4 font-mono text-sm">
            <dt class="text-navy/75">Ø max.</dt>
            <dd>
              <PlaceholderText>Platzhalter</PlaceholderText> mm
            </dd>
            <dt class="text-navy/75">Länge max.</dt>
            <dd>
              <PlaceholderText>Platzhalter</PlaceholderText> mm
            </dd>
          </dl>
        </article>

        <article class="py-10 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:px-10">
          <PartSketch type="fraesteil" class="mb-8 block h-36 w-full max-w-[300px]" />
          <h3 class="mb-2 text-2xl font-semibold">Fräsen</h3>
          <p class="mb-6">Platten, Halter, Gehäuse, Taschen und Bohrbilder.</p>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t border-navy/20 pt-4 font-mono text-sm">
            <dt class="text-navy/75">X / Y / Z</dt>
            <dd>
              <PlaceholderText>Platzhalter</PlaceholderText> mm
            </dd>
            <dt class="text-navy/75">Achsen</dt>
            <dd>
              <PlaceholderText>Platzhalter</PlaceholderText>
            </dd>
          </dl>
        </article>

        <article class="py-10 lg:row-span-4 lg:grid lg:grid-rows-subgrid lg:pl-10">
          <PartSketch type="winkel" class="mb-8 block h-36 w-full max-w-[300px]" />
          <h3 class="mb-2 text-2xl font-semibold">Metall&shy;bearbeitung</h3>
          <p class="mb-6">
            Bohren, Sägen, Schweißen. Reparaturen von Lagersitzen, Wellen und mehr.
            Sonderteile auch nach Muster.
          </p>
          <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 border-t border-navy/20 pt-4 font-mono text-sm">
            <dt class="text-navy/75">Verfahren</dt>
            <dd>Bohren · Sägen · Schweißen</dd>
            <dt class="text-navy/75">Außerdem</dt>
            <dd>Reparatur, Sonderteile</dd>
          </dl>
        </article>
      </div>

      <div class="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-0">
        <div class="lg:pr-10">
          <h3 class="mb-1.5 text-lg font-semibold">Werkstoffe</h3>
          <p>
            <PlaceholderText>Platzhalter: z. B. Stahl, Edelstahl, Aluminium, Messing, Kunststoff</PlaceholderText>
          </p>
        </div>
        <div class="lg:px-10">
          <h3 class="mb-1.5 text-lg font-semibold">Stückzahlen</h3>
          <p>
            Ab 1 Stück – auch individuelle Lösungen.
            <PlaceholderText>Platzhalter: bis … Stück</PlaceholderText>
          </p>
        </div>
        <div class="lg:pl-10">
          <h3 class="mb-1.5 text-lg font-semibold">Was wir nicht machen</h3>
          <p>
            <PlaceholderText>Platzhalter: beim Kunden erfragen, z. B. Großserien, Beschichten</PlaceholderText>
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="kontakt" class="mx-auto max-w-wide px-pad py-16 md:py-24" aria-labelledby="kontakt-title">
    <div class="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-20">
      <div>
        <SectionTitle id="kontakt-title" class="mb-0">Kontakt</SectionTitle>
        <p class="mt-5 mb-10 max-w-[32rem] text-lg">Am schnellsten geht es telefonisch. Zeichnungen gerne per E-Mail.</p>

        <address class="not-italic">
          <dl class="border-t border-navy">
            <div class="grid grid-cols-[8.5rem_1fr] items-center gap-4 border-b border-navy/20 py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">Ansprechpartner</dt>
              <dd class="flex items-center gap-3">
                <span class="relative size-12 shrink-0 overflow-hidden rounded-full border border-navy/60 bg-[#e9edf1]">
                  <span class="absolute inset-0 flex items-center justify-center font-mono text-[0.55rem] text-teal-dark">[Foto]</span>
                </span>
                <span class="font-semibold">Mirco Schüssele</span>
              </dd>
            </div>
            <div class="grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-navy/20 py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">Mitarbeiter</dt>
              <dd>Jannik Enderle</dd>
            </div>
            <div class="grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-navy/20 py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">Telefon</dt>
              <dd><a href="tel:+4917622759201" class="font-mono text-2xl text-navy">0176 22 75 92 01</a></dd>
            </div>
            <div class="grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-navy/20 py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">E-Mail</dt>
              <dd><a href="mailto:info@schuessele-praezision.de" class="font-mono break-all">info@schuessele-praezision.de</a></dd>
            </div>
            <div class="grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-navy/20 py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">Adresse</dt>
              <dd>Vogesenstraße 1<br />77743 Neuried</dd>
            </div>
            <div class="grid grid-cols-[8.5rem_1fr] items-baseline gap-4 border-b border-navy py-4">
              <dt class="font-mono text-[0.8125rem] text-navy/75">Erreichbar</dt>
              <dd><PlaceholderText>Platzhalter: Öffnungszeiten</PlaceholderText></dd>
            </div>
          </dl>
        </address>
      </div>

      <figure>
        <AerialView />
        <figcaption class="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <a :href="routeGoogle" target="_blank" rel="noopener"
            class="inline-flex min-h-[2.9rem] items-center justify-center gap-2 border border-navy bg-navy px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition-colors hover:border-teal-dark hover:bg-teal-dark">
            <svg viewBox="0 0 24 24" aria-hidden="true" class="size-4">
              <path
                d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z M12 12.2a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
                fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
            </svg>
            Route planen
          </a>
          <span class="font-mono text-xs text-navy/60">
            Luftbild: <a href="https://www.lgl-bw.de" target="_blank" rel="noopener" class="text-navy/60">LGL-BW</a>
            (2026),
            <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener"
              class="text-navy/60">Datenlizenz Deutschland – Namensnennung – Version 2.0</a>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
