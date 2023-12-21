<script setup>

import { useThrottleFn, } from '@vueuse/core'

const actions = {
  'Clash 1': 'soundName=3_crash1',
  'Clash 2': 'soundName=4_crash2',
  'Clash 3': 'soundName=5_crash3',
  'Clash 4': 'soundName=6_crash4',
}

const throttledAction = useThrottleFn(action, 50)

function action(act) {
  console.log(act)
}

</script>

<template lang="pug">
section.flex.flex-col.gap-4
  .flex.flex-wrap.gap-2.p-2.border-1.rounded-xl
    button(v-for="(func, name) in actions", :key="name", @pointerdown="throttledAction(func)") {{name}}
</template>


<style lang="postcss" scoped>
button {
  @apply p-2 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;
}
</style>
