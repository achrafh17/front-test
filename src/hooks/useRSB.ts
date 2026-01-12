import React, { createContext, useContext } from "react";
import { RSBProps} from "../types/rsb.types";

interface IRSBContext {
  rsbVariant :  RSBProps,
  setRsbVariant: React.Dispatch<React.SetStateAction<RSBProps>> | (() => void)  
}

// handle Right sidebar variant and props
export const RsbContext = createContext<IRSBContext>({
  rsbVariant: {
    name: "NULL",
    renderComponent() {
      return null;
    },
  },
  setRsbVariant: () => {},
});

export default function useRSB() {
  return useContext(RsbContext);
}
