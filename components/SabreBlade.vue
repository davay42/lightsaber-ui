<script setup>
import { useColor } from '../composables/useColor.js';
import { useState } from '../composables/useState.js';

const { state } = useState()

const { color, hsl } = useColor()
</script>

<template lang='pug'>
.flex-0.h-40.mx-0.transition-transform.duration-700.origin-center-bottom.rounded-lg.m-0.border-5(:style="{transform: `scaleY(${state.lightState ? 1:0})`,background:`hsla(0deg,0%,100%,${color.v/50})`,borderColor:hsl, boxShadow:`0px 0px 40px 10px ${hsl}` }")
</template>