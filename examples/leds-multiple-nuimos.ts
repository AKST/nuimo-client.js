import "source-map-support/register";

import * as nuimoLib from "../src";
import {NuimoClient} from "../src/client";

function runLedScriptOnNuimo(nuimo: NuimoClient): void {
  const timeoutPeriod = 1000 / 2;

  setTimeout(function interval() {
    const data = new Buffer(11);
    const init = new Date();

    for (let i = 1; i < 10; i++) {
      const value = Math.floor(Math.random() * 255);
      data.writeUInt8(value, i);
    }

    const brightness = Math.floor(Math.random() * 255);

    nuimo.writeLEDS(data, 1, 0.5).then(() => {
      const next = Math.max(0, timeoutPeriod - ((new Date().getMilliseconds()) - init.getMilliseconds()));
      setTimeout(interval, next);
    }).catch(error => {
      console.error(error);
    });
  }, timeoutPeriod);
}

nuimoLib.withNuimos(5000).then(
  (nuimos: NuimoClient[]) => {
    nuimos.forEach(runLedScriptOnNuimo);
});
