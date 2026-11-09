<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ type: 'welle' | 'fraesteil' | 'winkel' | 'buchse' | 'montage' | 'zahnrad' }>()

const root = ref<SVGSVGElement>()
const drawn = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    drawn.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        drawn.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  if (root.value) observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

type P = [number, number]
type Tone = 'light' | 'shine' | 'mid' | 'dark' | 'hole' | 'midk' | 'darkk'
interface Fill {
  d: string
  tone: Tone
}
const C30 = Math.cos(Math.PI / 6)
const iso = (x: number, y: number, z: number, ox: number, oy: number): P => [ox + (x - y) * C30, oy + (x + y) * 0.5 - z]
const line = (pts: P[], closed = false) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L') + (closed ? ' Z' : '')
const isoEllipse = (cx: number, cy: number, z: number, r: number, ox: number, oy: number) => {
  const pts: P[] = []
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2
    pts.push(iso(cx + r * Math.cos(a), cy + r * Math.sin(a), z, ox, oy))
  }
  return line(pts)
}

interface Layer {
  fills: Fill[]
  edges: string[]
}

const hull = (pts: P[]): P[] => {
  const q = [...pts].sort((m, n) => m[0] - n[0] || m[1] - n[1])
  const cr = (o: P, m: P, n: P) => (m[0] - o[0]) * (n[1] - o[1]) - (m[1] - o[1]) * (n[0] - o[0])
  const lo: P[] = []
  for (const t of q) {
    while (lo.length >= 2 && cr(lo[lo.length - 2]!, lo[lo.length - 1]!, t) <= 0) lo.pop()
    lo.push(t)
  }
  const up: P[] = []
  for (const t of q.reverse()) {
    while (up.length >= 2 && cr(up[up.length - 2]!, up[up.length - 1]!, t) <= 0) up.pop()
    up.push(t)
  }
  return [...lo.slice(0, -1), ...up.slice(0, -1)]
}

const welle = (() => {
  const ox = 20
  const oy = 30
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const ring = (x: number, r: number, a0 = 0, a1 = 360, n = 40): P[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
      return p(x, r * Math.cos(t), r * Math.sin(t))
    })
  const segs: [number, number, number][] = [
    [0, 22, 6],
    [22, 52, 10],
    [52, 62, 14],
    [62, 104, 10],
    [104, 126, 7],
  ]
  const bands: [number, number, Tone][] = [
    [-45, 0, 'dark'],
    [0, 40, 'mid'],
    [40, 75, 'light'],
    [75, 105, 'shine'],
    [105, 135, 'light'],
  ]
  const layers: Layer[] = segs.map(([x0, x1, r]) => {
    const body = hull([...ring(x0, r), ...ring(x1, r)])
    const fills: Fill[] = [{ d: line(body, true), tone: 'mid' }]
    for (const [b0, b1, tone] of bands) {
      const front = ring(x1, r, b0, b1, 8)
      const back = ring(x0, r, b0, b1, 8).reverse()
      fills.push({ d: line([...front, ...back], true), tone })
    }
    const cap = line(ring(x1, r), true)
    fills.push({ d: cap, tone: 'mid' })
    return { fills, edges: [line(body, true), cap] }
  })
  const kx0 = 70
  const kx1 = 96
  const kw = 3
  const kz = Math.sqrt(10 * 10 - kw * kw)
  const slot: P[] = [
    ...Array.from({ length: 9 }, (_, i) => {
      const t = Math.PI / 2 + (Math.PI * i) / 8
      return p(kx0 + kw * Math.cos(t), kw * Math.sin(t), kz)
    }),
    ...Array.from({ length: 9 }, (_, i) => {
      const t = -Math.PI / 2 + (Math.PI * i) / 8
      return p(kx1 + kw * Math.cos(t), kw * Math.sin(t), kz)
    }),
  ]
  const slotPath = line(slot, true)
  layers[3]!.fills.push({ d: slotPath, tone: 'hole' })
  layers[3]!.edges.push(slotPath)
  return {
    main: layers.flatMap((l) => l.edges),
    center: line([p(-8, 0, 0), p(134, 0, 0)]),
    fills: [] as Fill[],
    layers,
  }
})()

