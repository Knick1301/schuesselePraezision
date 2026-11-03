<script setup lang="ts">
import luftbildWebp from '../assets/luftbild-vogesenstrasse.webp'
import luftbildJpg from '../assets/luftbild-vogesenstrasse.jpg'
</script>

<template>
  <div class="relative aspect-[16/10] overflow-hidden border border-navy bg-paper">
    <picture>
      <source :srcset="luftbildWebp" type="image/webp" />
      <img
        :src="luftbildJpg"
        width="1440"
        height="900"
        loading="lazy"
        decoding="async"
        alt="Luftbild der Vogesenstraße in Neuried-Altenheim mit dem Gebäude von Schüssele Präzision, Vogesenstraße 1"
        class="absolute inset-0 size-full object-cover"
      />
    </picture>

    <svg viewBox="0 0 1440 900" class="absolute inset-0 size-full" aria-hidden="true">
      <rect x="648" y="378" width="128" height="248" rx="10" class="halo" />
      <rect x="648" y="378" width="128" height="248" rx="10" class="outline" />
      <path d="M776 400 L880 296 H1316" class="halo-line" />
      <path d="M776 400 L880 296 H1316" class="leader" />
      <rect x="880" y="196" width="436" height="92" class="label-bg" />
      <text x="902" y="238" class="label-title">Schüssele Präzision</text>
      <text x="902" y="274" class="label-sub">Vogesenstraße 1</text>
    </svg>
  </div>
</template>

<style scoped>
.halo {
  fill: none;
  stroke: #fff;
  stroke-width: 9;
  stroke-opacity: 0.85;
}
.outline {
  fill: var(--color-teal);
  fill-opacity: 0.12;
  stroke: var(--color-teal);
  stroke-width: 5;
  stroke-dasharray: 16 8;
}
.halo-line {
  fill: none;
  stroke: #fff;
  stroke-width: 7;
  stroke-opacity: 0.85;
}
.leader {
  fill: none;
  stroke: var(--color-navy);
  stroke-width: 3;
}
.label-bg {
  fill: #fff;
  stroke: var(--color-navy);
  stroke-width: 3;
}
.label-title {
  font-family: var(--font-brand);
  font-weight: 800;
  font-size: 34px;
  fill: var(--color-navy);
}
.label-sub {
  font-family: var(--font-mono);
  font-size: 26px;
  fill: var(--color-navy);
}
</style>
