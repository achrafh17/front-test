import { createContext } from "react";
import {IUserInfo} from "../../types/api.types"

interface IAuthContext {
  userInfo: IUserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo | null>>;
}

const AuthContext = createContext<IAuthContext>({
  userInfo: null,
  setUserInfo: (userInfo) => {},
});

export default AuthContext;
