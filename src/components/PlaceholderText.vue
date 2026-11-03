<script setup lang="ts">
defineProps<{ dark?: boolean }>()
</script>

<template>
  <span
    class="rounded-[2px] font-mono text-[0.9em]"
    :class="dark ? 'bg-teal/15 text-teal' : 'bg-teal/10 text-teal-dark'"
  >[<slot />]</span>
</template>
