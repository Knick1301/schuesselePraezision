# Schüssele Präzision – Webseite

Firmenwebseite für einen kleinen, inhabergeführten Zerspanungsbetrieb (CNC-Drehen und -Fräsen, Metallbearbeitung) in Neuried.

## Kunde

- Firma: Schüssele Präzision
- Inhaber: Mirco Schüssele (mit **c** geschrieben!)
- Adresse: Vogesenstraße 1, 77743 Neuried
- Telefon: 0176 22 75 92 01 (Link: `tel:+4917622759201`)
- E-Mail: info@schuessele-praezision.de
- Domain: www.schuessele-praezision.de

## Technik

- Vue 3 + Vite + TypeScript, Vue Router für mehrere Seiten
- Styling mit Tailwind CSS v4 (`@tailwindcss/vite`). Markenfarben, Schriften und Maße stehen im `@theme` in `src/assets/base.css` (`text-navy`, `bg-teal`, `text-teal-dark`, `bg-paper`, `bg-grid`, `max-w-wrap`, `px-pad`, Breakpoint `nav:`).
- Kein eigenes CSS für Layout/Abstände/Farben. Ausnahme: Animations-CSS der SVG-Grafiken (`BrandLogo.vue`, `MillingMachine.vue`). Achtung: `<style scoped>` ohne Layer schlägt Tailwind-Klassen – dort keine Größen setzen.
- Animationen sparsam: CSS-Animationen und SVG-Linien, die sich selbst zeichnen (`stroke-dasharray` / `stroke-dashoffset`). Nur `transform` und `opacity` animieren.
- Immer `prefers-reduced-motion` respektieren.
- Mobil zuerst denken: Muss auf dem Handy gut funktionieren.

## Design

- Farben: Navy `#14273A` (Schrift, Linien), Türkis `#1FA9BA` (Akzent auf dunklem Grund, Grafiken), dunkles Türkis `#087A88` (Akzent für Text auf Weiß – wegen Kontrast), Weiß als Grund
- Schrift: Fira Code für die ganze Seite (`font-sans`/`font-mono`, Ligaturen aus). Montserrat nur für die Wortmarke („SCHÜSSELE" fett, „PRÄZISION" mit Sperrung in Türkis) über `font-brand` – wie auf der Visitenkarte.
- Leitidee: Die Seite greift die Sprache technischer Zeichnungen auf (dünne Linien, Bemaßung, Stückliste, Schriftfeld) – zurückhaltend, nicht verspielt
- Logo: Zahnrad mit Linien zu „Drehen", „Metallbearbeitung", „Fräsen"

## Ton

- Klartext, wie ein Mensch schreibt. Keine Werbefloskeln („Ihr zuverlässiger Partner", „höchste Präzision", „innovative Lösungen").
- Konkret: Maße, Werkstoffe, Stückzahlen statt Adjektive.
- Auch sagen, was der Betrieb **nicht** macht.
- Telefonnummer auf jeder Seite gut sichtbar.

## Nicht machen

- Keine erfundenen Zahlen, Kunden oder Zertifikate. Unbekanntes als `[Platzhalter]` markieren.
- Keine Stockfotos, kein Lorem ipsum, keine Emojis.
- Keine typischen Template-Muster: Kennzahlen-Leisten, „01/02/03"-Karten, „In 3 einfachen Schritten", Farbverläufe.
- Keine Kommentare

## Rechtliches

- Impressum und Datenschutzerklärung sind Pflicht (Inhalte kommen vom Kunden / Generator, nicht selbst ausdenken).
- Google Fonts lokal einbinden, nicht von Google laden (Datenschutz).
- Karten (Google Maps) erst nach Klick laden.

## Noch offen (beim Kunden erfragen)

- Öffnungszeiten, Gründungsjahr, Anzahl Mitarbeiter
- Max. Drehdurchmesser/-länge, Fräsbereich (X/Y/Z), Achsen
- Typische Werkstoffe und Stückzahlen, Kundenbranchen
- Was der Betrieb nicht macht
- Fotos aus der Werkstatt
