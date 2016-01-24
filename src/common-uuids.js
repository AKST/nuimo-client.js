export const SERVICE_SENSOR_UUID        = "f29b1525cb1940f3be5c7241ecb82fd2";
export const SERVICE_MATRIX_UUID        = "f29b1523cb1940f3be5c7241ecb82fd1";

export const CHARACTERISTIC_CLICK_UUID  = "f29b1529cb1940f3be5c7241ecb82fd2";
export const CHARACTERISTIC_TURN_UUID   = "f29b1528cb1940f3be5c7241ecb82fd2";
export const CHARACTERISTIC_SWIPE_UUID  = "f29b1527cb1940f3be5c7241ecb82fd2";
export const CHARACTERISTIC_FLY_UUID    = "f29b1526cb1940f3be5c7241ecb82fd2";
export const CHARACTERISTIC_MATRIX_UUID = "f29b1524cb1940f3be5c7241ecb82fd1";

export const serviceMeta = {
  [SERVICE_SENSOR_UUID]: "sensor",
  [SERVICE_MATRIX_UUID]: "matrix",
};

export const characteristicMeta = {
  [CHARACTERISTIC_CLICK_UUID]: "click",
  [CHARACTERISTIC_SWIPE_UUID]: "swipe",
  [CHARACTERISTIC_TURN_UUID]: "turn",
  [CHARACTERISTIC_FLY_UUID]: "fly",
};

export const ALL_CHARACTERISTICS = [
  CHARACTERISTIC_CLICK_UUID,
  CHARACTERISTIC_SWIPE_UUID,
  CHARACTERISTIC_TURN_UUID,
  CHARACTERISTIC_FLY_UUID,
  CHARACTERISTIC_MATRIX_UUID,
];

export const ALL_SERVICES = [
  SERVICE_SENSOR_UUID,
  SERVICE_MATRIX_UUID,
];

export default {
  services: {
    sensor: SERVICE_SENSOR_UUID,
    matrix: SERVICE_MATRIX_UUID,
  },
  characteristics: {
    fly: CHARACTERISTIC_FLY_UUID,
    click: CHARACTERISTIC_CLICK_UUID,
    swipe: CHARACTERISTIC_SWIPE_UUID,
    turn: CHARACTERISTIC_TURN_UUID,
    matrix: CHARACTERISTIC_MATRIX_UUID,
  },
  lists: {
    services: ALL_SERVICES,
    charactistics: ALL_CHARACTERISTICS,
  },
  meta: {
    characteristicMeta,
    serviceMeta,
  },
};
