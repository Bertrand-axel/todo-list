import {useEffect} from "react";

export function onDelete(callback: () => void) {
  useEffect(() => callback, []);
}
