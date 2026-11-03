<template>
  <h2 class="relative mb-[0.6em] w-fit pr-1 pb-2.5 text-[clamp(1.6rem,4vw,2.6rem)] leading-tight font-bold">
    <slot />
    <span aria-hidden="true" class="absolute right-1 bottom-0 left-0 h-0.5 bg-navy" />
    <span aria-hidden="true" class="absolute right-0 -bottom-[3px] size-2 rounded-full bg-navy" />
  </h2>
</template>
