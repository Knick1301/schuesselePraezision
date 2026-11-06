<script setup lang="ts">
withDefaults(defineProps<{ zeilen?: string[] }>(), { zeilen: () => ['A', 'B', 'C'] })
</script>

<template>
  <div class="overflow-x-clip border-y border-navy/10 bg-paper bg-grid p-3 lg:p-5">
    <div class="relative m-[5px] border border-navy/45 outline outline-offset-[5px] outline-navy/20">
      <span aria-hidden="true" class="pointer-events-none absolute top-1.5 right-0 left-8 flex text-[0.65rem] text-navy/50 font-mono">
        <i v-for="n in 6" :key="n" class="flex-1 text-center not-italic">{{ n }}</i>
      </span>
      <span aria-hidden="true" class="pointer-events-none absolute top-8 bottom-0 left-2 flex flex-col text-[0.65rem] text-navy/50">
        <i v-for="z in zeilen" :key="z" class="flex flex-1 items-center not-italic">{{ z }}</i>
      </span>
      <slot />
    </div>
  </div>
</template>
