import * as React from "react";
import {useParams} from "react-router-dom";

export function UserList() {
  let params = useParams()
  return JSON.stringify(params);
}
