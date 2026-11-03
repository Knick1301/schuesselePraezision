/**
 * Kleines 3D-Modell einer CNC-Universal-Fräsmaschine.
 * Welt: x nach rechts, y nach oben, z zum Betrachter. Einheit ≈ 1 cm.
 * Perspektivische Projektion, Rückflächen-Entfernung, Maleralgorithmus pro Bauteil,
 * flache Schattierung nach Flächennormale. Ergebnis: fertige SVG-Pfade.
 */

export type Vec = [number, number, number]
type P2 = [number, number]

const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s]
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const norm = (a: Vec): Vec => mul(a, 1 / (Math.hypot(a[0], a[1], a[2]) || 1))
const centroid = (pts: Vec[]): Vec => mul(pts.reduce(add, [0, 0, 0] as Vec), 1 / pts.length)

/** Flächennormale nach Newell, ausgerichtet an einem Hinweisvektor */
const normalOf = (pts: Vec[], hint: Vec): Vec => {
  let n: Vec = [0, 0, 0]
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!
    const b = pts[(i + 1) % pts.length]!
    n = add(n, [(a[1] - b[1]) * (a[2] + b[2]), (a[2] - b[2]) * (a[0] + b[0]), (a[0] - b[0]) * (a[1] + b[1])])
  }
  n = norm(n)
  return dot(n, hint) < 0 ? mul(n, -1) : n
}

// ---------- Farben ----------
const NAVY = '#14273a'
const TEAL = '#1fa9ba'
const WHITE = '#ffffff'
const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const A = hex(a)
  const B = hex(b)
  return '#' + A.map((v, i) => Math.round(v + (B[i]! - v) * t).toString(16).padStart(2, '0')).join('')
}

type Kind = 'shell' | 'cover' | 'inner' | 'base' | 'part' | 'dark' | 'work' | 'accent' | 'glass' | 'screen'
type LineKind = 'decal' | 'glare' | 'accent' | 'path' | 'center' | 'edge' | 'tangent'

interface Face {
  pts: Vec[]
  holes?: Vec[][]
  kind: Kind
  hint: Vec
  smooth?: boolean // Mantelfläche eines Zylinders: ohne Kanten
  cull?: boolean
}
interface Line {
  pts: Vec[]
  kind: LineKind
  n?: Vec // nur zeichnen, wenn diese Richtung zum Betrachter zeigt
  closed?: boolean
}
interface Obj {
  faces: Face[]
  lines: Line[]
  center: Vec
  delay: number
  extra?: (visible: (f: Face) => boolean) => Line[]
}

// ---------- Grundkörper ----------
const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, kind: Kind, delay: number): Obj => {
  const c: Vec = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]
  const q = (pts: Vec[]): Face => ({ pts, kind, hint: sub(centroid(pts), c), cull: true })
  return {
    center: c,
    delay,
    lines: [],
    faces: [
      q([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]]),
      q([[x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]]),
      q([[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]]),
      q([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]),
      q([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]]),
      q([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]]),
    ],
  }
}

/** senkrechter Zylinder */
const cylinder = (cx: number, cz: number, y0: number, y1: number, r: number, kind: Kind, delay: number, n = 32): Obj => {
  const c: Vec = [cx, (y0 + y1) / 2, cz]
  const ring = (y: number): Vec[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2
      return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)] as Vec
    })
  const bot = ring(y0)
  const top = ring(y1)
  const sides: Face[] = bot.map((b, i) => {
    const j = (i + 1) % n
    const pts: Vec[] = [b, bot[j]!, top[j]!, top[i]!]
    return { pts, kind, hint: sub(centroid(pts), c), cull: true, smooth: true }
  })
  const capT: Face = { pts: top, kind, hint: [0, 1, 0], cull: true }
  const capB: Face = { pts: bot, kind, hint: [0, -1, 0], cull: true }
  return {
    center: c,
    delay,
    lines: [],
    faces: [...sides, capT, capB],
    extra: (visible) => {
      const out: Line[] = []
      const vis = sides.map(visible)
      sides.forEach((s, i) => {
        if (!vis[i]) return
        // Unter- und Oberkante, wo der Deckel nicht sichtbar ist
        if (!visible(capB)) out.push({ pts: [s.pts[0]!, s.pts[1]!], kind: 'edge' })
        if (!visible(capT)) out.push({ pts: [s.pts[3]!, s.pts[2]!], kind: 'edge' })
        // Umrisslinien
        if (!vis[(i + n - 1) % n]) out.push({ pts: [s.pts[0]!, s.pts[3]!], kind: 'edge' })
        if (!vis[(i + 1) % n]) out.push({ pts: [s.pts[1]!, s.pts[2]!], kind: 'edge' })
      })
      return out
    },
  }
}

