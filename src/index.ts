import "source-map-support/register";

/**
 * sets up events listening to updates
 */

import * as noble from "noble";
import { NuimoClient } from "./client";
import { createNuimoClient } from "./clientFactory";

/**
 * @returns Promise<NuimoClient>
 */
export default function withNuimo(): Promise<NuimoClient> {
    return getDevice().then(createNuimoClient);
}

/**
 * @param  {number} timeout time to search for Nuimos in milliseconds
 * @returns Promise<NuimoClient[]> a list of connected Nuimos
 */
export async function withNuimos(timeout: number): Promise<NuimoClient[]> {
    let peripherals = await getDevices(timeout);
    return Promise.all<NuimoClient>(peripherals.map(createNuimoClient));
}

/**
 * @param  {number} timeout time to search for Nuimos in milliseconds
 * @returns Promise<noble.Peripheral[]> a list of noble.Peripheral
 */
async function getDevices(timeout: number): Promise<noble.Peripheral[]> {
    return new Promise<noble.Peripheral[]>((resolve) => {
        let devices: noble.Peripheral[] = [];

        noble.on("stateChange", (state) => {
            console.log(state);
            if (state === "poweredOn") {
                noble.startScanning();
                setTimeout(finish, timeout);
            } else {
                noble.stopScanning();
            }
        });

        noble.on("discover", (peripheral) => {
            if (peripheral.advertisement.localName === "Nuimo") {
                console.log("discovered nuimo:" + peripheral.uuid);
                devices.push(peripheral);
            }
        });

        function finish() {
            noble.stopScanning();
            resolve(devices);
        }
    });
}

/**
 * @return {Promise<noble.Peripheral, error>}
 */
async function getDevice(): Promise<noble.Peripheral> {
    return new Promise<noble.Peripheral>((resolve) => {
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
