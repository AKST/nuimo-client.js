import withNuimo from "../src";

/**
 * a serialiser implemented using the update's visitor API
 */
const Serailiser = {
  serialise(update) {
    return {
      type: update.type,
      time: update.time,
      repr: update.accept(this)
    };
  },

  withClick (clickUpdate) {
    return { down: clickUpdate.down };
  },

  withSwipe (swipeUpdate) {
    return { direction: swipeUpdate.direction };
  },

  withTurn (turnUpdate) {
    return { offset: turnUpdate.offset };
  }
};

withNuimo().then(nuimo => {
  nuimo.listen(data => {
    const serialised = Serailiser.serialise(data);
    console.log(JSON.stringify(serialised));
  });
});
