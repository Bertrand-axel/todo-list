import {useService} from "../contexts/containerWrapper.tsx";
import {CurrentUserProvider} from "../services/providers/currentUserProvider.ts";
import {useEffect, useState} from "react";
import {User} from "../interfaces/User.ts";

export function Header() {
  const currentUserProvider = useService('CurrentUserProvider') as CurrentUserProvider;
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const subscription = currentUserProvider.user$.subscribe(setUser);
    return () => subscription.unsubscribe();
  }, [])

  return <header>
    <div>{"todo list"} - welcome {user ? user.username : 'home'} !</div>
  </header>
}
