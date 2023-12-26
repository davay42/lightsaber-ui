<script setup>
import { useGesture } from "@vueuse/gesture";
import { computed, ref } from "vue";
import { useColor } from "../composables/useColor.js";
import appConfig from '../app.config.json'
import ControlColors from './ControlColors.vue'
import ControlSound from './ControlSound.vue'

import ControlState from "./ControlState.vue";
import ControlConfig from "./ControlConfig.vue";
import { useConfig } from "../composables/useConfig.js";

import { useBLE } from "../composables/useBLE.js";
import { useState } from "../composables/useState.js";
import { getEnum, sabreModeConfig_en } from "../composables/enums.js";

import { version } from '../package.json'
getEnum
const { config, inConfig, outConfig } = useConfig()

const { color, hsl } = useColor()
const demo = ref()

useGesture({
  onDrag(e) {
    e.event.preventDefault();
  }
}, {
  domTarget: demo,
  eventOptions: { passive: false }
})


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

</script>

<template lang="pug">
main#app.text-light-300.bg-dark-900.min-h-100svh.flex.flex-col.gap-6
  header.text-2xl.sm-text-3xl.p-8.bg-dark-400.text-white.flex.items-center.gap-4 
    .i-fa6-solid-jedi.text-4xl.text-orange-500
    .p-0.ml-4 Light Saber Lab 
      .text-xs.opacity-70 v.{{ version }}
    .flex-auto
    button.opacity-50.hover-opacity-100(@click="connect()" :class="{'opacity-80':available}" :title="device?.name")
      .i-ph-bluetooth(v-if="available")
      .i-ph-bluetooth-slash(v-else)

  article.flex.flex-auto()
    button.cursor-pointer.transition.absolute.left-6.text-2xl.p-2.z-100(
      :style="{backgroundColor:state.lightState ? hsl: 'hsl(0deg,0%,30%)',opacity: state.lightState ? 1: 0.7}"
      @dblclick.prevent
      @click.prevent="toggleLightState()"
      )
      .i-la-power-off
    aside.flex-0.w-4.mx-10.transition-transform.duration-700.origin-center-bottom.rounded-lg.m-4.border-5(:style="{transform: `scaleY(${state.lightState ? 1:0})`,background:`hsla(0deg,0%,100%,${color.v/50})`,borderColor:hsl, boxShadow:`0px 0px 40px 10px ${hsl}` }")

    .flex.flex-col.gap-2.pr-2
      .flex.flex-wrap.flex-1.gap-6.p-4.bg-dark-200.rounded-lg(ref="demo")
        .flex.flex-wrap.gap-2.w-full
          button.p-2.flex-1.w-full(
            v-for="(_,mode) in 4" :key="mode"
            @pointerdown="config.sabreMode.mode = mode"
            :class="{active: mode == config.sabreMode.mode}"
            ) {{ getEnum(sabreModeConfig_en,mode).slice(5) }}
        ControlState.flex-0
        ControlColors.flex-1.min-w-70
        ControlSound
        ControlConfig

  footer.bg-dark-500.p-6.text-light-800.flex.items-center.gap-2
    .i-la-copyright 
    .p-0  2023 Pirate Bay, Phuket
    .flex-1 
    button.p-2.text-2xl.opacity-50.hover-opacity-100.transition(
      @click="calibrateIMU()"
      title="Calibrate IMU"
      )
      .i-carbon-calibrate
</template>

<style lang="postcss">
button {
  @apply p-4 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;

  &.active {
    @apply font-bold bg-dark-900
  }
}
</style>
