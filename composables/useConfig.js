import { reactive, ref, watch, nextTick, toRaw } from "vue"
import { handedness_en, msgid_t, sabreModeConfig_en } from './enums.js'
import { checkData, getTimestampHigh, getTimestampLow, sendMessage, int32ToBytes, bytesToFloat, uint16ToBytes, floatToBytes, bytesToUInt16, bytesToInt32, bytesToString } from "./utils.js";
import { watchPausable } from '@vueuse/core'

function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

const gesture = {
  handedness: handedness_en.HANDEDNESS_RIGHT,
  twist_threshold: 0.0, // 4 bytes
  noswing_threshold: 0.0, // 4 bytes
  stab_max_rad: 0.0,  // 4 bytes
  clash_threshold: 0.1, // 4 bytes
  cal_acc_bias: [0, 0, 0], // 3 * 4 bytes
  cal_gyro_bias: [0, 0, 0], // 3 * 4 bytes
  cal_mag_bias: [0, 0, 0],  // 3 * 4 bytes
  cal_mag_scale: [0, 0, 0],  // 3 * 4 bytes
  size: 65
};

const audio = {
  lightOnVolumePCT: 50, // 1 byte
  lightOffVolumePCT: 50, // 1 byte
  actionVolumePCT: 50, // 1 byte
  size: 3
};

const hum = {
  humSynthesizer: 0, // 1 byte
  humVolumePCT: 80, // 1 byte
  hum1Freq: 74, // 2 bytes
  hum2Freq: 92, // 2 bytes
  hum3Freq: 278, // 2 bytes
  hum4Freq: 370, // 2 bytes
  hum5Freq: 462, // 2 bytes
  hum1VolumePCT: 25, // 1 byte
  hum2VolumePCT: 66, // 1 byte
  hum3VolumePCT: 35, // 1 byte
  hum4VolumePCT: 20, // 1 byte
  hum5VolumePCT: 16, // 1 byte
  size: 17
};

const midi = {
  midiVolumePCT: 100, // 1 byte
  midiNoteWidthPCT: 20, // 1 byte
  midiNoteSpeedPCT: 50, // 1 byte
  attackTimeMs: 50, // 2 bytes
  decayTimeMs: 50, // 2 bytes
  sustainTimeMs: 5, // 2 bytes
  sustainLevelPCT: 50, // 1 byte
  releaseTimeMs: 500, // 2 bytes
  lpfCutOffFreq: 1150, // 2 bytes
  echoDelayMs: 50, // 2 bytes
  echoDecayPCT: 50, // 1 byte
  size: 17
};

const leds = {
  brightness_max: 80, // 1 byte
  baseColor: [200, 255, 255], // 3 bytes
  size: 4,
};

// Struct for WiFi Configuration
const wifi = {
  ssid: "00000000000000000000000000000000", // 32 bytes
  password: "00000000000000000000000000000000", // 32 bytes
  size: 64,
};

// Struct for BLE Configuration
const ble = {
  statesSenderInterval: 100, // 2 bytes
  size: 2
};

// Stuct for signature
const signature = {
  signature: 0, // 2 bytes
  size: 2
};

const sabreMode = {
  mode: sabreModeConfig_en.MODE_LIGHTSABER,
  size: 1
}

const config = reactive({
  sabreMode,
  leds,
  gesture,
  audio,
  hum,
  midi,
  wifi,
  ble,
  signature,
})

config.size = Object.values(config).reduce((sum, struct) => sum + struct.size, 0)

const timestamp = ref()
const inConfig = ref()
const outConfig = ref()
const configReady = ref(false)
let oldConfig = structuredClone(toRaw(config))


watch(inConfig, async data => {
  pause()
  Object.assign(config, loadConfig(data))
  await nextTick()
  resume()
})


