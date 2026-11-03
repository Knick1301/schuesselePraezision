<script setup lang="ts">
import { renderMachine, type RenderItem } from '../drawing/machine3d'

const scene = renderMachine()

const style = (it: RenderItem) => ({
  '--delay': `${it.delay}s`,
  '--fo': String(it.fo),
  fill: it.fill,
  stroke: it.stroke,
  strokeWidth: it.sw,
})
</script>

<template>
  <svg class="machine" :viewBox="scene.viewBox" role="img" aria-labelledby="machine-title">
    <title id="machine-title">Zeichnung einer CNC-Fräsmaschine</title>

    <path :d="scene.shadow" class="shadow" />
    <path v-for="(d, i) in scene.construct" :key="'c' + i" :d="d" class="construct" />

    <path
      v-for="(it, i) in scene.back"
      :key="'b' + i"
      :d="it.d"
      :class="[it.cls, { draw: it.draw }]"
      :style="style(it)"
      :pathLength="it.draw ? 1 : undefined"
    />

    <g class="spindle">
      <path :d="scene.center" class="centerline" />
      <path
        v-for="(it, i) in scene.spindle"
        :key="'s' + i"
        :d="it.d"
        :class="[it.cls, { draw: it.draw }]"
        :style="style(it)"
        :pathLength="it.draw ? 1 : undefined"
      />
    </g>

    <path
      v-for="(it, i) in scene.front"
      :key="'f' + i"
      :d="it.d"
      :class="[it.cls, { draw: it.draw }]"
      :style="style(it)"
      :pathLength="it.draw ? 1 : undefined"
    />
  </svg>
</template>

<style scoped>
.machine {
  overflow: visible;
}

path {
  fill-rule: evenodd;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  fill-opacity: 0;
  animation:
    draw 1s cubic-bezier(0.45, 0, 0.25, 1) var(--delay) forwards,
    fill-in 0.7s ease calc(var(--delay) + 0.6s) forwards;
}
.seam {
  opacity: 0;
  fill-opacity: var(--fo);
  animation: fade 0.7s ease calc(var(--delay) + 0.6s) forwards;
}
.line {
  fill: none !important;
}
.line--glare {
  opacity: 0.6;
}
.edge-hidden {
  stroke-dasharray: 3 2.5;
  stroke-opacity: 0.5;
  fill-opacity: var(--fo);
  opacity: 0;
  animation: fade 0.8s ease var(--delay) forwards;
}
.construct {
  fill: none;
  stroke: var(--color-navy);
  stroke-width: 0.5;
  stroke-dasharray: 18 4 2 4;
  opacity: 0;
  animation: construct 1s ease 0.2s forwards;
}

.shadow {
  fill: var(--color-navy);
  opacity: 0;
  animation: shadow 1.2s ease 2.6s forwards;
}
.centerline {
  fill: none;
  stroke: var(--color-teal-dark);
  stroke-width: 0.7;
  stroke-dasharray: 12 3 2 3;
  opacity: 0;
  animation: fade 0.8s ease 3.4s forwards;
}

.spindle {
  animation: plunge 5s ease-in-out 4.5s infinite;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fill-in {
  to { fill-opacity: var(--fo); }
}
@keyframes fade {
  to { opacity: 1; }
}
@keyframes construct {
  to { opacity: 0.35; }
}
@keyframes shadow {
  to { opacity: 0.05; }
}
@keyframes plunge {
  0%, 100% { transform: translateY(0); }
  35%, 65% { transform: translateY(-12px); }
}

@media (prefers-reduced-motion: reduce) {
  .draw,
  .seam,
  .edge-hidden,
  .construct,
  .centerline,
  .shadow,
  .spindle {
    animation: none;
  }
  .edge-hidden { opacity: 1; }
  .construct { opacity: 0.35; }
  .draw { stroke-dashoffset: 0; fill-opacity: var(--fo); }
  .seam,
  .centerline { opacity: 1; }
  .shadow { opacity: 0.05; }
}
</style>