const fraesteil = (() => {
  const ox = 80
  const oy = 18
  const L = 86
  const B = 52
  const H = 14
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const top = line([p(0, 0, H), p(L, 0, H), p(L, B, H), p(0, B, H)], true)
  const sides = [line([p(0, B, H), p(0, B, 0), p(L, B, 0), p(L, B, H)]), line([p(L, B, 0), p(L, 0, 0), p(L, 0, H)])]
  const px0 = 24
  const px1 = 62
  const py0 = 14
  const py1 = 38
  const d = 6
  const pocket = [
    line([p(px0, py0, H), p(px1, py0, H), p(px1, py1, H), p(px0, py1, H)], true),
    line([p(px0, py0, H), p(px0, py0, H - d), p(px1, py0, H - d), p(px1, py0, H)]),
    line([p(px0, py0, H - d), p(px0, py1, H - d), p(px0, py1, H)]),
  ]
  const holes = [
    [10, 10],
    [L - 10, 10],
    [10, B - 10],
    [L - 10, B - 10],
  ].map(([x, y]) => isoEllipse(x!, y!, H, 4, ox, oy))
  const fills: Fill[] = [
    { d: line([p(0, B, H), p(L, B, H), p(L, B, 0), p(0, B, 0)], true), tone: 'mid' },
    { d: line([p(L, 0, H), p(L, B, H), p(L, B, 0), p(L, 0, 0)], true), tone: 'dark' },
    { d: line([p(px0, py0, H - d), p(px1, py0, H - d), p(px1, py1, H - d), p(px0, py1, H - d)], true), tone: 'mid' },
    { d: line([p(px0, py0, H), p(px1, py0, H), p(px1, py0, H - d), p(px0, py0, H - d)], true), tone: 'dark' },
    { d: line([p(px0, py0, H), p(px0, py1, H), p(px0, py1, H - d), p(px0, py0, H - d)], true), tone: 'hole' },
    ...holes.map((h) => ({ d: h + ' Z', tone: 'hole' as Tone })),
    { d: [top, pocket[0], ...holes.map((h) => h + ' Z')].join(' '), tone: 'light' },
  ]
  return { main: [top, ...sides, ...pocket, ...holes], center: line([p(L / 2, -8, H), p(L / 2, B + 8, H)]), fills }
})()

const winkel = (() => {
  const ox = 70
  const oy = 30
  const L = 70
  const B = 40
  const T = 6
  const Hh = 42
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const base = [
    line([p(0, 0, T), p(L, 0, T), p(L, B, T), p(T, B, T)]),
    line([p(L, B, T), p(L, B, 0), p(0, B, 0), p(0, B, Hh), p(0, 0, Hh), p(T, 0, Hh), p(T, B, Hh), p(0, B, Hh)]),
    line([p(L, 0, T), p(L, 0, 0), p(L, B, 0)]),
    line([p(T, 0, Hh), p(T, 0, T)]),
    line([p(T, B, Hh), p(T, B, T)]),
    line([p(T, 0, T), p(T, B, T)]),
  ]
  const holes = [isoEllipse(L - 16, B / 2 - 9, T, 3.5, ox, oy), isoEllipse(L - 16, B / 2 + 9, T, 3.5, ox, oy)]
  const wallHoles = [12, 28].map((y) => {
    const pts: P[] = []
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2
      pts.push(p(T, y + 3.5 * Math.cos(a), 28 + 3.5 * Math.sin(a)))
    }
    return line(pts)
  })
  const fills: Fill[] = [
    { d: line([p(0, B, 0), p(L, B, 0), p(L, B, T), p(T, B, T), p(T, B, Hh), p(0, B, Hh)], true), tone: 'mid' },
    { d: line([p(L, 0, T), p(L, B, T), p(L, B, 0), p(L, 0, 0)], true), tone: 'dark' },
    ...holes.map((h) => ({ d: h + ' Z', tone: 'hole' as Tone })),
    ...wallHoles.map((h) => ({ d: h + ' Z', tone: 'hole' as Tone })),
    { d: [line([p(T, 0, T), p(L, 0, T), p(L, B, T), p(T, B, T)], true), ...holes.map((h) => h + ' Z')].join(' '), tone: 'light' },
    { d: [line([p(T, 0, T), p(T, B, T), p(T, B, Hh), p(T, 0, Hh)], true), ...wallHoles.map((h) => h + ' Z')].join(' '), tone: 'mid' },
    { d: line([p(0, 0, Hh), p(T, 0, Hh), p(T, B, Hh), p(0, B, Hh)], true), tone: 'light' },
  ]
  return { main: [...base, ...holes, ...wallHoles], center: line([p(L - 16, -6, T), p(L - 16, B + 6, T)]), fills }
})()

