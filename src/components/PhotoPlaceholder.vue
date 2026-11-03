<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <figure class="flex h-full flex-col">
    <div class="relative min-h-40 flex-1 overflow-hidden border border-navy bg-[#e9edf1]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="absolute inset-0 size-full" aria-hidden="true">
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" vector-effect="non-scaling-stroke" class="text-navy/20" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" vector-effect="non-scaling-stroke" class="text-navy/20" />
      </svg>
      <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-teal/10 px-2 py-1 font-mono text-sm whitespace-nowrap text-teal-dark">
        [Foto: {{ label }}]
      </span>
    </div>
    <figcaption class="mt-2 font-mono text-xs text-navy/60">{{ label }}</figcaption>
  </figure>
</template>
