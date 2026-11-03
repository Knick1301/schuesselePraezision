<script setup lang="ts">
import PlaceholderText from '../components/PlaceholderText.vue'
</script>

<template>
  <article class="mx-auto max-w-[760px] px-pad py-12 md:py-20 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold">
    <h1 class="mb-4 text-[clamp(1.7rem,4vw,2.3rem)] font-semibold">Impressum</h1>

    <h2>Angaben gemäß § 5 DDG</h2>
    <address class="not-italic">
      Schüssele Präzision<br />
      Mirco Schüssele<br />
      Vogesenstraße 1<br />
      77743 Neuried
    </address>

    <h2>Kontakt</h2>
    <p class="font-mono">
      Telefon: <a href="tel:+4917622759201">0176 22 75 92 01</a><br />
      E-Mail: <a href="mailto:info@schuessele-praezision.de">info@schuessele-praezision.de</a>
    </p>

    <h2>Umsatzsteuer-ID</h2>
    <p><PlaceholderText>Platzhalter: USt-IdNr. vom Kunden</PlaceholderText></p>

    <h2>Weitere Angaben</h2>
    <p><PlaceholderText>Platzhalter: restliche Pflichtangaben vom Kunden bzw. aus einem Impressum-Generator übernehmen</PlaceholderText></p>
  </article>
</template>
