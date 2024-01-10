<script setup>
import { ref, watch } from "vue";
import { useGesture } from '@vueuse/gesture'


const model = defineModel({ local: true, default: 0 })

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  units: { type: String, default: '%' },
  vertical: { type: Boolean, default: false }
})

const domTarget = ref()

const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

useGesture({
  onDrag(ev) {
    ev.event.preventDefault();
    model.value = clamp(model.value + ev.delta[props.vertical ? 1 : 0] / 10, props.min, props.max)
  },
  onWheel(ev) {
    ev.event.preventDefault();
    model.value = clamp(model.value - ev.velocities[props.vertical ? 1 : 0], props.min, props.max)
  },
}, { domTarget, eventOptions: { passive: false } })


</script>

<template lang='pug'>
.control(ref="domTarget")
  .param.z-20
    slot PARAM 
  .rect.absolute.bottom-0.left-0.w-full.h-full.bg-light-400.bg-opacity-50(
    :style="{width:`${100*(model-min)/(max-min)}%`}"
    )

  .line(:style="{left:`${100*(model-min)/(max-min)}%`}")
    .px-2(:style="{marginLeft:`${(model-min)/(max-min)>.8 ? -60 : 0}px`}").
      {{model.toFixed(0)}}{{ units }}
</template>

<style lang="postcss" scoped>
.control {
  @apply rounded overflow-hidden relative bg-gray flex items-end cursor-grab active-cursor-grabbing p-1;

  & .param {
    @apply mix-blend-difference font-bold p-0 pt-5
  }

  & .line {
    @apply mix-blend-difference absolute top-0 bottom-0 w-1 bg-white pt-2px
  }
}
</style>