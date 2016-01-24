import uuids from "./common-uuids";


/**
 * @class
 */
class Update {
  constructor (type, time) {
    this._type = type;
    this._time = time;
  }

  get time () { return this._time; }

  get type () { return this._type; }
}


/**
 * @class
 */
export class ClickUpdate extends Update {
  constructor(down) {
    super("click", Date.now());
    this._down = down;
  }

  get down () { return this._down; }

  accept(vistor) {
    return vistor.withClick(this);
  }
}


/**
 * @class
 */
export class TurnUpdate extends Update {
  constructor(offset) {
    super("turn", Date.now());
    this._offset = offset;
  }

  get offset () { return this._offset; }

  accept(vistor) {
    return vistor.withTurn(this);
  }
}


/**
 * @class
 */
export class SwipeUpdate extends Update {
  constructor(direction) {
    super("swipe", Date.now());
    this._direction = direction;
  }

  get direction () { return this._direction; }

  accept(vistor) {
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
export function updateFactory(characteristicUUID, buffer) {
  switch (characteristicUUID) {
    case uuids.characteristics.turn:
      const offset = buffer.readInt16LE(0);
      return new TurnUpdate(offset);
    case uuids.characteristics.swipe:
      let direction;
      switch (buffer.readInt8(0)) {
        case 0: direction = "l"; break;
        case 1: direction = "r"; break;
        case 2: direction = "u"; break;
        case 3: direction = "d"; break;
      }
      return new SwipeUpdate(direction);
    case uuids.characteristics.click:
      const down = !!buffer.readInt8(0);
      return new ClickUpdate(down);
    default:
      throw new Error(`unidenfied update '${characteristicUUID}'`);
  }
}


export default { updateFactory, SwipeUpdate, ClickUpdate, TurnUpdate, Update };
