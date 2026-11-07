<script setup lang="ts">
import AerialView from '../components/AerialView.vue'
import PartSketch from '../components/PartSketch.vue'
import V2Menue from './V2Menue.vue'
import V2Platzhalter from './V2Platzhalter.vue'
import { fliess, TEL, TEL_LINK, useV2, wrap } from './stil'

const { nav, anfrage } = useV2()

const fotos = import.meta.glob<string>('./hauptbild.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const foto = Object.values(fotos)[0]

const ADRESSE = 'Vogesenstraße 1, 77743 Neuried'
const routeGoogle = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADRESSE)}`

const leistungen = [
  {
    titel: 'Drehen',
    skizze: 'welle' as const,
    text: 'Wellen, Bolzen, Buchsen, Flansche – alles, was rund ist.',
    werte: [
      { name: 'Ø max.', wert: 'Platzhalter', einheit: 'mm' },
      { name: 'Länge max.', wert: 'Platzhalter', einheit: 'mm' },
    ],
  },
  {
    titel: 'Fräsen',
    skizze: 'fraesteil' as const,
    text: 'Platten, Halter, Gehäuse, Taschen und Bohrbilder.',
    werte: [
      { name: 'X / Y / Z', wert: 'Platzhalter', einheit: 'mm' },
      { name: 'Achsen', wert: 'Platzhalter', einheit: '' },
    ],
  },
  {
    titel: 'Metallbearbeitung',
    skizze: 'winkel' as const,
    text: 'Bohren, Sägen, Schweißen.',
    werte: [],
  },
  {
    titel: 'Reparatur & Sonderteile',
    skizze: 'buchse' as const,
    text: 'Reparaturen von Lagersitzen, Wellen und mehr. Sonderteile auch nach Muster.',
    werte: [],
  },
]

const rahmen = [
  { titel: 'Werkstoffe', text: '', platzhalter: 'Platzhalter: z. B. Stahl, Edelstahl, Aluminium, Messing, Kunststoff' },
  { titel: 'Stückzahlen', text: 'Ab 1 Stück – auch individuelle Lösungen.', platzhalter: 'Platzhalter: bis … Stück' },
  { titel: 'Was wir nicht machen', text: '', platzhalter: 'Platzhalter: beim Kunden erfragen, z. B. Großserien, Beschichten' },
]

const bilder = import.meta.glob<string>('./fotos/*.jpg', { eager: true, import: 'default' })
const arbeiten = [
  { datei: 'platten', text: 'Gefräste Platten, Serie' },
  { datei: 'flansche', text: 'Flansche mit Gewindebolzen' },
  { datei: 'buchse', text: 'Bronzebuchse, innen gedreht' },
  { datei: 'reparatur', text: 'Reparatur auf dem Frästisch' },
  { datei: 'flansch', text: 'Flansch, gedreht und gebohrt' },
  { datei: 'riemenscheibe', text: 'Riemenscheibe mit Nabe' },
].map((a) => ({ ...a, src: bilder[`./fotos/${a.datei}.jpg`] }))

const zeile = 'grid gap-1 border-b border-navy/15 py-5 sm:grid-cols-[10rem_1fr] sm:items-baseline sm:gap-6'
const begriff = 'text-[0.875rem] text-navy/60'
</script>

<template>
  <section class="relative isolate overflow-hidden bg-navy text-white" aria-labelledby="v2-titel">
    <img v-if="foto" :src="foto" alt=""
      class="absolute inset-0 -z-20 size-full scale-[1.02] object-cover object-[62%_50%] blur-[0.75px] lg:object-[50%_45%]" />
    <div class="absolute inset-0 -z-10 bg-navy/[0.55]" aria-hidden="true"></div>

    <div :class="wrap"
      class="flex min-h-[max(34rem,92svh)] flex-col [text-shadow:0_1px_12px_rgb(20_39_58/0.85)] pt-3 pb-6 lg:min-h-[max(40rem,90svh)] lg:pt-[clamp(2rem,3.9vw,3.5rem)] lg:pb-[clamp(2rem,5vw,4.5rem)]">
      <div class="mb-6 flex items-center justify-between lg:hidden">
        <span class="text-[0.875rem] text-white/85">Neuried, seit <V2Platzhalter dunkel>Jahr</V2Platzhalter></span>
        <V2Menue />
      </div>

      <div class="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div>
          <h1 id="v2-titel" class="m-0 font-sans font-normal">
            <span
              class="block text-[15vw] leading-[0.9] font-normal tracking-[-0.04em] lg:text-[clamp(3.25rem,11vw,9.5rem)]">SCHÜSSELE</span>
            <span
              class="mt-[0.4em] flex items-center gap-[0.35em] text-[5.35vw] leading-none font-medium tracking-[0.32em] text-[#74d3de] lg:text-[clamp(1.5rem,3.7vw,3.4rem)]">
              <span class="text-[0.3em] tracking-normal" aria-hidden="true">●</span>PRÄZISION<span
                class="-ml-[0.3em] text-[0.3em] tracking-normal" aria-hidden="true">●</span>
            </span>
          </h1>
          <p class="mt-8 hidden text-[0.95rem] font-medium lg:block">Neuried, seit <V2Platzhalter dunkel>Jahr
            </V2Platzhalter>
          </p>
        </div>

        <nav aria-label="Hauptnavigation"
          class="hidden w-[18.75rem] shrink-0 [text-shadow:0_1px_10px_rgb(20_39_58/0.8)] lg:mt-4 lg:block">
          <ul class="m-0 list-none border-t-2 border-white/80 p-0">
            <li v-for="n in nav" :key="n.label" class="border-b-2 border-white/80">
              <RouterLink :to="n.to"
                class="flex items-center justify-between px-[1.875rem] py-3.5 text-[1.125rem] font-semibold text-white no-underline transition-colors hover:bg-white/10">
                <span>{{ n.label }}</span><span class="font-mono">{{ n.nr }}</span>
              </RouterLink>
            </li>
            <li class="border-b-2 border-white/80">
              <RouterLink :to="anfrage"
                class="flex items-center justify-between px-[1.875rem] py-3.5 text-[1.125rem] font-semibold text-white no-underline transition-colors hover:bg-white/10 hover:text-[#74d3de]">
                <span>Anfrage</span><span class="text-[1.5rem] leading-none font-normal" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="mt-auto flex flex-col gap-6 pt-12 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:pt-16">
        <div>
          <p class="m-0 text-[1.125rem] leading-[1.4] text-white/95 lg:text-[1.1875rem]" :class="fliess">
            Dreh- und Frästeile aus Metall.<br />
            Nach Ihrer Zeichnung gefertigt,<br />
            vom Einzelteil bis zur Serie.<br />
            Inhabergeführt von Mirco Schüssele.
          </p>

          <ul class="m-0 mt-6 list-none border-t border-white/45 p-0 lg:hidden">
            <li class="border-b border-white/45">
              <RouterLink :to="anfrage"
                class="flex min-h-14 items-center justify-between text-[1.0625rem] text-[#74d3de] no-underline">
                <span>Zeichnung schicken</span><span aria-hidden="true">→</span>
              </RouterLink>
            </li>
            <li class="border-b border-white/45">
              <a :href="TEL_LINK"
                class="flex min-h-14 items-center justify-between text-[1.0625rem] text-white no-underline">
                <span class="font-mono">{{ TEL }}</span><span class="text-[0.875rem] text-white/70">Anrufen</span>
              </a>
            </li>
          </ul>

          <p class="mt-7 mb-0 hidden flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] lg:flex">
            <RouterLink :to="anfrage" class="text-[#74d3de] no-underline hover:underline">[Zeichnung schicken]
            </RouterLink>
            <a :href="TEL_LINK" class="font-mono text-white no-underline hover:underline">{{ TEL }}</a>
          </p>
        </div>
        <p class="m-0 text-[0.8125rem] text-white/80">Martin-Drehbank</p>
      </div>
    </div>
  </section>

  <section id="leistungen" class="bg-white" aria-labelledby="leistungen-titel">
    <div :class="wrap" class="pt-[clamp(3rem,5vw,4.5rem)] pb-[clamp(4rem,8vw,7.5rem)]">
      <div class="grid gap-4 lg:grid-cols-[22.5rem_1fr] lg:items-baseline">
        <h2 id="leistungen-titel"
          class="m-0 text-[clamp(2.25rem,3.2vw,2.875rem)] leading-tight font-semibold tracking-[-0.03em]">Leistungen
        </h2>
        <p class="m-0 max-w-[40rem] text-[1.125rem] leading-snug text-navy/75 md:text-[1.1875rem]" :class="fliess">
          Wir fertigen Teile aus Metall auf CNC-Dreh- und Fräsmaschinen. Sie schicken die Zeichnung,
          wir sagen Ihnen, ob und wann wir es machen können.
        </p>
      </div>

      <ul class="m-0 mt-[clamp(2rem,3vw,2.5rem)] list-none border-t border-navy/15 p-0">
        <li v-for="l in leistungen" :key="l.titel"
          class="grid gap-y-4 border-b border-navy/15 py-8 md:grid-cols-[11rem_1fr] md:items-center md:gap-x-10 md:py-10 lg:grid-cols-[15rem_1fr] lg:gap-x-14">
          <PartSketch :type="l.skizze" class="block h-24 w-full max-w-[220px] md:h-28 lg:h-32" />
          <div class="grid gap-y-1.5 xl:grid-cols-[22rem_1fr_auto] xl:items-baseline">
            <h3
              class="m-0 text-[1.625rem] leading-tight font-semibold tracking-[-0.02em] break-words hyphens-auto md:text-[1.875rem]"
              lang="de">{{ l.titel }}</h3>
            <p class="m-0 text-[1.125rem] leading-snug text-navy/75 md:text-[1.1875rem] xl:pr-8" :class="fliess">
              {{ l.text }}
            </p>
            <dl v-if="l.werte.length"
              class="m-0 mt-1 flex font-mono flex-wrap gap-x-5 gap-y-1 text-[0.875rem] text-teal-dark xl:mt-0 xl:justify-end xl:text-right">
              <div v-for="w in l.werte" :key="w.name" class="flex gap-1.5">
                <dt class="text-navy/60">{{ w.name }}</dt>
                <dd class="m-0">
                  <V2Platzhalter>{{ w.wert }}</V2Platzhalter>{{ w.einheit ? ` ${w.einheit}` : '' }}
                </dd>
              </div>
            </dl>
          </div>
        </li>
      </ul>

      <div class="mt-[clamp(2.5rem,4vw,3.5rem)] grid gap-8 md:grid-cols-3 md:gap-10">
        <div v-for="r in rahmen" :key="r.titel">
          <h3 class="m-0 mb-2 text-[1.125rem] font-semibold tracking-[-0.01em]">{{ r.titel }}</h3>
          <p class="m-0 text-[1.0625rem] leading-snug text-navy/75" :class="fliess">
            <template v-if="r.text">{{ r.text }} </template>
            <V2Platzhalter>{{ r.platzhalter }}</V2Platzhalter>
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="arbeiten" class="border-t border-navy/15 bg-white" aria-labelledby="arbeiten-titel">
    <div :class="wrap" class="pt-[clamp(3rem,5vw,4.5rem)] pb-[clamp(4rem,8vw,7.5rem)]">
      <div class="grid gap-4 lg:grid-cols-[22.5rem_1fr] lg:items-baseline">
        <h2 id="arbeiten-titel" class="m-0 text-[clamp(2.25rem,3.2vw,2.875rem)] leading-tight font-semibold tracking-[-0.03em]">Arbeiten</h2>
        <p class="m-0 max-w-[40rem] text-[1.125rem] leading-snug text-navy/75 md:text-[1.1875rem]" :class="fliess">
          Teile aus unserer Fertigung.
        </p>
      </div>

      <ul class="m-0 mt-[clamp(2rem,3vw,2.5rem)] grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
        <li v-for="a in arbeiten" :key="a.datei">
          <figure class="m-0">
            <div class="aspect-[4/5] overflow-hidden bg-navy/[0.06]">
              <img :src="a.src" :alt="a.text" loading="lazy" decoding="async" class="size-full object-cover transition-transform duration-500 hover:scale-[1.03]" />
            </div>
            <figcaption class="mt-2 text-[0.8125rem] leading-snug text-navy/70 md:text-[0.875rem]">{{ a.text }}</figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </section>

  <section id="kontakt" class="border-t border-navy/15 bg-[#f4f6f8]" aria-labelledby="kontakt-titel">
    <div :class="wrap"
      class="grid gap-12 pt-[clamp(3rem,5vw,4.5rem)] pb-[clamp(4rem,8vw,7.5rem)] lg:grid-cols-[5fr_7fr] lg:gap-20">
      <div>
        <h2 id="kontakt-titel"
          class="m-0 text-[clamp(2.25rem,3.2vw,2.875rem)] leading-tight font-semibold tracking-[-0.03em]">Kontakt</h2>
        <p class="mt-4 mb-8 max-w-[32rem] text-[1.125rem] leading-snug text-navy/75 md:text-[1.1875rem]"
          :class="fliess">
          Am schnellsten geht es telefonisch. Zeichnungen gerne per E‑Mail.
        </p>

        <address class="not-italic">
          <dl class="m-0 border-t border-navy/15">
            <div :class="zeile" class="sm:items-center">
              <dt :class="begriff">Ansprechpartner</dt>
              <dd class="m-0 flex items-center gap-3">
                <span class="relative size-12 shrink-0 overflow-hidden rounded-full bg-navy/10">
                  <span
                    class="absolute inset-0 flex items-center justify-center text-[0.55rem] text-teal-dark">[Foto]</span>
                </span>
                <span class="text-[1.125rem] font-semibold">Mirco Schüssele</span>
              </dd>
            </div>
            <div :class="zeile">
              <dt :class="begriff">Mitarbeiter</dt>
              <dd class="m-0 text-[1.125rem]">Jannik Enderle</dd>
            </div>
            <div :class="zeile">
              <dt :class="begriff">Adresse</dt>
              <dd class="m-0" :class="fliess">Vogesenstraße 1<br />77743 Neuried</dd>
            </div>
            <div :class="zeile">
              <dt :class="begriff">Erreichbar</dt>
              <dd class="m-0">
                <V2Platzhalter>Platzhalter: Öffnungszeiten</V2Platzhalter>
              </dd>
            </div>
          </dl>
        </address>
      </div>

      <figure class="m-0">
        <AerialView />
        <figcaption class="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <a :href="routeGoogle" target="_blank" rel="noopener"
            class="inline-flex min-h-12 items-center gap-2 bg-navy px-5 text-[0.95rem] text-white no-underline transition-colors hover:bg-teal-dark">Route
            planen <span aria-hidden="true">→</span></a>
          <span class="text-[0.75rem] text-navy/60">
            Luftbild: <a href="https://www.lgl-bw.de" target="_blank" rel="noopener" class="text-navy/60">LGL-BW</a>
            (2026),
            <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener"
              class="text-navy/60">Datenlizenz
              Deutschland – Namensnennung – Version 2.0</a>
          </span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>
