import {useParams} from "react-router-dom";
import {NotFound} from "./NotFound.tsx";

interface ValidateParamProp {
  param: string,
  regex: RegExp,
  children: Element
}

export function ValidateParam({param, regex, children}: ValidateParamProp) {
  const params = useParams();
  const value = params[param];
  if (typeof value === 'string' && regex.test(value)) {
    return children;
  }

  return <NotFound />
}
