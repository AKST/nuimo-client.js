import "source-map-support/register";

export { default as NuimoClient } from "./client/nuimoClient";

export { withNuimo, withNuimos } from "./client/clientFactory";

export { Update, ClickUpdate, SwipeUpdate, TurnUpdate, FlyUpdate } from "./update/update";
