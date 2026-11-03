<script setup lang="ts">
/**
 * Logo Schüssele Präzision als Vektorgrafik (nachgebaut nach src/assets/Logo.jpeg).
 * Koordinaten entsprechen dem Original (1028 × 674 px), damit Proportionen stimmen.
 *
 * variant  'full' = Zahnrad mit Beschriftung + Wortmarke (gestapelt)
 *          'mark' = nur Zahnrad mit Linien und Punkten (für kleine Größen, z. B. Header)
 * tone     'light' = für weißen Grund, 'dark' = für Navy-Grund
 * animate  Linien zeichnen sich beim Laden selbst
 */
withDefaults(
  defineProps<{
    variant?: 'full' | 'mark'
    tone?: 'light' | 'dark'
    animate?: boolean
  }>(),
  { variant: 'full', tone: 'light', animate: false },
)

const CX = 510
const CY = 234
const R = 172 // Zahnkopf
const RN = 36 // Radius der Zahnlücken
const RI = 77 // innerer Ring

const pt = (deg: number, r = R): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}
const f = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`

const Y_TOP = 133.5
const Y_MID = 234.5
const Y_BOT = 336.5

/** Schnittpunkt Lückenkreis (Mitte bei Winkel deg) mit waagerechter Linie, linke Seite */
const notchAtY = (deg: number, y: number): [number, number] => {
  const [nx, ny] = pt(deg)
  return [nx - Math.sqrt(RN * RN - (y - ny) ** 2), y]
}

// Außenkontur: von der oberen Linie über das Zahnrad bis zur unteren Linie
const gearPath = (() => {
  const top = notchAtY(39, Y_TOP)
  const bot = notchAtY(309, Y_BOT)
  let d = `M626 ${Y_TOP} H${top[0].toFixed(2)} A${RN} ${RN} 0 0 1 ${f(pt(51))}`
  for (let c = 84; c <= 264; c += 45) {
    d += ` A${R} ${R} 0 0 0 ${f(pt(c - 12))} A${RN} ${RN} 0 0 1 ${f(pt(c + 12))}`
  }
  d += ` A${R} ${R} 0 0 0 ${f(pt(297))} A${RN} ${RN} 0 0 1 ${f(bot)} H626`
  return d
})()

// innerer Ring (offenes „C“), geht rechts in die mittlere Linie über
const ringPath = `M${f(pt(-28, RI))} A${RI} ${RI} 0 1 1 ${f(pt(0, RI))} H602`

// Linien hinter der Beschriftung, mit Punkt am Ende
const ends = [
  { x1: 720, x2: 733, y: Y_TOP, dot: 738 },
  { x1: 839, x2: 853, y: Y_MID, dot: 858 },
  { x1: 717, x2: 730, y: Y_BOT, dot: 735 },
]
// Bildmarke ohne Beschriftung: Linien so lang wie im Original (Mitte am längsten)
const markEnds = [
  { x: 626, y: Y_TOP, dot: 738 },
  { x: 602, y: Y_MID, dot: 858 },
  { x: 626, y: Y_BOT, dot: 735 },
]

const labels = [
  { text: 'DREHEN', x: 631, w: 83, y: Y_TOP + 6 },
  { text: 'METALLBEARBEITUNG', x: 607, w: 227, y: Y_MID + 6 },
  { text: 'FRÄSEN', x: 632, w: 78, y: Y_BOT + 6 },
]
</script>

<template>
  <svg
    :class="['logo', `logo--${tone}`, `logo--${variant}`, { 'logo--animate': animate }]"
    :viewBox="variant === 'full' ? '185 45 690 585' : '328 52 546 364'"
    role="img"
    :aria-label="variant === 'full' ? 'Schüssele Präzision – Drehen, Metallbearbeitung, Fräsen' : 'Schüssele Präzision'"
  >
    <g class="lines">
      <path :d="gearPath" pathLength="1" class="draw" />
      <path :d="ringPath" pathLength="1" class="draw draw--2" />

      <template v-if="variant === 'full'">
        <path
          v-for="(e, i) in ends"
          :key="i"
          :d="`M${e.x1} ${e.y} H${e.x2}`"
          pathLength="1"
          class="draw draw--3"
        />
      </template>
      <template v-else>
        <path
          v-for="(e, i) in markEnds"
          :key="i"
          :d="`M${e.x} ${e.y} H${e.dot}`"
          pathLength="1"
          class="draw draw--3"
        />
      </template>
    </g>

    <g class="dots">
      <circle
        v-for="(e, i) in variant === 'full' ? ends : markEnds"
        :key="i"
        :cx="e.dot"
        :cy="e.y"
        :r="variant === 'full' ? 5.5 : 13"
      />
    </g>

    <template v-if="variant === 'full'">
      <g class="labels">
        <text
          v-for="l in labels"
          :key="l.text"
          :x="l.x"
          :y="l.y"
          :textLength="l.w"
          lengthAdjust="spacing"
        >{{ l.text }}</text>
      </g>

      <g class="wordmark">
        <text class="wm-bold" x="197" y="539" textLength="623" lengthAdjust="spacingAndGlyphs">SCHÜSSELE</text>
        <text class="wm-thin" x="316" y="613" textLength="386" lengthAdjust="spacing">PRÄZISION</text>
        <circle class="wm-dot" cx="290.5" cy="590.5" r="5.5" />
        <circle class="wm-dot" cx="727.5" cy="590.5" r="5.5" />
      </g>
    </template>
  </svg>
</template>

<style scoped>
/* Größe kommt per Tailwind-Klasse von außen (z. B. h-10 w-auto) */
.logo {
  overflow: visible;
}

.lines path {
  fill: none;
  stroke: var(--logo-line);
  stroke-width: 5.5;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}
/* Bildmarke: feste Linienstärke unabhängig von der Größe, sonst wird sie im Header zu dünn */
.logo--mark .lines path {
  stroke-width: 2px;
  vector-effect: non-scaling-stroke;
}
.dots circle,
.wm-dot {
  fill: var(--logo-line);
}

.labels text {
  font-size: 15.5px;
  font-weight: 400;
  font-family: var(--font-brand);
  fill: var(--logo-label);
}

.wordmark text {
  font-family: var(--font-brand);
}
.wm-bold {
  font-size: 107px;
  font-weight: 800;
  fill: var(--logo-word);
}
.wm-thin {
  font-size: 63px;
  font-weight: 400;
  fill: var(--logo-line);
}

/* Farben */
.logo--dark {
  --logo-line: var(--color-teal);
  --logo-label: var(--color-teal);
  --logo-word: var(--color-white);
}
.logo--light {
  --logo-line: var(--color-teal);
  --logo-label: var(--color-teal-dark);
  --logo-word: var(--color-navy);
}
/* Schrift auf Weiß braucht das dunkle Türkis (Kontrast) */
.logo--light .wm-thin {
  fill: var(--color-teal-dark);
}

/* Linien zeichnen sich selbst */
.logo--animate .draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw 1.6s cubic-bezier(0.45, 0, 0.25, 1) 0.2s forwards;
}
.logo--animate .draw--2 {
  animation-delay: 0.9s;
  animation-duration: 1s;
}
.logo--animate .draw--3 {
  animation-delay: 1.6s;
  animation-duration: 0.4s;
}
.logo--animate .dots,
.logo--animate .labels {
  opacity: 0;
  animation: fade 0.5s ease 1.9s forwards;
}
.logo--animate .wordmark {
  opacity: 0;
  animation: fade 0.8s ease 0.6s forwards;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fade {
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .logo--animate .draw {
    animation: none;
    stroke-dashoffset: 0;
  }
  .logo--animate .dots,
  .logo--animate .labels,
  .logo--animate .wordmark {
    animation: none;
    opacity: 1;
  }
}
</style>
