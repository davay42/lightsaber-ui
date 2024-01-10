<script setup>
import { ref, watch } from "vue";
import { useGesture } from '@vueuse/gesture'
import { freqColor } from "../../composables/useColor.js";

const modelX = defineModel('x', { local: true, default: 0 })
const modelY = defineModel('y', { local: true, default: 0 })

const props = defineProps({
  minX: { type: Number, default: 0 },
  maxX: { type: Number, default: 100 },
  minY: { type: Number, default: 0 },
  maxY: { type: Number, default: 100 },
  unitsX: { type: String, default: 'Hz' },
  unitsY: { type: String, default: '%' },
})

const domTarget = ref()

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

useGesture({
  onDrag(ev) {
    ev.event.preventDefault();
    modelX.value = clamp(modelX.value + ev.delta[0] / 10, props.minX, props.maxX)
    modelY.value = clamp(modelY.value - ev.delta[1] / 10, props.minY, props.maxY)
  },
  onWheel(ev) {
    ev.event.preventDefault();
    modelX.value = clamp(modelX.value - ev.velocities[0], props.minX, props.maxX)
    modelY.value = clamp(modelY.value + ev.velocities[1], props.minY, props.maxY)
  },
}, { domTarget, eventOptions: { passive: false } })


</script>

<template lang='pug'>
.control(ref="domTarget")
  .param.z-20
    slot PARAM 
  .rect.absolute.bottom-0.left-0.w-full.h-full.bg-light-200.bg-opacity-24(
    :style="{width:`${100*(modelX-minX)/(maxX-minX)}%`}"
    )
  .rect.absolute.bottom-0.left-0.w-full.h-full.bg-light-200.bg-opacity-24(
    :style="{height:`${100*(modelY-minY)/(maxY-minY)}%`}"
    )

  .line(:style="{left:`${100*(modelX-minX)/(maxX-minX)}%`,backgroundColor: unitsX =='Hz' ? freqColor(modelX) : '#eee8'}")
    .px-2(:style="{marginLeft:`${(modelX-minX)/(maxX-minX)>.8 ? -60 : 0}px`}").
      {{modelX.toFixed(0)}}{{ unitsX }}

  .mix-blend-difference.absolute.left-0.right-0.h-1.bg-white.pl-2px(:style="{bottom:`${100*(modelY-minY)/(maxY-minY)}%`}")
    .px-2.right-2.absolute.top-1(:style="{top:`${(modelY-minY)/(maxY-minY)<.3 ? -20 : 0}px`}").
      {{modelY.toFixed(0)}}{{ unitsY }}
</template>

<style lang="postcss" scoped>
.control {
  @apply rounded-xl overflow-hidden relative bg-gray flex items-end cursor-grab active-cursor-grabbing p-1;

  & .param {
    @apply mix-blend-difference font-bold p-0 pt-5
  }

  & .line {
    @apply absolute top-0 bottom-0 w-1 bg-white pt-2px
  }
}
</style>