<script setup>
import ControlConfig from "../components/control/ControlConfig.vue";
import ControlState from "../components/control/ControlState.vue";
import { useState } from "../composables/useState.js";

const { state, toggleLightState, calibrateIMU } = useState()

</script>

<template lang="pug">
article.grid.p-8.sm-grid-cols-2.md-grid-cols-3.gap-8
  ControlState.flex-0
  button.opacity-50.hover-opacity-100.flex.gap-4.items-center(
    @click="calibrateIMU()"
    title="Calibrate IMU"
    )
    .i-carbon-calibrate
    .p-0 Calibrate IMU
  ControlConfig

</template>

<style lang="postcss"></style>
