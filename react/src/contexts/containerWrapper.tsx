import {createContext, useContext} from "react";
import {Container} from "../services/container.ts";

const ContainerContext = createContext<Container>(new Container);
export const useContainer = () => useContext(ContainerContext);
export const useService = (service: string) => useContainer().get(service);

export const ContainerWrapper = ({container, children}) => {
  return <ContainerContext.Provider value={container}>
    {children}
  </ContainerContext.Provider>
}
