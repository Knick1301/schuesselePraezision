<script setup lang="ts">
import PlaceholderText from '../components/PlaceholderText.vue'
</script>

<template>
  <article class="mx-auto max-w-[760px] px-pad py-12 md:py-20 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold">
    <h1 class="mb-4 text-[clamp(1.7rem,4vw,2.3rem)] font-semibold">Datenschutzerklärung</h1>

    <h2>Verantwortlicher</h2>
    <address class="not-italic">
      Schüssele Präzision, Mirco Schüssele<br />
      Vogesenstraße 1, 77743 Neuried<br />
      <a href="mailto:info@schuessele-praezision.de">info@schuessele-praezision.de</a>
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
      <PlaceholderText>Platzhalter: Rechtsgrundlage, Speicherdauer und ggf. eingesetzter Formulardienst – vom Kunden bzw. Generator</PlaceholderText>
    </p>

    <h2>Luftbild und Routenplanung</h2>
    <p>
      Das Luftbild im Kontaktbereich liegt auf unserem eigenen Server (Quelle: LGL-BW, Datenlizenz Deutschland – Namensnennung – Version 2.0).
      Beim Ansehen werden keine Daten an Dritte übertragen. Erst wenn Sie auf „Route planen“ oder „In OpenStreetMap öffnen“
      klicken, öffnet sich die Seite von Google Maps bzw. OpenStreetMap; dort gelten deren Datenschutzbestimmungen.
    </p>

    <h2>Vollständige Erklärung</h2>
    <p><PlaceholderText>Platzhalter: vollständige Datenschutzerklärung vom Kunden bzw. aus einem Generator übernehmen – inkl. Hosting-Anbieter, Server-Logfiles, E-Mail-Kontakt, Betroffenenrechte</PlaceholderText></p>
  </article>
</template>
