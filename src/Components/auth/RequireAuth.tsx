import { Navigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import React from "react"

interface props {
  children?: JSX.Element | JSX.Element[];
}

const RequireAuth: React.FC<props> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.userInfo) {
    //not logged in, navigate to sign in
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
