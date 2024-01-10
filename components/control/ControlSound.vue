<script setup>
import { useConfig } from '../../composables/useConfig.js';

import ControlSlider from "./ControlSlider.vue";

const { config } = useConfig()


</script>

<template lang="pug">
section.flex.flex-wrap.items-center.gap-4.p-2
  .text-lg Sound

  ControlSlider.flex-auto(v-model="config.audio.lightOnVolumePCT") Light On Volume
  ControlSlider.flex-auto(v-model="config.audio.lightOffVolumePCT") Light Off Volume
  ControlSlider.flex-auto(v-model="config.audio.actionVolumePCT") Action Volume

</template>



