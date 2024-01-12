<script setup>
import { computed, ref } from "vue";

import { useColor } from "../composables/useColor.js";
import { useConfig } from "../composables/useConfig.js";
import { useBLE } from "../composables/useBLE.js";
import { useState } from "../composables/useState.js";

import { version } from '../package.json'

import { RouterLink, RouterView } from 'vue-router'

const { config, inConfig, outConfig } = useConfig()

const { color, hsl } = useColor()

const { device, available, connect } = useBLE()
const { state, toggleLightState, calibrateIMU } = useState()

function setMode() {
  let m = config.sabreMode.mode
  if (m >= 3) {
    config.sabreMode.mode = 0
  } else {
    config.sabreMode.mode++
  }
}

const editGraph = ref(false)

</script>

<template lang="pug">
main#app.text-light-300.bg-dark-900.min-h-100svh.flex.flex-col.gap-0
  header.sticky.top-0.flex.items-end.text-sm.p-2.gap-2.backdrop-blur-lg.z-100.bg-dark-400.bg-opacity-40
    .p-0.op-70 Light Saber Lab 
    .text-xs.op-40 v.{{ version }} 
    .flex-auto
    .p-0.op-40 Pirate Bay, Phuket

  nav.text-2xl.sm-text-3xl.p-2.bg-dark-400.text-white.flex.items-center.gap-4 
    button.cursor-pointer.text-2xl.p-2.z-100(
      :style="{backgroundColor:state.lightState ? hsl: 'hsl(0deg,0%,30%)',opacity: state.lightState ? 1: 0.7}"
      @dblclick.prevent
      @click.prevent="toggleLightState()"
      )
      .i-fa6-solid-jedi
    button.opacity-50.hover-opacity-100(@click="connect()" :class="{'opacity-80':available}" :title="device?.name")
      .i-ph-bluetooth(v-if="available")
      .i-ph-bluetooth-slash(v-else)
    .flex-auto
    router-link.opacity-50.hover-opacity-100(
      to="/"
      )
      .i-la-home
    router-link.opacity-50.hover-opacity-100(
      to="/debug/"
      )
      .i-carbon-calibrate
    router-link.opacity-50.hover-opacity-100( :class="{'animate-pulse scale-150':editGraph}"  to="/nodes/")
      .i-ph-graph



  router-view(v-slot="{ Component }")
    transition(name="fade" mode="out-in")
      keep-alive
        component(:is="Component").
  

</template>

<style lang="postcss">
button {
  @apply p-4 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;

  &.active {
    @apply font-bold bg-dark-900
  }
}

a.router-link-active {
  @apply !opacity-100
}
</style>
