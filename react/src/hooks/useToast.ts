import {useContainer} from "../contexts/containerWrapper.tsx";
import {Message, ToastStack} from "../services/toastStack.ts";

export function useToast() {

  const stack = useContainer().get('ToastStack') as ToastStack;

  function send(message: Message) {
    stack.push(message);
  }

  return {
    source$: stack.source$,
    send,
  }
}
