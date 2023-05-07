import {Navigate, Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import {useContainer} from "../../contexts/containerWrapper.tsx";
import AuthService from "../../services/auth.ts";


const PrivateRoutes = () => {
  const authService: AuthService = useContainer().get('AuthService');
  const [loggedIn, setLoggedIn] = useState(authService.loggedIn);

  useEffect(() => {
    const subscription = authService.token$.subscribe((token) => setLoggedIn(token !== null))
    return () => subscription.unsubscribe();
  }, [])

  return loggedIn ? <Outlet/> : <Navigate to="/login"/>;
}

export default PrivateRoutes;
