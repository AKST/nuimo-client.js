import "source-map-support/register";

import uuids from "../noblePeripheral/common-uuids";

/**
 * @class
 */
export abstract class Update {
  constructor (type: string, time: number) {
    this._type = type;
    this._time = new Date(time);
  }

  private _type: string;
  private _time: Date;

  get time () { return this._time; }

  get type () { return this._type; }

  public abstract accept(vistor: any): any;
}


/**
 * @class
 */
export class ClickUpdate extends Update {
  constructor(down: boolean) {
    super("click", Date.now());
    this._down = down;
  }

  private _down: boolean;

  get down () { return this._down; }

  public accept(vistor: any) {
    return vistor.withClick(this);
  }
}


/**
 * @class
 */
export class TurnUpdate extends Update {
  constructor(offset: number) {
    super("turn", Date.now());
    this._offset = offset;
  }

  private _offset: number;

  get offset () { return this._offset; }

  public accept(vistor: any) {
    return vistor.withTurn(this);
  }
}


/**
 * @class
 */
export class SwipeUpdate extends Update {
  constructor(direction: string) {
    super("swipe", Date.now());
    this._direction = direction;
  }

  private _direction: string;

  get direction () { return this._direction; }

  public accept(vistor: any) {
    return vistor.withSwipe(this);
  }
}

export class FlyUpdate extends Update {
    constructor(direction: string, speed: number) {
    super("fly", Date.now());
    this._direction = direction;
    this._speed = speed;
  }

  private _direction: string;
  private _speed: number;

  get direction () { return this._direction; }
  get speed () { return this._speed; }

  public accept(vistor: any) {
    return vistor.withSwipe(this);
  }
}


/**
 * parses the updates buffer representation, and returns an update
 * see here https://cdn-images-2.medium.com/max/1600/1*lL52VX2WKOUu1ezul4FQrQ.jpeg
 *
 * @param {UUID} (a uuid string)
 * @param {Buffer} (a node buffer)
 * @return Update
 */
export function updateFactory(characteristicUUID: string, buffer: Buffer): Update {
  switch (characteristicUUID) {
    case uuids.characteristics.turn:
      const offset = buffer.readInt16LE(0);
      return new TurnUpdate(offset);
    case uuids.characteristics.swipe:
      let swipeDirection: string;
      switch (buffer.readInt8(0)) {
        case 0: swipeDirection = "l"; break;
        case 1: swipeDirection = "r"; break;
        case 2: swipeDirection = "u"; break;
        case 3: swipeDirection = "d"; break;
      }
      return new SwipeUpdate(swipeDirection);
    case uuids.characteristics.click:
      const down = !!buffer.readInt8(0);
      return new ClickUpdate(down);
    case uuids.characteristics.fly:
      // FlyUpdate was added from documentation, but I have no real device to test with      
      let flyDirection: string;
      switch (buffer.readInt8(0)) {
        case 0: flyDirection = "l"; break;
        case 1: flyDirection = "r"; break;
        case 2: flyDirection = "b"; break;
        case 3: flyDirection = "t"; break;

        //TODO check up/down
        case 4: flyDirection = "u"; break;
        case 5: flyDirection = "d"; break;
      }
      const speed = buffer.readInt8(1);
      return new FlyUpdate(flyDirection, speed);
    default:
      throw new Error(`unidenfied update '${characteristicUUID}'`);
  }
}
