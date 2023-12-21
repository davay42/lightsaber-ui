<script setup>
import { useGesture } from "@vueuse/gesture";
import { computed, ref } from "vue";
import { useColor } from "../composables/useColor.js";
import appConfig from '../app.config.json'
import ControlColors from './ControlColors.vue'
import ControlDevice from './ControlDevice.vue'
import ControlSlider from './ControlSlider.vue'
import ControlState from "./ControlState.vue";
import ControlConfig from "./ControlConfig.vue";
import { useConfig } from "../composables/useConfig.js";

const { config } = useConfig()

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

import { useBLE } from "../composables/useBLE.js";
import { useState } from "../composables/useState.js";

const { device, available, connect } = useBLE()

const { state, toggleLightState } = useState()


</script>

<template lang="pug">
main#app.text-light-300.bg-dark-900.min-h-100svh.flex.flex-col.gap-6
  header.text-2xl.sm-text-3xl.p-8.bg-dark-400.text-white.flex.items-center.gap-4 
    .i-fa6-solid-jedi.text-4xl.text-orange-500
    .p-0.ml-4 Light Saber Lab
    .flex-auto
    button.opacity-50.hover-opacity-100(@click="connect()" :class="{'opacity-80':available}" :title="device?.name")
      .i-ph-bluetooth(v-if="available")
      .i-ph-bluetooth-slash(v-else)
    button.i-la-power-off.cursor-pointer.transition(
      :style="{backgroundColor:state.lightState ? hsl: 'hsl(0deg,0%,90%)',opacity: state.lightState ? 1: 0.7}"
      @dblclick.prevent
      @pointerdown.prevent="toggleLightState()"
      )
  article.flex.flex-auto()

    aside.flex-0.w-4.mx-10.transition-transform.duration-700.origin-center-bottom.rounded-lg.m-4.border-5(:style="{transform: `scaleY(${state.lightState ? 1:0})`,background:`hsla(0deg,0%,100%,${color.v/50})`,borderColor:hsl, boxShadow:`0px 0px 40px 10px ${hsl}` }")

    .flex.flex-col.gap-2.pr-2
      .flex.flex-wrap.flex-1.gap-6.p-4.bg-dark-200.rounded-lg(ref="demo")
        .flex.flex-col.w-full
          ControlDevice
          ControlColors
          ControlSlider.mt-4(v-model="config.leds.brightness_max") Max Brightness
          //- ControlActions
        ControlState
        ControlConfig

  footer.bg-dark-500.p-6.text-light-800.flex.items-center.gap-2
    .i-la-copyright 
    .p-0  2023 Pirate Bay, Phuket
</template>

