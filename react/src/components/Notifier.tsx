import {useToast} from "../hooks/useToast.ts";
import {useEffect} from "react";
import {enqueueSnackbar, SnackbarProvider} from 'notistack';

export function Notifier() {

  const {source$} = useToast();

  useEffect(
    () => {
      const subscription = source$.subscribe(
        (message) => enqueueSnackbar(message.content, {variant: message.type || 'info'})
      );
      return () => subscription.unsubscribe();
    },
    []
  );

  return <SnackbarProvider />
}
