import {useState} from "react";

function useLogin() {
  [logged, setLogged] = useState(false);


  return {
    logged,
    tes() {},
  }
}
