<script setup lang="ts">
defineProps<{ dunkel?: boolean }>()
</script>

<template>
  <span class="px-1" :class="dunkel ? 'bg-white/10 text-[#74d3de]' : 'bg-teal/10 text-teal-dark'">[<slot />]</span>
</template>
