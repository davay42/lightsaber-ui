import { reactive, ref, watch } from 'vue'
import { checkData, getTimestampHigh, getTimestampLow } from './utils.js'
import { lightState_en, msgid_t } from './enums.js'
import { bytesToBit, bytesToInt16, sendMessage } from './utils.js'

const state = reactive({
  lightState: 0,
  running: 0,
  audioOutput: 0,
  charging: 0,
  sdCard: 0,
  imu: 0,
  reserved: 0,
  batteryVoltage: 0,
  rollCentiDeg: 0,
  pitchCentiDeg: 0,
  yawCentiDeg: 0,
  gestureState: 0,
  lastGestureActive: 0,
  size: 11
})

const timestamp = ref()
const inState = ref()
const outState = ref()

watch(inState, loadState)

export function useState() {
  return {
    state, inState, outState, timestamp, loadState, toggleLightState
  }
}

function toggleLightState() {
  const data = new Uint8Array(2);
  data[0] = msgid_t.MSG_LIGHTSABER_STATE;
  data[1] = state.lightState == lightState_en.LIGHT_ON ? 0 : 1;
  outState.value = sendMessage(data, 2);
}

function loadState(data = inState.value) {
  if (!checkData(data)) return

  // console.log("==============NEW MSG=================")
  // console.log("total " + data)
  // let currentTimestamp = getTimestampHigh(data)
  let ptr = 0
  let currentTimestamp = (data[ptr] & 0b00111111) << 7
  // console.log("ptr " + ptr + " = " + data[ptr])
  ptr++

  while (ptr < data.length) {
    // get timestamp low
    if (data[ptr] & 0b10000000) {
      currentTimestamp = (currentTimestamp & 0b1111110000000) | (data[ptr] & 0b1111111)
      // console.log("ptr " + ptr + " = " + data[ptr])
      ptr++
    }
    timestamp.value = currentTimestamp
    let command = data[ptr];
    // console.log("ptr " + ptr + " = " + data[ptr])
    ptr++
    if (command === 0) return
    if (command == msgid_t.MSG_LIGHTSABER_STATE_ALL) {
      let result = parseState(data, ptr);
      Object.assign(state, result.states);
      ptr = result.ptr;
      // console.log("PTR NOW " + ptr)
    } else {
      // console.log("Invalid command")
      // console.log(command)
    }
  }
  // console.log("==============END MSG=================")
}

function parseState(data, ptr) {
  let states = {}
  // console.log("Parsing zone =====")
  for (let i = ptr; i < 14; i++) {
    // console.log("ptr " + i + " = " + data[i])
  }
  states.lightState = data[ptr];
  // if(states.lightState > 3) console.log("Invalid light state")
  ptr++;
  states.running = bytesToBit(data, ptr, 0);
  states.audioOutput = bytesToBit(data, ptr, 1);
  states.charging = bytesToBit(data, ptr, 2);
  states.sdCard = bytesToBit(data, ptr, 3);
  states.imu = bytesToBit(data, ptr, 4);
  states.reserved = data[ptr] >> 5 & 0b111;
  ptr++;
  states.batteryVoltage = data[ptr];
  ptr++;
  states.rollCentiDeg = bytesToInt16(data, ptr);
  ptr += 2;
  states.pitchCentiDeg = bytesToInt16(data, ptr);
  ptr += 2;
  states.yawCentiDeg = bytesToInt16(data, ptr);
  ptr += 2;
  states.gestureState = data[ptr];
  ptr++;
  states.lastGestureActive = data[ptr];
  ptr++;
  return { ptr, states };
}



