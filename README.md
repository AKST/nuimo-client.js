# nuimo-client.ts

## Hit the ground runnning
Install from Github:
```
npm install --save https://github.com/wind-rider/nuimo-client.ts/releases/download/v0.4.0/nuimo-client-ts-0.4.0.tgz
npm install -g typings # to install the typings manager
typings install --ambient noble node  # to install the required typimgs

```

## What is this?

A simple client library for communicating with the [senic nuimo][nuimo-docs],
via the BLE (Bluetooth Low Energy) API ([read more here][nuimo-ble]).

You can use it with TypeScript, but also with Javascript ES6. 

```typescript
import * as Nuimo from "nuimo-client-ts";

// log updates
Nuimo.withNuimo().then(
    nuimo =>
        nuimo.listen(function(update) {
            console.log(update.type);
            if (update instanceof Nuimo.SwipeUpdate) {
                console.log("casting test");
                let swipeUpdate = <Nuimo.SwipeUpdate>update;
                console.log(swipeUpdate.direction);
            }
        }
        ));
```

## Missing Features

The fly update was added based on the documentation, but I do not have a real device to test with so please let me know whether it works.

[nuimo-docs]: https://www.senic.com/developers
[nuimo-ble]: https://medium.com/@senic/developing-for-the-nuimo-controller-7292becfacff

## Requirements
This library was developed TypeScript 1.8.9 and compiles against ES6 for Promises and async support. Support for ES6 is built into Node 4 and higher.

Make sure that you use the following settings in `tsconfig.json` if you use TypeScript:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "moduleResolution": "node"
  }
}

This package depends on the typings listed in `typings.json` (currently noble and node).
```

## Running the examples
The easiest is to install ts-node:
```
npm install -g ts-node
```

Then run the examples:
```
ts-node ./examples/cycle-leds.ts
ts-node ./examples/leds.ts
ts-node ./examples/leds-multiple-nuimos.ts
ts-node ./examples/serialise.ts
```
## Building the package yourself
Install the dependencies:
```
npm install -g gulp
npm install
typings install
```

Run gulp:
```
gulp build
```

## Port
This project was ported from https://github.com/AKST/nuimo-client.js
and https://github.com/brendonparker/nuimo-client.js to create a TypeScript version
that also supports more than one Nuimo. Thanks go to them for creating the basis
of this package.

## Contributing
This is my first TypeScript package and as such you might see room for improvement. Please create an issue or pull request to give feedback and share your ideas!

Things I could use help with:
- Distribution of the typings dependencies in the NPM package
- Improvement of the project structure and code structure
- Writing tests