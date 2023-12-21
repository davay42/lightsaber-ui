
export function sendMessage(data, size) {
  const packet = new Uint8Array(size + 2);
  packMessage(data, size, packet);
  return packet;
}

export function packMessage(data, size, out) {
  const t = 0; //Date.now();
  const headerByte = (1 << 7) | ((t >> 7) & ((1 << 6) - 1));
  const timestampByte = (1 << 7) | (t & ((1 << 7) - 1));

  out[0] = headerByte;
  out[1] = timestampByte;
  for (let i = 0; i < size; i++) {
    out[i + 2] = data[i];
  }
  console.log("Sending: ", out);
}


export function getTimestampHigh(data) {
  return (data[0] & 0b111111) << 7
}

export function getTimestampLow(high, data, ptr) {
  return (high & 0b1111110000000) | (data[ptr] & 0b1111111)
}


export function checkData(data) {
  let size = data.length;

  if (size < 3) {
    console.log("Invalid packet (size < 3)");
    return false;
  }

  // Check MSB
  if (!(data[0] & 0b10000000) || !(data[1] & 0b10000000)) {
    console.log("Invalid packet");
    return false;
  }
  return true
}


// BYTE UTILITIES  ==================================================================
// Function to convert two bytes to int16_t
function bytesToInt16(data, ptr, littleEndian = true) {
  let value = (littleEndian ? data[ptr + 1] << 8 | data[ptr] : data[ptr] << 8 | data[ptr + 1]);
  // Check if the value is negative (sign bit is set)
  if (value & 0x8000) {
    value |= 0xFFFF0000; // Sign extend for negative values
  }
  return value;
}

// Function to convert two bytes to uint16_t
function bytesToUInt16(data, ptr, littleEndian = true) {
  return (littleEndian ? data[ptr + 1] << 8 | data[ptr] : data[ptr] << 8 | data[ptr + 1]);
}

// Function to convert bytes to int32_t
function bytesToInt32(data, ptr, littleEndian = true) {
  let value = (littleEndian ? data[ptr + 3] << 24 | data[ptr + 2] << 16 | data[ptr + 1] << 8 | data[ptr] : data[ptr] << 24 | data[ptr + 1] << 16 | data[ptr + 2] << 8 | data[ptr + 3]);
  // Check if the value is negative (sign bit is set)
  if (value & 0x80000000) {
    value |= 0xFFFFFFFF00000000; // Sign extend for negative values
  }
  return value;
}

// Function to convert bytes to bit
function bytesToBit(data, ptr, bit) {
  return (data[ptr] >> bit) & 1;
}

// Function to convert bytes to float
function bytesToFloat(data, ptr, littleEndian = true) {
  let buffer = new ArrayBuffer(4);
  let view = new DataView(buffer);
  view.setUint8(0, data[ptr]);
  view.setUint8(1, data[ptr + 1]);
  view.setUint8(2, data[ptr + 2]);
  view.setUint8(3, data[ptr + 3]);
  return view.getFloat32(0, littleEndian);
}

// Function to convert bytes to string
function bytesToString(data, ptr, size) {
  let str = "";
  for (let i = 0; i < size; i++) {
    str += String.fromCharCode(data[ptr + i]);
  }
  return str;
}

function floatToBytes(floatValue, data, ptr) {
  const view = new DataView(data.buffer);
  view.setFloat32(ptr, floatValue, true); // The 'true' argument specifies little-endian byte order
}

function uint16ToBytes(uint16Value, data, ptr) {
  const view = new DataView(data.buffer);
  view.setUint16(ptr, uint16Value, true); // The 'true' argument specifies little-endian byte order
}

function int16ToBytes(int16Value, data, ptr) {
  const view = new DataView(data.buffer);
  view.setInt16(ptr, int16Value, true); // The 'true' argument specifies little-endian byte order
}

function int32ToBytes(int32Value, data, ptr) {
  const view = new DataView(data.buffer);
  view.setInt32(ptr, int32Value, true); // The 'true' argument specifies little-endian byte order
}


export {
  int32ToBytes, int16ToBytes, uint16ToBytes, floatToBytes, bytesToBit, bytesToInt16, bytesToString, bytesToFloat, bytesToUInt16, bytesToInt32
}