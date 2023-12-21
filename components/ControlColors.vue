<script setup>
import { ref, watch } from "vue";
import { useGesture } from '@vueuse/gesture'

import { useColor } from "../composables/useColor.js";
import { useConfig } from "../composables/useConfig.js";
const { color, hsl, bytes } = useColor()

const { config } = useConfig()

watch(bytes, c => {
  config.leds.baseColor = c
})

const controlH = ref()
const controlS = ref()
const controlV = ref()

useGesture({
  onDrag(ev) { ev.event.preventDefault(); color.h += ev.delta[0] / 10 },
  onWheel(ev) { ev.event.preventDefault(); color.h -= ev.velocities[0] },
}, { domTarget: controlH, eventOptions: { passive: false } })

useGesture({
  onDrag(ev) { ev.event.preventDefault(); color.s += ev.delta[0] / 10 },
  onWheel(ev) { ev.event.preventDefault(); color.s -= ev.velocities[0] },
}, { domTarget: controlS, eventOptions: { passive: false } })

useGesture({
  onDrag(ev) { ev.event.preventDefault(); color.v += ev.delta[0] / 10 },
  onWheel(ev) { ev.event.preventDefault(); color.v -= ev.velocities[0] },
}, { domTarget: controlV, eventOptions: { passive: false } })

</script>

<template lang='pug'>
section.flex.flex-col.gap-4.items-center.select-none
  .grid.grid-cols-2.gap-4.w-full.h-30
    .control.col-span-2(ref="controlH", :style="{background:hsl }")
      .param HUE
      .line(:style="{left:`${color.h/3.6}%`}")
        .px-2(:style="{marginLeft:`${color.h>310 ? -50 : 0}px`}").

          {{color.h.toFixed(0)}}°
    .control(ref="controlS" :style="{background:`linear-gradient(90deg, hsl(${color.h}deg,0%, ${color.v}%), hsl(${color.h}deg,50%, ${color.v/2}%))`}")
      .param SAT
      .line(:style="{left:`${color.s}%`}")
        .px-2(:style="{marginLeft:`${color.s>60 ? -50 : 0}px`}").

          {{color.s.toFixed(0)}}%
    .control(ref="controlV", :style="{background:`linear-gradient(90deg, hsl(${color.h}deg,${color.s}%, 0%),hsl(${color.h}deg,${color.s}%, 50%))`}")

      .param VAL
      .line(:style="{left:`${color.v}%`}")
        .px-2(:style="{marginLeft:`${color.v>60 ? -50 : 0}px`}").

          {{color.v.toFixed(0)}}%
    
</template>

<style lang="postcss" scoped>
.control {
  @apply rounded relative bg-gray flex items-end cursor-grab active-cursor-grabbing;

  & .param {
    @apply mix-blend-difference font-bold p-1
  }

  & .line {
    @apply mix-blend-difference absolute top-0 bottom-0 w-1 bg-white
  }
}
</style>