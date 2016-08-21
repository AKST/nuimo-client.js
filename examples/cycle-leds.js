/**
 * To run example
 *
 * cd <project directory
 * npm install
 * ./node_modules/.bin/babel-node ./examples/cycle-leds.js
 */
import withNuimo from "../src";
import images from './led-images';

console.log('Looking for Nuimo device...');
withNuimo().then(nuimo => {
    var ledImages = [];
    var currentIndex = 0;
    console.log('Loading images...');
    for(var key of Object.keys(images)){
        ledImages.push(nuimo.createLEDMatrixBuffer(images[key]));
    }
    
    console.log('Images loaded. Press Nuimo to cycle through loaded images.');
    nuimo.listen(data => {
      if(data.type === 'click' && data.down){
        nuimo.writeLEDS(ledImages[currentIndex], .8, 2);
        currentIndex = (currentIndex+1) % ledImages.length;
      }
    });
}).catch(e => {
   console.log('ERROR', e); 
});
