<script setup lang="ts">
const CX = 510
const CY = 234
const R = 172
const RN = 36
const RI = 77

const pt = (deg: number, r = R): [number, number] => {
  const a = (deg * Math.PI) / 180
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}
const f = ([x, y]: [number, number]) => `${x.toFixed(2)} ${y.toFixed(2)}`

const notchAtY = (deg: number, y: number): [number, number] => {
  const [nx, ny] = pt(deg)
  return [nx - Math.sqrt(RN * RN - (y - ny) ** 2), y]
}

const gearPath = (() => {
  const top = notchAtY(39, 133.5)
  const bot = notchAtY(309, 336.5)
  let d = `M626 133.5 H${top[0].toFixed(2)} A${RN} ${RN} 0 0 1 ${f(pt(51))}`
  for (let c = 84; c <= 264; c += 45) {
    d += ` A${R} ${R} 0 0 0 ${f(pt(c - 12))} A${RN} ${RN} 0 0 1 ${f(pt(c + 12))}`
  }
  d += ` A${R} ${R} 0 0 0 ${f(pt(297))} A${RN} ${RN} 0 0 1 ${f(bot)} H626`
  return d
})()

const ringPath = `M${f(pt(-28, RI))} A${RI} ${RI} 0 1 1 ${f(pt(0, RI))} H602`
</script>

<template>
  <svg viewBox="325 50 310 370" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="14">
    <path :d="gearPath" />
    <path :d="ringPath" />
  </svg>
</template>
