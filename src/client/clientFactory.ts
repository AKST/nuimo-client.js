import "source-map-support/register";

import {Peripheral, Service, Characteristic} from "noble";
import {EventEmitter} from "events";

import {
    ALL_SERVICES,
    ALL_CHARACTERISTICS,
    SERVICE_SENSOR_UUID,
    SERVICE_MATRIX_UUID,
    CHARACTERISTIC_MATRIX_UUID,
} from "../noblePeripheral/common-uuids";
import NuimoClient from "./nuimoClient";
import { NuimoInternalCharacteristicEvent } from "./interfaces";

/**
 * @param  {Peripheral} peripheral
 * @returns Promise<NuimoClient>
 */
export async function createNuimoClient(peripheral: Peripheral): Promise<NuimoClient> {

    await connectAsync(peripheral);
    await discoverServicesAndCharacteristics(peripheral);

    const emitter = await setupEmitter(peripheral);

    const matrixCharacteristic =
        getCharacteristic(CHARACTERISTIC_MATRIX_UUID,
            getService(SERVICE_MATRIX_UUID, peripheral));

    return new NuimoClient(emitter, matrixCharacteristic, peripheral);
}

/**
 * @param  {Peripheral} peripheral
 * @returns Promise<void>
 */
async function connectAsync(peripheral: Peripheral): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        function callback(connectionError: string) {
            if (connectionError) {
                reject(connectionError);
            } else {
                resolve();
            }
        }

        peripheral.connect(callback);
    });
}

/**
 * discovers the sensor service and it's characteristics
 * @param  {Peripheral} peripheral
 * @returns Promise<void>
 */
async function discoverServicesAndCharacteristics(peripheral: Peripheral): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        function callback(discoveryError: string, services: Service[], characteristics: Characteristic[]) {
            if (discoveryError) {
                reject(discoveryError);
            } else {
                resolve();
            }
        }

        peripheral.discoverSomeServicesAndCharacteristics(
            ALL_SERVICES,
            ALL_CHARACTERISTICS,
            callback
        );
    });
}

function getService(uuid: string, peripheral: Peripheral): Service {
            return peripheral.services.find(service => service.uuid === uuid);
        }

function getCharacteristic(uuid: string, service: Service): Characteristic {
            return service.characteristics.find(characteristic => characteristic.uuid === uuid);
        }



/**
 * setup each service characteristic of the sensor to emit data on new data
 * when all have been setup with characteristic.notify then resolve the promise
 */
async function setupEmitter(peripheral: Peripheral): Promise<EventEmitter> {
            const sensorService = getService(SERVICE_SENSOR_UUID, peripheral);
            const characteristicsToNotify = sensorService.characteristics;
            let notifySetupCharacteristics = await getNotifiedCharacteristics(characteristicsToNotify);
            let emitter = await createEmitterWithDataEvents(notifySetupCharacteristics, peripheral);

            return emitter;
        }



async function getNotifiedCharacteristics(characteristicsToEnableNotify: Characteristic[]): Promise<Characteristic[]> {
            function promisifyNotifyCharacteristic(characteristic: Characteristic): Promise<Characteristic> {
                return new Promise<Characteristic>(function(resolve, reject) {
                    characteristic.notify(true, function(notifyError: string) {
                        (!!notifyError ? reject(notifyError) : resolve(characteristic));
                    });
                });
            };

            return Promise.all<Characteristic>(
                characteristicsToEnableNotify.map(promisifyNotifyCharacteristic));
        };

    async function createEmitterWithDataEvents(
                notifySetupCharacteristics: Characteristic[], peripheral: Peripheral): Promise<EventEmitter> {
        const emitter = new EventEmitter();
        const onData = function(uuid: string) {
            return function(data: NodeBuffer, isNotification: boolean) {
                let nuimoInternalEvent: NuimoInternalCharacteristicEvent = { characteristic: uuid, buffer: data };
                emitter.emit("data", nuimoInternalEvent);
            };
        };

        notifySetupCharacteristics.forEach(characteristic =>
            void characteristic.on("data", onData(characteristic.uuid)));
        return emitter;
    }



