import {User} from "../interfaces/User.ts";
import {useService} from "../contexts/containerWrapper.tsx";
import {CurrentUserProvider} from "../services/providers/currentUserProvider.ts";

export function useMe(): User | null {
  const currentUserProvider = useService('CurrentUserProvider') as CurrentUserProvider;
  return currentUserProvider.current
}
