import { useContext } from "react";
import  AuthContext from "../Components/auth/AuthContext";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