const { stop, pause, resume } = watchPausable(
  config,
  (newConfig) => {
    console.log('config changed ' + configReady.value)

    if (!isEqual(newConfig.sabreMode, oldConfig.sabreMode)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_SABREMODE)
    }
    if (!isEqual(newConfig.leds, oldConfig.leds)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_LEDS)
    }
    if (!isEqual(newConfig.gesture, oldConfig.gesture)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_GESTURE)
    }
    if (!isEqual(newConfig.audio, oldConfig.audio)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_AUDIO)
    }
    if (!isEqual(newConfig.midi, oldConfig.midi)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_MIDI)
    }
    if (!isEqual(newConfig.hum, oldConfig.hum)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_HUM)
    }
    if (!isEqual(newConfig.wifi, oldConfig.wifi)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_WIFI)
    }
    if (!isEqual(newConfig.ble, oldConfig.ble)) {
      outConfig.value = sendConfig(msgid_t.MSG_LIGHTSABER_CONFIG_BLE)
    }

    oldConfig = structuredClone(toRaw(newConfig))

  }, { deep: true })



export function useConfig() {
  return { config, inConfig, outConfig, timestamp, sendConfig, readConfig, configReady }
}

function readConfig() {
  const data = new Uint8Array(2);
  data[0] = msgid_t.MSG_REQUESTPARAM;
  data[1] = msgid_t.MSG_LIGHTSABER_CONFIG_ALL;
  console.log('config request')
  return sendMessage(data, 2);
}

function loadConfig(data) {
  if (!checkData(data)) return

  const cfg = { ...config }

  let currentTimestamp = getTimestampHigh(data)
  let ptr = 1

  while (ptr < data.length) {
    // get timestamp low
    if (data[ptr] & 0b10000000) {
      currentTimestamp = getTimestampLow(currentTimestamp, data, ptr)
      ptr++
    }
    timestamp.value = currentTimestamp
    let command = data[ptr];
    ptr++
    if (command === 0) return
    if (command == msgid_t.MSG_LIGHTSABER_CONFIG_ALL) {
      let result = parseConfig(data, ptr)
      Object.assign(cfg, result.cfg)
      ptr = result.ptr
      configReady.value = true
    }
  }
  console.log(cfg)
  return cfg
}

function parseConfig(data, ptr) {
  let cfg = { ...config }
  cfg.sabreMode.mode = data[ptr];
  ptr++;
  cfg.leds.brightness_max = data[ptr];
  ptr++;
  cfg.leds.baseColor[0] = data[ptr];
  ptr++;
  cfg.leds.baseColor[1] = data[ptr];
  ptr++;
  cfg.leds.baseColor[2] = data[ptr];
  ptr++;
  cfg.gesture.handedness = data[ptr];
  ptr++;
  cfg.gesture.twist_threshold = bytesToFloat(data, ptr);
  ptr += 4;
  cfg.gesture.noswing_threshold = bytesToFloat(data, ptr);
  ptr += 4;
  cfg.gesture.stab_max_rad = bytesToFloat(data, ptr);
  ptr += 4;
  cfg.gesture.clash_threshold = bytesToFloat(data, ptr);
  ptr += 4;
  cfg.gesture.cal_acc_bias[0] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_acc_bias[1] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_acc_bias[2] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_gyro_bias[0] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_gyro_bias[1] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_gyro_bias[2] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_bias[0] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_bias[1] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_bias[2] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_scale[0] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_scale[1] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.gesture.cal_mag_scale[2] = bytesToInt32(data, ptr);
  ptr += 4;
  cfg.audio.lightOnVolumePCT = data[ptr];
  ptr++;
  cfg.audio.lightOffVolumePCT = data[ptr];
  ptr++;
  cfg.audio.actionVolumePCT = data[ptr];
  ptr++;
  cfg.midi.midiVolumePCT = data[ptr];
  ptr++;
  cfg.midi.midiNoteWidthPCT = data[ptr];
  ptr++;
  cfg.midi.midiNoteSpeedPCT = data[ptr];
  ptr++;
  cfg.midi.attackTimeMs = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.decayTimeMs = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.sustainTimeMs = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.sustainLevelPCT = data[ptr];
  ptr++;
  cfg.midi.releaseTimeMs = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.lpfCutOffFreq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.echoDelayMs = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.midi.echoDecayPCT = data[ptr];
  ptr++;
  cfg.hum.humSynthesizer = data[ptr];
  ptr++;
  cfg.hum.humVolumePCT = data[ptr];
  ptr++;
  cfg.hum.hum1Freq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.hum.hum2Freq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.hum.hum3Freq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.hum.hum4Freq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.hum.hum5Freq = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.hum.hum1VolumePCT = data[ptr];
  ptr++;
  cfg.hum.hum2VolumePCT = data[ptr];
  ptr++;
  cfg.hum.hum3VolumePCT = data[ptr];
  ptr++;
  cfg.hum.hum4VolumePCT = data[ptr];
  ptr++;
  cfg.hum.hum5VolumePCT = data[ptr];
  ptr++;
  cfg.wifi.ssid = bytesToString(data, ptr, 32);
  ptr += 32;
  cfg.wifi.password = bytesToString(data, ptr, 32);
  ptr += 32;
  cfg.ble.statesSenderInterval = bytesToUInt16(data, ptr);
  ptr += 2;
  cfg.signature.signature = bytesToUInt16(data, ptr);
  ptr += 2;
  return { cfg, ptr }
}