const buchse = (() => {
  const ox = 20
  const oy = 30
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const ring = (x: number, r: number, a0 = 0, a1 = 360, n = 40, cy = 0, cz = 0): P[] =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
      return p(x, cy + r * Math.cos(t), cz + r * Math.sin(t))
    })
  const bands: [number, number, Tone][] = [
    [-45, 0, 'dark'],
    [0, 40, 'mid'],
    [40, 75, 'light'],
    [75, 105, 'shine'],
    [105, 135, 'light'],
  ]
  const zylinder = (x0: number, x1: number, r: number) => {
    const body = hull([...ring(x0, r), ...ring(x1, r)])
    const fills: Fill[] = [{ d: line(body, true), tone: 'mid' }]
    for (const [b0, b1, tone] of bands) {
      fills.push({ d: line([...ring(x1, r, b0, b1, 8), ...ring(x0, r, b0, b1, 8).reverse()], true), tone })
    }
    const cap = line(ring(x1, r), true)
    fills.push({ d: cap, tone: 'mid' })
    return { fills, edges: [line(body, true), cap] }
  }
  const flansch = zylinder(0, 9, 24)
  const loecher = [45, 135, 225, 315].map((a) => {
    const t = (a * Math.PI) / 180
    return line(ring(9, 3, 0, 360, 24, 18.5 * Math.cos(t), 18.5 * Math.sin(t)), true)
  })
  for (const l of loecher) {
    flansch.fills.push({ d: l, tone: 'hole' })
    flansch.edges.push(l)
  }
  const nabe = zylinder(9, 40, 14)
  const bohrung = line(ring(40, 8), true)
  const fase = line(ring(40, 10.5), true)
  nabe.fills.push({ d: fase, tone: 'light' }, { d: bohrung, tone: 'hole' })
  nabe.edges.push(fase, bohrung)
  const layers: Layer[] = [flansch, nabe]
  return {
    main: layers.flatMap((l) => l.edges),
    center: line([p(-8, 0, 0), p(50, 0, 0)]),
    fills: [] as Fill[],
    layers,
  }
})()

