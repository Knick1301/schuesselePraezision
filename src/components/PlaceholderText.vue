<script setup lang="ts">
/** Markiert Angaben, die noch vom Kunden kommen müssen. */
defineProps<{ dark?: boolean }>()
</script>

<template>
  <span
    class="rounded-[2px] px-1 py-px font-mono text-[0.9em]"
    :class="dark ? 'bg-teal/15 text-teal' : 'bg-teal/10 text-teal-dark'"
  >[<slot />]</span>
</template>
