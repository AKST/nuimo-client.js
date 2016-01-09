import updates from "./update";


/**
 * @class
 */
export class NuimoClient {
  /**
   * @param {event.EventEmitter}
   * @param {noble.Peripheral}
   */
  constructor (emitter, peripheral) {
    this._emitter = emitter;
    this._peripheral = peripheral;
  }

  /**
   * @param {Function<Update, void>}
   */
  listen (callback) {
    this._emitter.on("data", (data) => {
      callback(updates.updateFactory(data.characteristic, data.buffer));
    });
  }

  /**
   * @param {Function<void>}
   */
  close (callback) {
    this._peripheral.disconnect(callback);
    this._emitter.removeAllListeners("data");
  }
}


export default { NuimoClient };