/** abgerundetes Rechteck in der Ebene z = const */
const rrXY = (x0: number, y0: number, x1: number, y1: number, r: number, z: number, seg = 6): Vec[] => {
  const pts: Vec[] = []
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2)
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a), z])
    }
  }
  corner(x1 - r, y0 + r, -Math.PI / 2)
  corner(x1 - r, y1 - r, 0)
  corner(x0 + r, y1 - r, Math.PI / 2)
  corner(x0 + r, y0 + r, Math.PI)
  return pts
}
/** abgerundetes Rechteck in der Ebene x = const (Koordinaten z/y) */
const rrZY = (z0: number, y0: number, z1: number, y1: number, r: number, x: number): Vec[] =>
  rrXY(z0, y0, z1, y1, r, 0).map(([a, b]) => [x, b, a] as Vec)

const ringRim = (ring: Vec[], depth: number, kind: Kind, inward: boolean): Face[] => {
  const c = centroid(ring)
  return ring.map((a, i) => {
    const b = ring[(i + 1) % ring.length]!
    const pts: Vec[] = [a, b, add(b, [0, 0, -depth]), add(a, [0, 0, -depth])]
    const m = centroid(pts)
    const radial: Vec = [m[0] - c[0], m[1] - c[1], 0]
    return { pts, kind, hint: inward ? mul(radial, -1) : radial, cull: true, smooth: true }
  })
}

/** Körper mit gerundeter Kontur: zwei gleich lange Ringe werden verbunden (Mantel ohne Kanten, Umriss wird berechnet) */
const loft = (bot: Vec[], top: Vec[], kind: Kind, delay: number): Obj & { capT: Face; capB: Face } => {
  const c = centroid([...bot, ...top])
  const n = bot.length
  const sides: Face[] = bot.map((p, i) => {
    const j = (i + 1) % n
    const pts: Vec[] = [p, bot[j]!, top[j]!, top[i]!]
    return { pts, kind, hint: sub(centroid(pts), c), cull: true, smooth: true }
  })
  const capT: Face = { pts: top, kind, hint: sub(centroid(top), c), cull: true }
  const capB: Face = { pts: bot, kind, hint: sub(centroid(bot), c), cull: true }
  return {
    center: c,
    delay,
    lines: [],
    faces: [...sides, capT, capB],
    capT,
    capB,
    extra: (visible) => {
      const out: Line[] = []
      const vis = sides.map(visible)
      sides.forEach((s, i) => {
        if (!vis[i]) return
        if (!visible(capB)) out.push({ pts: [s.pts[0]!, s.pts[1]!], kind: 'edge' })
        if (!visible(capT)) out.push({ pts: [s.pts[3]!, s.pts[2]!], kind: 'edge' })
        if (!vis[(i + n - 1) % n]) out.push({ pts: [s.pts[0]!, s.pts[3]!], kind: 'edge' })
        if (!vis[(i + 1) % n]) out.push({ pts: [s.pts[1]!, s.pts[2]!], kind: 'edge' })
      })
      return out
    },
  }
}

