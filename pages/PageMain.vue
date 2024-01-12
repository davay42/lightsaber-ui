<script setup>

import { useColor } from "../composables/useColor.js";

import ControlColors from '../components/control/ControlColors.vue'
import ControlSound from '../components/control/ControlSound.vue'
import ControlHum from "../components/control/ControlHum.vue";

import { useConfig } from "../composables/useConfig.js";
import { useState } from "../composables/useState.js";
import { getEnum, sabreModeConfig_en } from "../composables/enums.js";

const { config, inConfig, outConfig } = useConfig()

const { color, hsl } = useColor()

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
article.flex.flex-auto.pt-8
  aside.flex-0.w-4.ml-4.mr-2.sm-mx-6.transition-transform.duration-700.origin-center-bottom.rounded-lg.border-5(:style="{transform: `scaleY(${state.lightState ? 1:0})`,background:`hsla(0deg,0%,100%,${color.v/50})`,borderColor:hsl, boxShadow:`0px 0px 40px 10px ${hsl}` }")

  .grid.sm-grid-cols-2.xl-grid-cols-3.2xl-grid-cols-4.gap-8.mx-2.flex-1.p-4.bg-dark-200.rounded-lg(ref="demo")

    .flex.flex-wrap.gap-2.w-full
      button.p-2.flex-1.w-full(
        v-for="(_,mode) in 4" :key="mode"
        @pointerdown="config.sabreMode.mode = mode"
        :class="{active: mode == config.sabreMode.mode}"
        ) {{ getEnum(sabreModeConfig_en,mode).slice(5) }}

    ControlColors.flex-1.min-w-70
    ControlSound
    ControlHum 

</template>

<style lang="postcss">
button {
  @apply p-4 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;

  &.active {
    @apply font-bold bg-dark-900
  }
}
</style>
