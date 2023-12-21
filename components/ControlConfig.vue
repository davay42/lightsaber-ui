<script setup>
import { ref, watch } from "vue";
import { useBLE } from '../composables/useBLE.js';
import { useConfig } from '../composables/useConfig.js';
import { watchThrottled } from '@vueuse/core';
import { getEnum, msgid_t, sabreModeConfig_en } from '../composables/enums.js'
import ControlSlider from "./ControlSlider.vue";
import ControlPad from "./ControlPad.vue";

const { config, inConfig, outConfig, readConfig, configReady } = useConfig()

const { configCharacteristic, isConnected } = useBLE()

async function requestConfig() {
  let request = readConfig()
  await configCharacteristic.value?.writeValue(request)
  inConfig.value = new Uint8Array((await configCharacteristic.value.readValue()).buffer);
}

watch(
  () => configCharacteristic.value,
  async () => {
    requestConfig()
  }
)

watch(isConnected, (newIsConnected) => {
  if (newIsConnected.valueOf() == true) {
    console.log('Device connected!');
    inConfig.value = requestConfig()
  } else {
    console.log('Device disconnected!');
  }
});


watchThrottled(outConfig, async c => {
  if (!inConfig.value) return
  if (configReady.valueOf() == false) return
  let ack = await configCharacteristic.value.writeValueWithResponse(c.buffer)
  ack && console.log(ack)
  console.log('config sent')
}, { throttle: 200 })

function toggleMode() {
  let m = config.sabreMode.mode
  if (m >= 3) {
    config.sabreMode.mode = 0
  } else {
    config.sabreMode.mode++
  }
}

function toggleHum() {
  config.hum.humSynthesizer = config.hum.humSynthesizer ? 0 : 1
  console.log(config.hum.humSynthesizer)
}


</script>

<template lang="pug">
section.flex.flex-col.gap-4
  .text-lg Config
  .flex.flex-wrap.gap-4
    button.flex-1(@click="requestConfig()") Receive Config
    button.flex-1(@pointerdown="toggleMode") {{ getEnum(sabreModeConfig_en,config.sabreMode.mode) }}

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

  pre.text-xs.bg-dark-100.max-w-90.overflow-x-scroll.opacity-60. 
    IN {{ inConfig }}
    OUT {{ outConfig }}
    {{ config }} 
</template>


<style lang="postcss" scoped>
button {
  @apply p-2 border-1 rounded-lg shadow-sm bg-dark-200 hover-bg-dark-100 hover-shadow-lg transition active-bg-dark-500 active-shadow-sm;
}
</style>
