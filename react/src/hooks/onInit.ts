import {EffectCallback, useEffect} from "react";

export function onInit(callback: EffectCallback) {
  useEffect(callback, []);
}
