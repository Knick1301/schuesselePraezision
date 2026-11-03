<template>
  <!-- Überschrift mit Linie und Punkt am Ende – wie die Linien im Logo -->
  <h2 class="relative mb-[0.6em] pb-2.5 text-[clamp(1.6rem,4vw,2.2rem)] leading-tight font-semibold">
    <slot />
    <span aria-hidden="true" class="absolute bottom-0 left-0 h-0.5 w-14 bg-teal" />
    <span aria-hidden="true" class="absolute -bottom-[3px] left-14 size-2 rounded-full bg-teal" />
  </h2>
</template>