/** Prisma mit abgerundetem Grundriss (x/z), senkrecht von y0 bis y1 */
const roundSlab = (x0: number, x1: number, z0: number, z1: number, r: number, y0: number, y1: number, kind: Kind, delay: number) => {
  const foot = rrXY(x0, z0, x1, z1, r, 0)
  return loft(
    foot.map(([x, z]) => [x, y0, z] as Vec),
    foot.map(([x, z]) => [x, y1, z] as Vec),
    kind,
    delay,
  )
}

type P2L = [number, number]
const rr2 = (x0: number, y0: number, x1: number, y1: number, r: number): P2L[] =>
  rrXY(x0, y0, x1, y1, r, 0).map(([a, b]) => [a, b] as P2L)

/**
 * Senkrechte Platte zwischen den Grundrisspunkten A und B (x/z), mit runden Ecken und optional Fenster.
 * Lokale Koordinaten: s entlang A→B, y nach oben, off = Abstand von der Innenseite nach außen.
 */
function wallPanel(opts: {
  A: P2L
  B: P2L
  y0: number
  y1: number
  t: number
  r: number
  kind: Kind
  delay: number
  away: P2L // Platte zeigt von diesem Punkt weg
  win?: { s0: number; s1: number; y0: number; y1: number; r: number }
}) {
  const { A, B, y0, y1, t, r, kind, delay, away, win } = opts
  const len = Math.hypot(B[0] - A[0], B[1] - A[1])
  const u: P2L = [(B[0] - A[0]) / len, (B[1] - A[1]) / len]
  let nv: P2L = [u[1], -u[0]]
  const mid: P2L = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  if (nv[0] * (mid[0] - away[0]) + nv[1] * (mid[1] - away[1]) < 0) nv = [-nv[0], -nv[1]]
  const at = (s: number, y: number, off: number): Vec => [A[0] + u[0] * s + nv[0] * off, y, A[1] + u[1] * s + nv[1] * off]
  const normal: Vec = [nv[0], 0, nv[1]]

  const outline = rr2(0, y0, len, y1, r)
  const obj = loft(outline.map(([s, y]) => at(s, y, 0)), outline.map(([s, y]) => at(s, y, t)), kind, delay)

  const extras: Obj[] = []
  if (win) {
    const hole = rr2(win.s0, win.y0, win.s1, win.y1, win.r)
    const hOut = hole.map(([s, y]) => at(s, y, t))
    const hIn = hole.map(([s, y]) => at(s, y, 0))
    obj.capT.holes = [hOut]
    obj.capB.holes = [hIn]
    const hc = centroid(hOut)
    obj.faces.push(
      ...hOut.map((a, i) => {
        const j = (i + 1) % hOut.length
        const pts: Vec[] = [a, hOut[j]!, hIn[j]!, hIn[i]!]
        return { pts, kind, hint: sub(hc, centroid(pts)), cull: true, smooth: true } as Face
      }),
    )
    extras.push({
      center: at((win.s0 + win.s1) / 2, (win.y0 + win.y1) / 2, t / 2),
      delay: delay + 0.8,
      faces: [{ pts: hole.map(([s, y]) => at(s, y, t / 2)), kind: 'glass', hint: normal }],
      lines: [
        { pts: [at(win.s1 - 30, win.y1 - 8, t / 2 + 0.1), at(win.s1 - 8, win.y1 - 30, t / 2 + 0.1)], kind: 'glare' },
      ],
    })
  }
  return { obj, extras, at, len, normal }
}

// ---------- Modell: Universal-Fräsmaschine ----------
const W = 260 // Breite Maschinenbett
const D = 150 // Tiefe
const YB = 40 // Oberkante Sockel
const YT = 215 // Oberkante Rückwand
const MID: P2L = [W / 2, 70] // Mitte des Arbeitsraums (für Ausrichtung der Seitenwände)

