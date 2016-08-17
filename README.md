# nuimo-client.js

## Deprecated

> [Please use wind rider's fork of this library, he's done a miuch better job of maintaining this library than I have][wind-rider]

## Hit the ground runnning

```
npm install --save nuimo-client
```

## What is this?

A simple client library for communicating with the [senic nuimo][nuimo-docs],
via the BLE (Bluetooth Low Energy) API ([read more here][nuimo-ble]).

```javascript
import withNuimo from "nuimo-client";

// log updates
withNuimo().then(nuimo =>
  nuimo.listen(data =>
    console.log(data)));
```

## Missing Features

Due to the partially undocumated nature of the BLE API only a subset of
functionality has been implemented thus far, which is mostly the fly
gesuture.

[wind-rider]: https://github.com/wind-rider/nuimo-client.ts
[nuimo-docs]: https://www.senic.com/developers
[nuimo-ble]: https://medium.com/@senic/developing-for-the-nuimo-controller-7292becfacff
