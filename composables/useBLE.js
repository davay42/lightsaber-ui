import appConfig from '../app.config.json'
import { onMounted, reactive, shallowReactive, ref, watch } from "vue";

const available = navigator.bluetooth

const optionalServices = Object.values(appConfig.services).map(s => s.service)

const options = {
  filters: [{ namePrefix: appConfig.device.namePrefix }],
  optionalServices
}

const device = ref()
const server = ref()
const services = ref()

const configCharacteristic = ref()
const stateCharacteristic = ref()
const ble = reactive({})

//Make connect variable that call outside function of this file
const isConnected = ref(false)


async function connect() {
  try {

    device.value = await navigator.bluetooth.requestDevice(options);

    server.value = await device.value.gatt.connect();

    device.value.addEventListener('gattserverdisconnected', () => {
      console.log('device disconnected')
    })

    services.value = await server.value.getPrimaryServices();

    // STATE

    const stateService = await server.value.getPrimaryService(appConfig.services.state.service)

    stateCharacteristic.value = await stateService.getCharacteristic(appConfig.services.state.characteristic)

    // CONFIG

    const configService = await server.value.getPrimaryService(appConfig.services.config.service)

    configCharacteristic.value = await configService.getCharacteristic(appConfig.services.config.characteristic)

    // CONNECTED
    isConnected.value = true

  } catch (e) {
    console.log(e)
  }
}


export function useBLE() {
  return {
    ble, available, device, server, connect, configCharacteristic, stateCharacteristic, isConnected
  }
}