const montage = (() => {
  const ox = 80
  const oy = 18
  const L = 80
  const B = 46
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) => ({
    edges: [
      line([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], true),
      line([p(x0, y1, z1), p(x0, y1, z0), p(x1, y1, z0), p(x1, y1, z1)]),
      line([p(x1, y1, z0), p(x1, y0, z0), p(x1, y0, z1)]),
    ],
    fills: [
      { d: line([p(x0, y1, z1), p(x1, y1, z1), p(x1, y1, z0), p(x0, y1, z0)], true), tone: 'mid' as Tone },
      { d: line([p(x1, y0, z1), p(x1, y1, z1), p(x1, y1, z0), p(x1, y0, z0)], true), tone: 'dark' as Tone },
      { d: line([p(x0, y0, z1), p(x1, y0, z1), p(x1, y1, z1), p(x0, y1, z1)], true), tone: 'light' as Tone },
    ],
  })
  const unten = box(0, L, 0, B, 0, 10)
  const oben = box(14, L - 14, 8, B - 8, 10, 22)
  const schrauben = [
    [24, 16],
    [L - 24, 16],
    [24, B - 16],
    [L - 24, B - 16],
  ].map(([x, y]) => {
    const kopf = isoEllipse(x!, y!, 26, 4, ox, oy)
    const fuss = isoEllipse(x!, y!, 22, 4, ox, oy)
    return { kopf, fuss, seiten: [line([p(x! + 4 * 0.5, y! - 4 * 0.87, 22), p(x! + 4 * 0.5, y! - 4 * 0.87, 26)]), line([p(x! - 4 * 0.5, y! + 4 * 0.87, 22), p(x! - 4 * 0.5, y! + 4 * 0.87, 26)])] }
  })
  const fills: Fill[] = [
    ...unten.fills,
    ...oben.fills,
    ...schrauben.flatMap((s) => [
      { d: s.fuss + ' Z', tone: 'dark' as Tone },
      { d: s.kopf + ' Z', tone: 'shine' as Tone },
    ]),
  ]
  return {
    main: [...unten.edges, ...oben.edges, ...schrauben.flatMap((s) => [s.kopf, ...s.seiten])],
    center: line([p(L / 2, -8, 22), p(L / 2, B + 8, 22)]),
    fills,
  }
})()

const zahnrad = (() => {
  const ox = 70
  const oy = 40
  const H = 11
  const p = (x: number, y: number, z: number) => iso(x, y, z, ox, oy)
  const zaehne = 12
  const ra = 34
  const rf = 27
  const umriss: [number, number][] = []
  const s = (Math.PI * 2) / zaehne
  for (let i = 0; i < zaehne; i++) {
    const a = i * s
    for (const [t, r] of [
      [0, rf],
      [0.12, rf],
      [0.3, ra],
      [0.62, ra],
      [0.8, rf],
    ] as [number, number][]) {
      umriss.push([r * Math.cos(a + t * s), r * Math.sin(a + t * s)])
    }
  }
  const n = umriss.length
  const seiten: { d: string; tone: Tone; tiefe: number; unten: string; kante: string; winkel: number }[] = []
  for (let i = 0; i < n; i++) {
    const [x0, y0] = umriss[i]!
    const [x1, y1] = umriss[(i + 1) % n]!
    const nx = y1 - y0
    const ny = -(x1 - x0)
    if (nx + ny <= 0) continue
    const len = Math.hypot(nx, ny)
    seiten.push({
      d: line([p(x0, y0, H), p(x1, y1, H), p(x1, y1, 0), p(x0, y0, 0)], true),
      tone: nx / len > ny / len ? 'darkk' : 'midk',
      tiefe: x0 + y0 + x1 + y1,
      unten: line([p(x0, y0, 0), p(x1, y1, 0)]),
      kante: line([p(x0, y0, H), p(x0, y0, 0)]),
      winkel: Math.atan2(ny, nx),
    })
  }
  seiten.sort((a, b) => a.tiefe - b.tiefe)
  const oben = line(umriss.map(([x, y]) => p(x, y, H)), true)
  const kreis = (r: number) => isoEllipse(0, 0, H, r, ox, oy)
  const nut: P[] = [p(-2.5, -8.6, H), p(-2.5, -11, H), p(2.5, -11, H), p(2.5, -8.6, H)]
  const bohrung = kreis(9)
  const nabe = kreis(16)
  return {
    main: [oben, nabe, bohrung, line(nut)],
    center: line([p(-44, 0, H), p(44, 0, H)]),
    fills: [
      ...seiten.map((f) => ({ d: f.d, tone: f.tone })),
      { d: [oben, bohrung + ' Z'].join(' '), tone: 'light' as Tone },
      { d: nabe + ' Z ' + bohrung + ' Z', tone: 'shine' as Tone },
      { d: bohrung + ' Z', tone: 'hole' as Tone },
      { d: line(nut, true), tone: 'hole' as Tone },
    ],
  }
})()

