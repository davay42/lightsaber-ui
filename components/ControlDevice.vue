<script setup>
import { useBLE } from '../composables/useBLE.js';

const { device, available } = useBLE()

</script>

<template lang="pug">
section.flex.flex-col.gap-2(v-if="available")
  .text-10px.rounded-lg.p-2 {{ device?.id }}
</template>


<style lang="postcss" scoped>
button {
  @apply p-2 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;
}
</style>
