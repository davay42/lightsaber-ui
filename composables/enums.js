// MSG DEFINITIONS===========================================================

const msgid_t = {
  //Request messages
  MSG_REQUESTPARAM: 0xF0,

  //State messages
  MSG_LIGHTSABER_STATE: 0x01,          // Turn on/off the lightsaber
  MSG_LIGHTSABER_STATE_ALL: 0x02,      // For return of all states
  MSG_LIGHTSABER_STATE_CALIBIMU: 0x03, // Recalibrate IMU

  //Config messages
  MSG_LIGHTSABER_CONFIG: 0xA0,         // Whole struct of config
  MSG_LIGHTSABER_CONFIG_ALL: 0xB0,     // Whole struct of config
  MSG_LIGHTSABER_CONFIG_SABREMODE: 0xA1,     // Whole struct of sabreMode
  MSG_LIGHTSABER_CONFIG_LEDS: 0xA2,     // Whole struct of leds
  MSG_LIGHTSABER_CONFIG_GESTURE: 0xA3,     // Whole struct of gesture
  MSG_LIGHTSABER_CONFIG_AUDIO: 0xA4,     // Whole struct of audio
  MSG_LIGHTSABER_CONFIG_MIDI: 0xA5,     // Whole struct of midi
  MSG_LIGHTSABER_CONFIG_HUM: 0xA6,     // Whole struct of hum
  MSG_LIGHTSABER_CONFIG_WIFI: 0xA7,     // Whole struct of wifi
  MSG_LIGHTSABER_CONFIG_BLE: 0xA8,     // Whole struct of ble
};


const gesture_en = {
  GESTURE_NONE: 0,
  GESTURE_TWIST: 1,
  GESTURE_SWING: 2,
  GESTURE_CLASH_ON_SWING: 3,
  GESTURE_CLASH_ON_HIT: 4,
  GESTURE_STAB: 5,
  GESTURE_STAB_HOLD: 6,
  GESTURE_SWING_UP: 7,
  GESTURE_SWING_DOWN: 8,
  GESTURE_SWING_LEFT: 9,
  GESTURE_SWING_RIGHT: 10,
  GESTURE_SWING_LEFT_UP: 11,
  GESTURE_SWING_LEFT_DOWN: 12,
  GESTURE_SWING_RIGHT_UP: 13,
  GESTURE_SWING_RIGHT_DOWN: 14
};

export function getEnum(list, num) {
  return Object.keys(list)?.[Object.values(list).indexOf(num)] || 'UNKNOWN';
}

const lightState_en = {
  LIGHT_OFF: 0,
  LIGHT_ON: 1,
  LIGHT_TRANSITION_ON: 2,
  LIGHT_TRANSITION_OFF: 3
};

// Enum for Sabre Mode
const sabreModeConfig_en = {
  MODE_LIGHTSABER: 0,
  MODE_POV: 1,
  MODE_MIDI: 2,
  MODE_PERFORMANCE: 3,
  size: 1
};
// Enum definition for handedness_en
const handedness_en = {
  HANDEDNESS_RIGHT: 0,
  HANDEDNESS_LEFT: 1,
  size: 1
};


export { msgid_t, gesture_en, lightState_en, sabreModeConfig_en, handedness_en }