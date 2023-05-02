import {createContext, useContext, useState} from "react";

interface AuthContextValue {
  user: IUser;
  login: (string) => Promise<IUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const useAuthData = () => useContext(AuthContext);

export interface IUser {
  email: null | string;
  username: null | string;
  logged: boolean;
}

export const AuthWrapper = ({children}) => {
  const [user, setUser] = useState({email: null, username: null, logged: false} as IUser);

  const login = (email: string) => {
    return new Promise<IUser>((resolve, reject) => {

      // @todo send this to api
      if (email.startsWith('test')) {
        const newUser = {email: email, username: email, logged: true};
        setUser(newUser);
        resolve(newUser);
      } else {
        reject('unknown user');
      }
    });
  }

  const logout = () => {
    setUser({email: null, username: null, logged: false});
  }


  return <AuthContext.Provider value={{user, login, logout}}>
    {children}
  </AuthContext.Provider>
}
