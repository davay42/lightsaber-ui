<script setup>
import { ref, watch } from "vue";
import { useBLE } from '../../composables/useBLE.js';
import { useConfig } from '../../composables/useConfig.js';
import { watchThrottled } from '@vueuse/core';

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
})

watchThrottled(outConfig, async c => {
  if (!inConfig.value) return
  if (configReady.valueOf() == false) return
  let ack = await configCharacteristic.value.writeValueWithResponse(c.buffer)
  ack && console.log(ack)
  console.log('config sent')
}, { throttle: 200 })

</script>

<template lang="pug">
section.flex.flex-col.p-0.text-xs.bg-dark-100.overflow-scroll.opacity-60.max-h-120
  .flex.flex-col.bg-dark-700.font-mono.text-xs.gap-2.p-4.sticky.top-0
    button.flex-1(@click="requestConfig()") Receive Config
    p IN {{ inConfig?.join(" ") }}
    p OUT {{ outConfig?.join(' ') }}
  pre.bg-dark-900.p-2 {{ config }} 
</template>



