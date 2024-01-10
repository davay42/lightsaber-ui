<script setup>
import { useGesture } from "@vueuse/gesture";
import { computed, ref } from "vue";
import { useColor } from "../composables/useColor.js";
import appConfig from '../app.config.json'
import ControlColors from './control/ControlColors.vue'
import ControlSound from './control/ControlSound.vue'

import ControlState from "./control/ControlState.vue";
import ControlConfig from "./control/ControlConfig.vue";
import ControlHum from "./control/ControlHum.vue";
import { useConfig } from "../composables/useConfig.js";

import { useBLE } from "../composables/useBLE.js";
import { useState } from "../composables/useState.js";
import { getEnum, sabreModeConfig_en } from "../composables/enums.js";

import { version } from '../package.json'
import NodeEditor from "./NodeEditor.vue";
getEnum
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

    .flex-auto
    button.opacity-50.hover-opacity-100(
      @click="calibrateIMU()"
      title="Calibrate IMU"
      )
      .i-carbon-calibrate
    button.opacity-50.hover-opacity-100(@click="editGraph=!editGraph" :class="{'animate-pulse scale-150':editGraph}" :title="device?.name")
      .i-ph-graph
    button.opacity-50.hover-opacity-100(@click="connect()" :class="{'opacity-80':available}" :title="device?.name")
      .i-ph-bluetooth(v-if="available")
      .i-ph-bluetooth-slash(v-else)


  transition(name="fade" mode="out-in")
    NodeEditor(v-if="editGraph")

    article.flex.flex-auto.pt-8(v-else)


      aside.flex-0.w-4.ml-4.mr-2.sm-mx-6.transition-transform.duration-700.origin-center-bottom.rounded-lg.border-5(:style="{transform: `scaleY(${state.lightState ? 1:0})`,background:`hsla(0deg,0%,100%,${color.v/50})`,borderColor:hsl, boxShadow:`0px 0px 40px 10px ${hsl}` }")

      .grid.sm-grid-cols-2.xl-grid-cols-3.2xl-grid-cols-4.gap-8.mx-2.flex-1.p-4.bg-dark-200.rounded-lg(ref="demo")
        ControlState.flex-0
        .flex.flex-wrap.gap-2.w-full
          button.p-2.flex-1.w-full(
            v-for="(_,mode) in 4" :key="mode"
            @pointerdown="config.sabreMode.mode = mode"
            :class="{active: mode == config.sabreMode.mode}"
            ) {{ getEnum(sabreModeConfig_en,mode).slice(5) }}

        ControlColors.flex-1.min-w-70
        ControlSound
        ControlHum 
        ControlConfig

</template>

<style lang="postcss">
button {
  @apply p-4 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;

  &.active {
    @apply font-bold bg-dark-900
  }
}
</style>