function buildModel() {
  const objs: { layer: number; obj: Obj; group?: 'spindle' }[] = []
  const put = (layer: number, obj: Obj, group?: 'spindle') => objs.push({ layer, obj, group })

  // --- Sockel / Maschinenbett
  const base = roundSlab(-8, W + 8, 2, D + 22, 10, 0, YB, 'base', 0.1)
  base.lines.push({ pts: rrXY(24, 15, W - 24, 31, 3, D + 22.05), kind: 'decal', n: [0, 0, 1], closed: true })
  put(0, base)

  // --- Rückwand mit Faltenbalg
  const back = roundSlab(20, W - 20, 10, 20, 4, YB, YT, 'shell', 0.4)
  back.lines.push(
    { pts: rrXY(52, 40, W - 52, 176, 4, 20.05), kind: 'decal', n: [0, 0, 1], closed: true },
    ...Array.from({ length: 13 }, (_, i) => ({
      pts: [[54, 48 + i * 10, 20.05], [W - 54, 48 + i * 10, 20.05]] as Vec[],
      kind: 'decal' as LineKind,
      n: [0, 0, 1] as Vec,
    })),
  )
  put(1, back)

  // --- Konsole mit Faltenbalg vorne, Aufspanntisch mit T-Nuten
  const knee = box(76, 184, YB, 86, 42, 104, 'part', 1.2)
  knee.lines.push(
    ...Array.from({ length: 7 }, (_, i) => ({
      pts: [[88 + i * 14, YB + 4, 104.05], [88 + i * 14, 82, 104.05]] as Vec[],
      kind: 'decal' as LineKind,
      n: [0, 0, 1] as Vec,
    })),
  )
  put(2, knee)
  const table = box(46, 214, 86, 100, 50, 112, 'part', 1.5)
  table.lines.push(
    ...[62, 81, 100].map((z) => ({ pts: [[48, 100.05, z], [212, 100.05, z]] as Vec[], kind: 'decal' as LineKind, n: [0, 1, 0] as Vec })),
    { pts: [[46, 93, 112.05], [214, 93, 112.05]], kind: 'decal', n: [0, 0, 1] },
  )
  put(2, table)

  // --- Schraubstock und Werkstück
  put(2, box(98, 152, 100, 105, 66, 96, 'part', 1.8))
  put(2, box(98, 110, 105, 120, 68, 94, 'part', 1.9))
  const work = box(110, 140, 105, 119, 70, 92, 'work', 2.6)
  work.lines.push({
    pts: [[114, 119.05, 74], [136, 119.05, 74], [136, 119.05, 81], [114, 119.05, 81], [114, 119.05, 88], [136, 119.05, 88]],
    kind: 'path',
    n: [0, 1, 0],
  })
  put(2, work)
  put(2, box(140, 152, 105, 120, 68, 94, 'part', 2.0))

  // --- Stößel und Fräskopf
  put(2, roundSlab(104, 146, 14, 74, 6, 182, 204, 'part', 1.6))
  const head = roundSlab(98, 152, 58, 102, 9, 146, 188, 'part', 1.9)
  head.lines.push({ pts: [[104, 176, 102.05], [146, 176, 102.05]], kind: 'decal', n: [0, 0, 1] })
  put(2, head)

  // --- Spindel (bewegt sich)
  put(3, cylinder(125, 80, 136, 146, 10, 'part', 2.2), 'spindle')
  put(3, cylinder(125, 80, 129, 136, 6.5, 'part', 2.3), 'spindle')
  put(3, cylinder(125, 80, 121.5, 129, 2.4, 'dark', 2.4, 16), 'spindle')
  put(3, {
    center: [108, 140, 98],
    delay: 2.6,
    faces: [],
    lines: [{ pts: [[106, 146, 98], [106, 138, 98], [114, 128, 88]], kind: 'accent' }],
  }, 'spindle')

  // --- Seitenwände geschlossen (massiv), mit Revisionsdeckel
  const sideL = wallPanel({ A: [0, 10], B: [0, D], y0: YB, y1: YT, t: 6, r: 6, kind: 'cover', delay: 0.5, away: MID })
  const sideR = wallPanel({ A: [W, 10], B: [W, D], y0: YB, y1: YT, t: 6, r: 6, kind: 'cover', delay: 0.6, away: MID })
  for (const sd of [sideL, sideR]) {
    sd.obj.lines.push(
      { pts: rr2(18, YB + 24, D - 40, YT - 30, 8).map(([s, y]) => sd.at(s, y, 6.05)), kind: 'decal', n: sd.normal, closed: true },
    )
    put(4, sd.obj)
  }

  // --- Deckel (fast deckend, steht leicht über) und vorderer Querträger
  put(4, box(0, W, YT - 22, YT, D - 14, D, 'cover', 0.9))
  put(5, roundSlab(-4, W + 4, 6, D + 3, 5, YT, YT + 7, 'cover', 0.85))

  // --- Fronttüren, nur leicht geöffnet: links groß, rechts schmaler, Mitte offen
  const doors = [
    { A: [4, D + 2] as P2L, B: [104, D + 16] as P2L, delay: 1.0 },
    { A: [W - 4, D + 2] as P2L, B: [W - 84, D + 14] as P2L, delay: 1.15 },
  ]
  for (const dr of doors) {
    const len = Math.hypot(dr.B[0] - dr.A[0], dr.B[1] - dr.A[1])
    const p = wallPanel({
      A: dr.A, B: dr.B, y0: YB + 6, y1: YT - 30, t: 5, r: 10, kind: 'cover', delay: dr.delay, away: [W / 2, 0],
      win: { s0: 14, s1: len - 20, y0: 78, y1: YT - 48, r: 10 },
    })
    const s = len - 10
    p.obj.lines.push({ pts: [p.at(s, 104, 5), p.at(s, 108, 12), p.at(s, 150, 12), p.at(s, 154, 5)], kind: 'accent' })
    put(4, p.obj)
    p.extras.forEach((e) => put(4, e))
  }

  // --- Bedienpult am Schwenkarm an der rechten Seitenwand
  put(5, box(W + 6, W + 30, 168, 176, 112, 120, 'part', 2.3))
  put(5, cylinder(W + 30, 116, 160, 180, 4, 'part', 2.35, 14))
  const pend = wallPanel({
    A: [W + 22, 150], B: [W + 78, 128], y0: 100, y1: 200, t: 10, r: 8, kind: 'shell', delay: 2.5, away: [W + 40, 0],
  })
  const L = pend.len
  pend.obj.lines.push(
    ...[0, 1, 2, 3].flatMap((r) =>
      [0, 1, 2, 3, 4].map((c) => ({
        pts: rr2(7 + c * 8.6, 110 + r * 7.5, 12.5 + c * 8.6, 114.5 + r * 7.5, 1.2).map(([s, y]) => pend.at(s, y, 10.05)),
        kind: 'decal' as LineKind,
        n: pend.normal,
        closed: true,
      })),
    ),
    // Not-Aus
    {
      pts: Array.from({ length: 17 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        return pend.at(L - 9 + 3.5 * Math.cos(a), 114 + 3.5 * Math.sin(a), 10.05)
      }),
      kind: 'accent',
      n: pend.normal,
    },
    // Griffbügel
    { pts: [pend.at(-2, 102, 5), pend.at(-7, 104, 5), pend.at(-7, 196, 5), pend.at(-3, 204, 5), pend.at(L + 3, 204, 5), pend.at(L + 7, 196, 5), pend.at(L + 7, 104, 5), pend.at(L + 2, 102, 5)], kind: 'accent' },
  )
  put(5, pend.obj)
  put(5, {
    center: pend.at(L / 2, 170, 10.1),
    delay: 2.8,
    lines: [],
    faces: [{ pts: rr2(6, 146, L - 6, 194, 3).map(([s, y]) => pend.at(s, y, 10.1)), kind: 'screen', hint: pend.normal }],
  })

  return objs
}

