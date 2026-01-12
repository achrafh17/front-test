import React, { useState } from "react";
import AuthContext from "./AuthContext";
import { IUserInfo } from "../../types/api.types";

interface props {
  children?: JSX.Element | JSX.Element[];
}

const AuthProvider: React.FC<props> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;