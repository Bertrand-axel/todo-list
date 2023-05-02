import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {useAuthData} from "../../auth/AuthWrapper.tsx";


const PrivateRoutes = () => {
  const { user } = useAuthData();

  return user.logged ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
