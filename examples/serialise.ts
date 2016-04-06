import "source-map-support/register";

import { withNuimo } from "../src";
import { Update, ClickUpdate, TurnUpdate, SwipeUpdate } from "../src/update/update";

/**
 * a serialiser implemented using the update's visitor API
 */
const Serialiser = {
  serialise(update: Update) {
    return {
      type: update.type,
      time: update.time,
      repr: update.accept(this)
    };
  },

  withClick (clickUpdate: ClickUpdate) {
    return { down: clickUpdate.down };
  },

  withSwipe (swipeUpdate: SwipeUpdate) {
    return { direction: swipeUpdate.direction };
  },

  withTurn (turnUpdate: TurnUpdate) {
    return { offset: turnUpdate.offset };
  }
};

withNuimo().then(nuimo => {
  nuimo.listen(data => {
    const serialised = Serialiser.serialise(data);
    console.log(JSON.stringify(serialised));
  });
});
