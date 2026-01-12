import RequireAuth from "./auth/RequireAuth";
import Nav from "./Nav";
import LeftSideBar from "./LeftSideBar";
import { Outlet } from "react-router-dom";
import { RsbContext } from "../hooks/useRSB";
import RightSideBar from "./RightSideBar";
import React, { useState } from "react";
import { RSBProps } from "../types/rsb.types";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import useStore from "../store/store";

export default function AppLayout() {
  const [rsbVariant, setRsbVariant] = useState<RSBProps>({
    name: "NULL",
    renderComponent: () => <></>,
  });

  const { errorMsg, setErrorMsg } = useStore((state) => ({
    errorMsg: state.errorMsg,
    setErrorMsg: state.setErrorMsg,
  }));

  return (
    <RequireAuth>
      <RsbContext.Provider value={{ rsbVariant, setRsbVariant }}>
        <Nav />
        <div className="main">
          <LeftSideBar />
          <Outlet />
          <RightSideBar
            name={rsbVariant.name}
            renderComponent={rsbVariant.renderComponent}
          />
        </div>
        <Snackbar
          open={!!errorMsg}
          autoHideDuration={2000}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          onClose={() => {
            setErrorMsg(null);
          }}
        >
          <Alert
            severity="error"
            sx={{
              maxWidth: 300,
              wordBreak: "break-word",
            }}
            color="error"
            variant="filled"
          >
            {errorMsg}
          </Alert>
        </Snackbar>
      </RsbContext.Provider>
    </RequireAuth>
  );
}
