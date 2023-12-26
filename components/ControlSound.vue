<script setup>
import { useConfig } from '../composables/useConfig.js';

import ControlSlider from "./ControlSlider.vue";
import ControlPad from "./ControlPad.vue";

const { config } = useConfig()


function toggleHum() {
  config.hum.humSynthesizer = config.hum.humSynthesizer ? 0 : 1
  console.log(config.hum.humSynthesizer)
}

</script>

<template lang="pug">
section.flex.flex-col.gap-4
  .text-lg Sound
  .flex.flex-wrap.gap-2.p-2.border-1.rounded-xl
    ControlSlider.flex-1(v-model="config.audio.lightOnVolumePCT") Light On Volume
    ControlSlider.flex-1(v-model="config.audio.lightOffVolumePCT") Light Off Volume
    ControlSlider.flex-1(v-model="config.audio.actionVolumePCT") Action Volume
  .flex.flex-wrap.gap-2.border-1.p-2.rounded-xl
    button.flex-1(@pointerdown="toggleHum") {{ config.hum.humSynthesizer ? 'Synth' : 'Sample' }} Hum
    ControlPad.min-w-30.min-h-16.transition(
      :style="{opacity: config.hum.humSynthesizer ? 1 : 0.5}"
      style="flex: 1 1 auto;"
      v-for="num in 5" :key="num"
      v-model:x="config.hum[`hum${num}Freq`]"
      :minX="50"
      :maxX="500"
      v-model:y="config.hum[`hum${num}VolumePCT`]"
      ) HUM{{ num }}

</template>



