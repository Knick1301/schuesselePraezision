<script setup lang="ts">
import V2Platzhalter from './V2Platzhalter.vue'
import { MAIL, fliess, useV2, TEL, TEL_LINK } from './stil'

const { kopf } = useV2()
</script>

<template>
  <article
    class="mx-auto max-w-[47.5rem] px-[clamp(1.25rem,4.5vw,4rem)] py-[clamp(3rem,6vw,5.5rem)] text-[1.125rem] leading-[1.55] [&_h2]:mt-9 [&_h2:first-child]:mt-0 [&_h2]:mb-2 [&_h2]:text-[1.125rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_p]:m-0"
    :class="fliess"
  >
    <h1 v-if="kopf === 'leiste'" class="m-0 mb-8 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold">Impressum</h1>

    <h2>Angaben gemäß § 5 DDG</h2>
    <address class="not-italic">
      Schüssele Präzision<br />
      Mirco Schüssele<br />
      Vogesenstraße 1<br />
      77743 Neuried
    </address>

    <h2>Kontakt</h2>
    <p>
      Telefon: <a :href="TEL_LINK" class="text-teal-dark">{{ TEL }}</a><br />
      E-Mail: <a :href="`mailto:${MAIL}`" class="text-teal-dark">{{ MAIL }}</a>
    </p>

    <h2>Umsatzsteuer-ID</h2>
    <p><V2Platzhalter>Platzhalter: USt-IdNr. vom Kunden</V2Platzhalter></p>

    <h2>Weitere Angaben</h2>
    <p><V2Platzhalter>Platzhalter: restliche Pflichtangaben vom Kunden bzw. aus einem Impressum-Generator übernehmen</V2Platzhalter></p>
  </article>
</template>