function sendConfig(msgid = msgid_t.MSG_LIGHTSABER_CONFIG_ALL, cfg = config) {
  const data = new Uint8Array(256).fill(0);
  let ptr = 0;
  data[ptr++] = msgid_t.MSG_LIGHTSABER_CONFIG;
  data[ptr++] = msgid;

  switch (msgid) {
    case msgid_t.MSG_LIGHTSABER_CONFIG_ALL:
      ptr = setSabreModeToBytes(cfg.sabreMode.mode, data, ptr);
      ptr = setLedsToBytes(cfg.leds, data, ptr);
      ptr = setGestureToBytes(cfg.gesture, data, ptr);
      ptr = setAudioToBytes(cfg.audio, data, ptr);
      ptr = setMidiToBytes(cfg.midi, data, ptr);
      ptr = setHumToBytes(cfg.hum, data, ptr);
      ptr = setWifiToBytes(cfg.wifi, data, ptr);
      ptr = setBleToBytes(cfg.ble, data, ptr);
      ptr = setSignatureToBytes(cfg.signature, data, ptr);
      console.log("MAKING PACKET FOR ALL")
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_SABREMODE:
      ptr = setSabreModeToBytes(cfg.sabreMode.mode, data, ptr);
      console.log("MAKING PACKET FOR SABREMODE")
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_LEDS:
      ptr = setLedsToBytes(cfg.leds, data, ptr);
      console.log("MAKING PACKET FOR LEDS")
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_GESTURE:
      ptr = setGestureToBytes(cfg.gesture, data, ptr);
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_AUDIO:
      ptr = setAudioToBytes(cfg.audio, data, ptr);
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_MIDI:
      ptr = setMidiToBytes(cfg.midi, data, ptr);
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_HUM:
      console.log("SPTR = " + ptr)
      ptr = setHumToBytes(cfg.hum, data, ptr);
      console.log("EPTR = " + ptr)
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_WIFI:
      ptr = setWifiToBytes(cfg.wifi, data, ptr);
      break;
    case msgid_t.MSG_LIGHTSABER_CONFIG_BLE:
      ptr = setBleToBytes(cfg.ble, data, ptr);
      break;
    default:
      break;
  }
  return sendMessage(data, ptr + 1);
}



function setSabreModeToBytes(mode, data, ptr) {
  data[ptr] = mode;
  return ptr + 1;
}

function setLedsToBytes(leds, data, ptr) {
  data[ptr] = leds.brightness_max;
  data[ptr + 1] = leds.baseColor[0];
  data[ptr + 2] = leds.baseColor[1];
  data[ptr + 3] = leds.baseColor[2];
  return ptr + 4;
}

