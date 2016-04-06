import "source-map-support/register";

import NuimoClient from "./client/nuimoClient";
import { createNuimoClient } from "./client/clientFactory";

import { getDevice, getDevices } from "./noblePeripheral/connectToNuimo";

/**
 * @returns Promise<NuimoClient>
 */
export async function withNuimo(): Promise<NuimoClient> {
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

export { Update, ClickUpdate, SwipeUpdate, TurnUpdate } from "./update/update";
