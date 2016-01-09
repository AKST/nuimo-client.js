import noble from "noble";
import EventEmitter from "events";
import { SERVICE_SENSOR_UUID } from "./common-uuids";
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
    /**
     * this will be passed into the NuimoClient,
     * which will be yielded from the promise
     */
    const emitter = new EventEmitter();

    /**
     * discovers the sensor service and it's characteristics
     * @param {error}
     */
    function discoverServicesAndCharacteristics(error) {
      if (error) { return reject(error); }
      const SERVICE_UUIDS = [SERVICE_SENSOR_UUID];
      peripheral.discoverSomeServicesAndCharacteristics(SERVICE_UUIDS, [], setupEmitter);
    }

    /**
     * setup each service characteristic of the sensor to emit data on new data
     * when all have been setup with characteristic.notify then resolve the promise
     * @param {error}
     */
    function setupEmitter(error) {
      if (error) { return reject(error); }
      let required = 0;
      let configed = 0;
      peripheral.services.forEach(service => {
        required += service.characteristics.length;
        service.characteristics.forEach(characteristic => {
          characteristic.notify([], function () {
            characteristic.on("data", onData(characteristic.uuid));
            configed += 1;
            /**
             * once all the characteristics have been set up to
             * notify, then resolve the promise with the client
             */
            if (configed === required) {
              resolve(new client.NuimoClient(emitter, peripheral));
            }
          });
        });
      });
    }

    /**
     * pipes data into the event emitter used by the NuimoClient
     * @param {string} uuid
     * @return {Function<Buffer, void>}
     */
    function onData(uuid) {
      return buffer => {
        emitter.emit("data", { characteristic: uuid, buffer });
      };
    }

    /**
     * attmpt to connect to the nuimo peripheral
     */
    peripheral.connect(discoverServicesAndCharacteristics);
  });
}
