import "source-map-support/register";

import withNuimo from "../src";
import * as update from "../src/update";
import images from "./led-images";

console.log("Looking for Nuimo device...");
withNuimo().then(nuimo => {
    let ledImages: Buffer[] = [];
    let currentIndex = 0;
    console.log("Loading images...");
    for (let key of Object.keys(images)){
        ledImages.push(nuimo.createLEDMatrixBuffer(images[key]));
    }

    console.log("Images loaded. Press Nuimo to cycle through loaded images.");
    nuimo.listen(data => {
      if (data.type === "click" && (<update.ClickUpdate>data).down) {
        nuimo.writeLEDS(ledImages[currentIndex], .8, 2);
        currentIndex = (currentIndex + 1) % ledImages.length;
      }
    });
}).catch(e => {
   console.log("ERROR", e);
});
