<script setup>
import { useConfig } from '../../composables/useConfig.js';

import ControlPad from "./ControlPad.vue";

const { config } = useConfig()

function toggleHum() {
  config.hum.humSynthesizer = config.hum.humSynthesizer ? 0 : 1
  console.log(config.hum.humSynthesizer)
}

</script>

<template lang="pug">
section.flex.flex-wrap.gap-4

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



