import * as noble from "noble";

/**
 * @param  {number} timeout time to search for Nuimos in milliseconds
 * @returns Promise<noble.Peripheral[]> a list of noble.Peripheral
 */
export async function getDevices(timeout: number): Promise<noble.Peripheral[]> {
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
export async function getDevice(): Promise<noble.Peripheral> {
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
