/**
 * sets up events listening to updates
 */

import noble from "noble";
import EventEmitter from "events";
import {
  ALL_SERVICES,
  ALL_CHARACTERISTICS,
  SERVICE_SENSOR_UUID,
  SERVICE_MATRIX_UUID,
  CHARACTERISTIC_MATRIX_UUID,
} from "./common-uuids";
import client from "./client";


/**
 * @return {Promise<NuimoClient, error>}
 */
export default function () {
  return getDevice().then(readDevice);
}


/**
 * @return {Promise<noble.Peripheral, error>}
 */
function getDevice() {
  return new Promise((resolve) => {
    noble.on("stateChange", (state) => {
      if (state === "poweredOn") {
        noble.startScanning();
      } else {
        noble.stopScanning();
      }
    });

    noble.on("discover", (peripheral) => {
      if (peripheral.advertisement.localName === "Nuimo") {
        noble.stopScanning();
        resolve(peripheral);
      }
    });
  });
}


/**
 * @param {noble.Peripheral}
 * @return {Promise<NuimoClient, error>}
 */
function readDevice (peripheral) {
  return new Promise((resolve, reject) => {

    const getByUUID = field => (uuid, object) =>
      object[field].find(e => e.uuid === uuid);

    const getService = getByUUID('services');
    const getCharacteristic = getByUUID('characteristics');


    /**
     * discovers the sensor service and it's characteristics
     * @param {error}
     */
    function discoverServicesAndCharacteristics(error) {
      if (error) { return reject(error); }
      peripheral.discoverSomeServicesAndCharacteristics(
        ALL_SERVICES,
        ALL_CHARACTERISTICS,
        setupEmitter
      );
    }

    /**
     * setup each service characteristic of the sensor to emit data on new data
     * when all have been setup with characteristic.notify then resolve the promise
     * @param {error}
     */
    function setupEmitter(error) {
      if (error) { return reject(error); }

      const sensorService = getService(SERVICE_SENSOR_UUID, peripheral);
      const notifiable = sensorService.characteristics;
      const withNotified = Promise.all(notifiable.map(characteristic =>
        new Promise((resolve, reject) =>
          void characteristic.notify([], error =>
            void (!!error ? reject(error) : resolve(characteristic))))));

      withNotified.then(characteristics => {
        const emitter = new EventEmitter();
        const onData = uuid => buffer =>
          void emitter.emit("data", { characteristic: uuid, buffer });

        characteristics.forEach(characteristic =>
          void characteristic.on('data', onData(characteristic.uuid)));

        const matrixCharacteristic =
          getCharacteristic(CHARACTERISTIC_MATRIX_UUID,
            getService(SERVICE_MATRIX_UUID, peripheral));

        resolve(new client.NuimoClient(emitter, matrixCharacteristic, peripheral));
      }).catch(reject);
    }


    /**
     * attmpt to connect to the nuimo peripheral
     */
    peripheral.connect(discoverServicesAndCharacteristics);
  });
}