// ---------- Kamera / Rendern ----------
export interface RenderItem {
  d: string
  cls: string
  fill: string
  fo: number
  stroke: string
  sw: number
  delay: number
  draw: boolean // Linie zeichnet sich selbst
}
export interface Scene {
  viewBox: string
  shadow: string
  back: RenderItem[]
  spindle: RenderItem[]
  front: RenderItem[]
  center: string
  construct: string[]
}

export function renderMachine(): Scene {
  const eye: Vec = [370, 250, 950]
  const target: Vec = [160, 118, 70]
  const fwd = norm(sub(target, eye))
  const right = norm(cross(fwd, [0, 1, 0]))
  const up = cross(right, fwd)
  const L = norm([-0.45, 1, 0.55]) // Licht von links oben vorne
  const LS = norm([-0.3, 1, 0.22]) // flacherer Schatten

  const proj = (p: Vec): P2 => {
    const d = sub(p, eye)
    const zc = dot(d, fwd)
    return [dot(d, right) / zc, -dot(d, up) / zc]
  }
  const visible = (f: Face) => !f.cull || dot(normalOf(f.pts, f.hint), sub(eye, centroid(f.pts))) > 0
  const depth = (p: Vec) => dot(sub(p, eye), fwd)

  const shade = (f: Face): { fill: string; fo: number } => {
    const n = normalOf(f.pts, f.hint)
    const b = Math.max(0, dot(n, L))
    const k = 1 - b
    // Zeichnungs-Look: Linien tragen das Bild, Flächen sind nur ein Hauch Farbe
    switch (f.kind) {
      case 'shell': return { fill: mix(WHITE, NAVY, 0.02 + k * 0.1), fo: 0.5 }
      // Verkleidung (Türen, Seitenwände): fast deckend, damit es dahinter ruhig bleibt
      case 'cover': return { fill: mix(WHITE, NAVY, 0.02 + k * 0.09), fo: 0.9 }
      case 'inner': return { fill: mix(WHITE, NAVY, 0.05 + k * 0.08), fo: 0.3 }
      case 'base': return { fill: mix(WHITE, NAVY, 0.16 + k * 0.22), fo: 0.8 }
      case 'part': return { fill: mix(WHITE, NAVY, 0.05 + k * 0.18), fo: 0.6 }
      case 'dark': return { fill: mix(WHITE, NAVY, 0.45 + k * 0.3), fo: 0.85 }
      case 'screen': return { fill: mix(NAVY, TEAL, 0.3), fo: 0.85 }
      case 'work':
      case 'accent':
        return b > 0.6 ? { fill: mix(TEAL, WHITE, (b - 0.6) * 1.1), fo: 0.95 } : { fill: mix(TEAL, NAVY, (0.6 - b) * 0.6), fo: 0.95 }
      case 'glass': return { fill: TEAL, fo: 0.03 }
    }
  }
  const edgeWidth: Record<Kind, number> = {
    shell: 1.1, cover: 1.1, inner: 0.55, base: 1.1, part: 0.65, dark: 0.55, work: 0.8, accent: 0.7, glass: 0.7, screen: 0.6,
  }

  interface Raw { rings: P2[][]; closed: boolean; item: Omit<RenderItem, 'd'> }
  const raws: { back: Raw[]; spindle: Raw[]; front: Raw[] } = { back: [], spindle: [], front: [] }
  const all: P2[] = []

  const model = buildModel()
  const ordered = [...model].sort((a, b) => a.layer - b.layer || depth(b.obj.center) - depth(a.obj.center))

  for (const { obj, group, layer } of ordered) {
    const bucket = group === 'spindle' ? raws.spindle : layer >= 4 ? raws.front : raws.back
    const faces = obj.faces.filter(visible).sort((a, b) => depth(centroid(b.pts)) - depth(centroid(a.pts)))
    for (const f of faces) {
      const { fill, fo } = shade(f)
      const rings = [f.pts, ...(f.holes ?? [])].map((r) => r.map(proj))
      rings.forEach((r) => all.push(...r))
      bucket.push({
        rings,
        closed: true,
        item: f.smooth
          ? { cls: 'seam', fill, fo, stroke: 'none', sw: 0, delay: obj.delay, draw: false }
          : f.kind === 'inner'
            ? // verdeckte Kanten gestrichelt, wie in der technischen Zeichnung
              { cls: 'edge-hidden', fill, fo, stroke: NAVY, sw: edgeWidth.inner, delay: obj.delay + 2.2, draw: false }
            : { cls: `face face--${f.kind}`, fill, fo, stroke: NAVY, sw: edgeWidth[f.kind], delay: obj.delay, draw: true },
      })
    }
    const lines = [...obj.lines, ...(obj.extra ? obj.extra(visible) : [])]
    for (const l of lines) {
      if (l.n && dot(l.n, sub(eye, centroid(l.pts))) <= 0) continue
      const pts = l.pts.map(proj)
      all.push(...pts)
      const style: Record<LineKind, { stroke: string; sw: number }> = {
        decal: { stroke: NAVY, sw: 0.6 },
        glare: { stroke: WHITE, sw: 1.4 },
        accent: { stroke: TEAL, sw: 2.2 },
        path: { stroke: WHITE, sw: 1 },
        center: { stroke: TEAL, sw: 0.7 },
        edge: { stroke: NAVY, sw: 1 },
        tangent: { stroke: NAVY, sw: 0.4 },
      }
      bucket.push({
        rings: [pts],
        closed: !!l.closed,
        item: { cls: `line line--${l.kind}`, fill: 'none', fo: 0, ...style[l.kind], delay: obj.delay + (l.kind === 'path' ? 1.2 : 0.3), draw: true },
      })
    }
  }

  // Schlagschatten auf dem Boden
  const corners: Vec[] = []
  for (const x of [-8, W + 8]) for (const z of [2, D + 22]) for (const y of [0, YT + 7]) corners.push([x, y, z])
  corners.push([W + 80, 200, 130])
  const ground = corners.map((p) => sub(p, mul(LS, p[1] / LS[1]))).map((p) => [p[0], p[2]] as P2)
  const hull = convexHull(ground).map(([x, z]) => proj([x, 0, z]))
  all.push(...hull)

  // Mittellinie Spindelachse (ragt über das Dach hinaus, wie in einer Zeichnung)
  const cl = [proj([125, 114, 80]), proj([125, 212, 80])]

  // Konstruktionslinien (derzeit keine, Zeichnung bleibt ruhig)
  const construct: P2[][] = []
  construct.forEach((l) => all.push(...l))

  // Einpassen
  const xs = all.map((p) => p[0])
  const ys = all.map((p) => p[1])
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const S = 640 / (Math.max(...xs) - minX)
  const PAD = 12
  const T = ([x, y]: P2): P2 => [(x - minX) * S + PAD, (y - minY) * S + PAD]
  const H = (Math.max(...ys) - minY) * S + PAD * 2
  const path = (rings: P2[][], closed: boolean) =>
    rings.map((r) => 'M' + r.map((p) => T(p).map((v) => v.toFixed(1)).join(' ')).join(' L') + (closed ? ' Z' : '')).join(' ')
  const out = (list: Raw[]) => list.map((r) => ({ ...r.item, d: path(r.rings, r.closed) }))


  return {
    viewBox: `0 0 ${640 + PAD * 2} ${H.toFixed(0)}`,
    shadow: path([hull], true),
    back: out(raws.back),
    spindle: out(raws.spindle),
    front: out(raws.front),
    center: path([cl], false),
    construct: construct.map((l) => path([l], false)),
  }
}

function convexHull(points: P2[]): P2[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o: P2, a: P2, b: P2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower: P2[] = []
  for (const pt of p) {
    while (lower.length >= 2 && cr(lower[lower.length - 2]!, lower[lower.length - 1]!, pt) <= 0) lower.pop()
    lower.push(pt)
  }
  const upper: P2[] = []
  for (const pt of p.reverse()) {
    while (upper.length >= 2 && cr(upper[upper.length - 2]!, upper[upper.length - 1]!, pt) <= 0) upper.pop()
    upper.push(pt)
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)]
}
