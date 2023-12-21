import { reactive, watch, computed } from "vue";
import { useStorage, watchThrottled, } from '@vueuse/core'
import { useClamp } from '@vueuse/math'

export function useColor() {
  const color = reactive({
    h: useStorage('hue', 70),
    s: useClamp(useStorage('sat', 70), 0, 100),
    v: useClamp(useStorage('val', 70), 0, 100)
  })

  const hsl = computed(() => `hsl(${color.h % 360}deg,${color.s}%,${color.v / 2}%)`);

  const bytes = computed(() => [(color.h % 360) / 360 * 255, color.s / 100 * 255, color.v / 100 * 255].map(Math.floor))

  watch(() => color.h, h => {
    color.h = h > 360 ? 0 : h < 0 ? 360 : h
  })

  return { color, hsl, bytes }
}



export function pitchColor(pitch = 0, octave = 0, velocity = 1, alpha = 1) {
  if (octave === undefined) {
    octave = Math.floor(pitch / 12) + 4
  }
  return `hsla(${(pitch % 12) * 30},${velocity * 100}%,${Math.abs(octave + 2) * 8}%,${alpha})`
}

/**
 * Get a color for a certain pitch frequency in Hz
 * */
export function freqColor(freq) {
  return pitchColor(freqPitch(freq), 3)
}

/**
 * Get a pitch from a frequency
 */
export function freqPitch(freq, middleA = 440) {
  return 12 * (Math.log(Number(freq) / middleA) / Math.log(2))
}