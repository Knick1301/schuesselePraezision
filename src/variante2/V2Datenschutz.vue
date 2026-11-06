<script setup lang="ts">
import V2Platzhalter from './V2Platzhalter.vue'
import { MAIL, fliess, useV2 } from './stil'

const { kopf } = useV2()
</script>

<template>
  <article
    class="mx-auto max-w-[47.5rem] px-[clamp(1.25rem,4.5vw,4rem)] py-[clamp(3rem,6vw,5.5rem)] text-[1.125rem] leading-[1.55] [&_h2]:mt-9 [&_h2:first-child]:mt-0 [&_h2]:mb-2 [&_h2]:text-[1.125rem] [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_p]:m-0"
    :class="fliess"
  >
    <h1 v-if="kopf === 'leiste'" class="m-0 mb-8 text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold">Datenschutz&shy;erklärung</h1>

    <h2>Verantwortlicher</h2>
    <address class="not-italic">
      Schüssele Präzision, Mirco Schüssele<br />
      Vogesenstraße 1, 77743 Neuried<br />
      <a :href="`mailto:${MAIL}`" class="text-teal-dark">{{ MAIL }}</a>
    </address>

    <h2>Schriftarten</h2>
    <p>
      Die Schriftarten dieser Seite liegen auf unserem eigenen Server. Beim Aufruf wird keine
      Verbindung zu Google oder anderen Schriftanbietern aufgebaut.
    </p>

    <h2>Anfrageformular</h2>
    <p>
      Wenn Sie uns über das Anfrageformular schreiben, verarbeiten wir Ihre Angaben und hochgeladenen Dateien,
      um die Anfrage zu bearbeiten und Ihnen ein Angebot zu machen.
      <V2Platzhalter>Platzhalter: Rechtsgrundlage, Speicherdauer und ggf. eingesetzter Formulardienst – vom Kunden bzw. Generator</V2Platzhalter>
    </p>

    <h2>Luftbild und Routenplanung</h2>
    <p>
      Das Luftbild im Kontaktbereich liegt auf unserem eigenen Server (Quelle: LGL-BW, Datenlizenz Deutschland – Namensnennung – Version 2.0).
      Beim Ansehen werden keine Daten an Dritte übertragen. Erst wenn Sie auf „Route planen“ klicken, öffnet sich
      die Seite von Google Maps; dort gelten deren Datenschutzbestimmungen.
    </p>

    <h2>Vollständige Erklärung</h2>
    <p><V2Platzhalter>Platzhalter: vollständige Datenschutzerklärung vom Kunden bzw. aus einem Generator übernehmen – inkl. Hosting-Anbieter, Server-Logfiles, E-Mail-Kontakt, Betroffenenrechte</V2Platzhalter></p>
  </article>
</template>
