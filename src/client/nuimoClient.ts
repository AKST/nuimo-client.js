import "source-map-support/register";

import noble = require("noble");
import event = require("events");

import * as updates from "../update/update";
import {NuimoInternalCharacteristicEvent} from "./interfaces";

/**
 * @class
 */
export default class NuimoClient {

    /**
     * @param  {event.EventEmitter} emitter
     * @param  {noble.Characteristic} matrix
     * @param  {noble.Peripheral} peripheral
     */
    constructor(emitter: event.EventEmitter, matrix: noble.Characteristic, peripheral: noble.Peripheral) {
        this._matrix = matrix;
        this._emitter = emitter;
        this._peripheral = peripheral;
    }

    private _emitter: event.EventEmitter;
    private _matrix: noble.Characteristic;
    private _peripheral: noble.Peripheral;

    /**
     * @return {Promise<Buffer>}
     */
    public get leds(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this._matrix.read((error, data) => {
                if (!!error) { return reject(error); }
                resolve({
                    brightness: data.readInt8(11) / 255,
                    delay: data.readInt8(12) / 10,
                    state: data.slice(0, 10)
                });
            });
        });
    }

    /**
     * @returns string - BLE uuid of the device
     */
    public get uuid(): string {
        if (this._peripheral) {
            return this._peripheral.uuid;
        }

        return "";
    }

    /**
     * @param  {string|Array<string>|Array<number>} data
     * @returns Buffer
     */
    public createLEDMatrixBuffer(data: string | Array<string> | Array<number>): Buffer {
        let strData = "";
        if (data instanceof Array) {
            strData = data.join("");
        } else {
            strData = data;
        }

        let tempArr = strData.split("").filter(x => x === "1" || x === "0");
        if (tempArr.length !== 81) {
            throw "data must be 81 bits";
        }

        let output: number[] = [];

        while (tempArr.length > 0) {
            let temp = parseInt(tempArr.splice(0, 8).reverse().join(""), 2);
            output.push(temp);
        }
        return new Buffer(output);
    }

    /**
     * @param  {Buffer} state
     * @param  {number?} brightness (in percentage)
     * @param  {number?} delay (in seconds)
     * @returns Promise
     */
    public writeLEDS(state: Buffer, brightness: number, delay: number): Promise<any> {
    // public writeLEDS(state: Buffer, brightness = 1, delay = 0): Promise<any> {
        // TODO remove these when default parameters work again in Node 
        if (brightness === undefined || brightness === null) {
            brightness = 1;
        }

        if (delay === undefined || delay === null) {
            delay = 0;
        }

        const scaledBrightness = Math.max(0, Math.min(255, Math.floor(brightness * 255)));
        const scaledDelay = Math.max(0, Math.min(255, Math.floor(delay * 10)));
        const newData = new Buffer(13);

        state.copy(newData, 0, 0, 10);
        newData.writeUInt8(scaledBrightness, 11);
        newData.writeUInt8(scaledDelay, 12);

        return new Promise((resolve, reject) =>
            void this._matrix.write(newData, false, error =>
                void !!error ? reject(error) : resolve(null)));
    }

    /**
     * @param  {(update:updates.Update)=>void} callback
     * @returns void
     */
    public listen(callback: (update: updates.Update) => void): void {
        this._emitter.on("data", (data: NuimoInternalCharacteristicEvent) => {
            callback(updates.updateFactory(data.characteristic, data.buffer));
        });
    }

    /**
     * @param  {()=>void} callback
     * @returns void
     */
    public close(callback: () => void): void {
        this._peripheral.disconnect(callback);
        this._emitter.removeAllListeners("data");
    }
}