const shape = computed(() => ({ welle, fraesteil, winkel, buchse, montage, zahnrad })[props.type])

const viewBox = computed(() => {
  const pts = (paths: string[]) =>
    paths
      .flatMap((d) => [...d.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g)])
      .map((m) => [Number(m[1]), Number(m[2])] as P)
  const body = pts(shape.value.main)
  const xs = body.map((p) => p[0])
  const ys = [...body, ...pts([shape.value.center])].map((p) => p[1])
  const pad = 2
  const x0 = Math.min(...xs) - pad
  const y0 = Math.min(...ys) - pad
  return `${x0.toFixed(1)} ${y0.toFixed(1)} ${(Math.max(...xs) - x0 + pad).toFixed(1)} ${(Math.max(...ys) - y0 + pad).toFixed(1)}`
})
</script>

<template>
  <svg ref="root" :viewBox="viewBox" preserveAspectRatio="xMinYMax meet" :class="['sketch overflow-visible', { 'is-drawn': drawn }]" aria-hidden="true">
    <template v-if="'layers' in shape">
      <g v-for="(layer, li) in shape.layers" :key="'l' + li">
        <g class="fills">
          <path v-for="(f, i) in layer.fills" :key="'f' + i" :d="f.d" :class="`tone-${f.tone}`" />
        </g>
        <path
          v-for="(d, i) in layer.edges"
          :key="'e' + i"
          :d="d"
          class="edge"
          pathLength="1"
          :style="{ '--i': li * 2 + i }"
        />
      </g>
      <path :d="shape.center" class="center" />
    </template>
    <template v-else>
      <g class="fills">
        <path v-for="(f, i) in shape.fills" :key="'f' + i" :d="f.d" :class="`tone-${f.tone}`" />
      </g>
      <path :d="shape.center" class="center" />
      <path
        v-for="(d, i) in shape.main"
        :key="i"
        :d="d"
        class="edge"
        pathLength="1"
        :style="{ '--i': i }"
      />
    </template>
  </svg>
</template>

<style scoped>
.sketch {
  overflow: visible;
}
.edge {
  fill: none;
  stroke: var(--color-navy);
  stroke-width: 0.8;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.fills {
  opacity: 0;
}
.fills path {
  fill-rule: evenodd;
  stroke: none;
}
.tone-shine {
  fill: #f3f5f7;
}
.tone-light {
  fill: #e6eaee;
}
.tone-mid {
  fill: #ccd3da;
}
.tone-dark {
  fill: #b0b9c3;
}
.tone-midk,
.tone-darkk {
  stroke: var(--color-navy) !important;
  stroke-width: 0.8;
  stroke-linejoin: round;
}
.tone-midk {
  fill: #ccd3da;
}
.tone-darkk {
  fill: #b0b9c3;
}
.tone-hole {
  fill: #8d98a5;
}
.is-drawn .fills {
  animation: fade 0.7s ease 1s forwards;
}
.center {
  fill: none;
  stroke: var(--color-teal-dark);
  stroke-width: 0.7;
  stroke-dasharray: 10 2.5 2 2.5;
  opacity: 0;
}
.is-drawn .edge {
  animation: draw 0.9s cubic-bezier(0.45, 0, 0.25, 1) calc(var(--i) * 0.08s) forwards;
}
.is-drawn .center {
  animation: fade 0.6s ease 0.6s forwards;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fade {
  to {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .edge,
  .is-drawn .edge {
    animation: none;
    stroke-dashoffset: 0;
  }
  .fills,
  .is-drawn .fills,
  .center,
  .is-drawn .center {
    animation: none;
    opacity: 1;
  }
}
</style>
