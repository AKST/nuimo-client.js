# nuimo-client.js

A simple client library for communicating with the [senic nuimo][nuimo-docs],
via the BLE (Bluetooth Low Energy) API ([read more here][nuimo-ble]).

```javascript
import withNuimo from "nuimo-client";

// log updates
withNuimo().then(nuimo =>
  nuimo.listen((data) =>
    console.log(data)));
```

## Features

Only a subset of funtionality has been implemented so due to the
undocumented nature of the BLE API at the moment, but included feaures are:

- notifications
  - directional swipes
  - rotation
  - clicks

[nuimo-docs]: https://www.senic.com/developers
[nuimo-ble]: https://medium.com/@senic/developing-for-the-nuimo-controller-7292becfacff