function setGestureToBytes(gesture, data, ptr) {
  data[ptr] = gesture.handedness;
  floatToBytes(gesture.twist_threshold, data, ptr + 1);
  floatToBytes(gesture.noswing_threshold, data, ptr + 5);
  floatToBytes(gesture.stab_max_rad, data, ptr + 9);
  floatToBytes(gesture.clash_threshold, data, ptr + 13);
  int32ToBytes(gesture.cal_acc_bias[0], data, ptr + 17);
  int32ToBytes(gesture.cal_acc_bias[1], data, ptr + 21);
  int32ToBytes(gesture.cal_acc_bias[2], data, ptr + 25);
  int32ToBytes(gesture.cal_gyro_bias[0], data, ptr + 29);
  int32ToBytes(gesture.cal_gyro_bias[1], data, ptr + 33);
  int32ToBytes(gesture.cal_gyro_bias[2], data, ptr + 37);
  int32ToBytes(gesture.cal_mag_bias[0], data, ptr + 41);
  int32ToBytes(gesture.cal_mag_bias[1], data, ptr + 45);
  int32ToBytes(gesture.cal_mag_bias[2], data, ptr + 49);
  int32ToBytes(gesture.cal_mag_scale[0], data, ptr + 53);
  int32ToBytes(gesture.cal_mag_scale[1], data, ptr + 57);
  int32ToBytes(gesture.cal_mag_scale[2], data, ptr + 61);

  return ptr + 65;
}

function setAudioToBytes(audio, data, ptr) {
  data[ptr] = audio.lightOnVolumePCT;
  data[ptr + 1] = audio.lightOffVolumePCT;
  data[ptr + 2] = audio.actionVolumePCT;
  return ptr + 3;
}

function setMidiToBytes(midi, data, ptr) {
  data[ptr] = midi.midiVolumePCT;
  data[ptr + 1] = midi.midiNoteWidthPCT;
  data[ptr + 2] = midi.midiNoteSpeedPCT;
  uint16ToBytes(midi.attackTimeMs, data, ptr + 3);
  uint16ToBytes(midi.decayTimeMs, data, ptr + 5);
  uint16ToBytes(midi.sustainTimeMs, data, ptr + 7);
  data[ptr + 9] = midi.sustainLevelPCT;
  uint16ToBytes(midi.releaseTimeMs, data, ptr + 10);
  uint16ToBytes(midi.lpfCutOffFreq, data, ptr + 12);
  uint16ToBytes(midi.echoDelayMs, data, ptr + 14);
  data[ptr + 16] = midi.echoDecayPCT;
  return ptr + 17;
}

function setHumToBytes(hum, data, ptr) {
  data[ptr] = hum.humSynthesizer;
  data[ptr + 1] = hum.humVolumePCT;
  uint16ToBytes(hum.hum1Freq, data, ptr + 2);
  uint16ToBytes(hum.hum2Freq, data, ptr + 4);
  uint16ToBytes(hum.hum3Freq, data, ptr + 6);
  uint16ToBytes(hum.hum4Freq, data, ptr + 8);
  uint16ToBytes(hum.hum5Freq, data, ptr + 10);
  data[ptr + 12] = hum.hum1VolumePCT;
  data[ptr + 13] = hum.hum2VolumePCT;
  data[ptr + 14] = hum.hum3VolumePCT;
  data[ptr + 15] = hum.hum4VolumePCT;
  data[ptr + 16] = hum.hum5VolumePCT;
  return ptr + 17;
}

function setWifiToBytes(wifi, data, ptr) {
  for (let i = 0; i < 32; i++) {
    data[ptr + i] = wifi.ssid.charCodeAt(i);
  }
  for (let i = 0; i < 32; i++) {
    data[ptr + 32 + i] = wifi.password.charCodeAt(i);
  }
  return ptr + 64;
}

function setBleToBytes(ble, data, ptr) {

  uint16ToBytes(ble.statesSenderInterval, data, ptr);
  return ptr + 2;
}

function setSignatureToBytes(signature, data, ptr) {
  uint16ToBytes(signature.signature, data, ptr);
  return ptr + 2;
}

