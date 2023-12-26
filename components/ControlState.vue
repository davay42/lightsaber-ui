<script setup>
import { useState } from '../composables/useState.js';
import { useBLE } from '../composables/useBLE.js'
import { watchOnce } from '@vueuse/core';
import { watch, computed } from 'vue';
import SabreBlade from './SabreBlade.vue';

const { state, inState, outState, timestamp } = useState()

const { stateCharacteristic } = useBLE()
watchOnce(stateCharacteristic, () => {
  stateCharacteristic.value.addEventListener('characteristicvaluechanged',
    value => {
      inState.value = new Uint8Array(value.target.value.buffer)
    })

  stateCharacteristic.value.startNotifications()

  watch(outState, s => {
    stateCharacteristic.value.writeValue(s)
  })
})

const orientation = computed(() => {
  return {
    roll: state.rollCentiDeg / 100,
    pitch: state.pitchCentiDeg / 100,
    yaw: state.yawCentiDeg / 100
  }
})

</script>

<template lang="pug">
section.flex.flex-col.gap-2.items-center.w-full
  .flex.flex-wrap.relative.font-mono.text-xs
    .p-1.text-center.w-20(
      style="flex:0 1 80px"
      v-for="(angle,axis) in orientation") {{ axis }} 
      .p-0 {{ angle.toFixed() }}°
    .p-8.absolute.right-20.-top-50.pointer-events-none(
      :style="{transform:`rotateX(${orientation.roll}deg) rotateY(${orientation.pitch}deg) rotateZ(${orientation.yaw}deg)`}"
      )
      SabreBlade
</template>


<style lang="postcss" scoped>
button {
  @apply p-2 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;
}
</style>
