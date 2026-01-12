import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { Provider} from "@layerhub-io/react"
import Canvas from "./Canvas";
import useRSB from "../../../hooks/useRSB";
import EditorRSB from "../../RightSideBars/Layouts";
import PickContentPanel from "../../RightSideBars/Layouts/PickContentPanel";
import useStore from "../../../store/store";
import TopBar from "./TopBar";
import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";

const  LayoutEditor : React.FC = () => {

  const location = useLocation()

  const {userInfo} = useAuth();
  const setLayoutName = useStore((state) => state.setLayoutName);
  const initialState = useStore((state) => state.initialState);
  const setInitialState = useStore((state) => state.setInitialState);

  const { setRsbVariant } = useRSB();
  useEffect(() => {
    setRsbVariant({
      name: "NULL",
      renderComponent: () => <></>,
    });
  }, [setRsbVariant]);

  const isPanelOpen = useStore((state) => state.isPanelOpen);
  const setIsPanelOpen = useStore((state) => state.setIsPanelOpen);

  useEffect(() => {
    setIsPanelOpen(false);
  }, [setIsPanelOpen]);

useEffect(()=>{
  console.log("initialstate", initialState);
}, [
  initialState
])

  useEffect(() => {
    var pathname = location.pathname;
    if (pathname.includes("/layouts")) {
      var [_x, _y, layoutId, slideId] = pathname.split("/");

      if (layoutId && slideId) {
        fetch(
          `https://www.powersmartscreen.com/get-layout-info?sessionId=${userInfo?.sessionId}&layoutHashId=${layoutId}&slideHashId=${slideId}`
        )
          .then((res) => res.json())
          .then((resJson) => {
            if (resJson?.success) {
              var result = resJson.result;
              setLayoutName(result.name);
              setInitialState(JSON.parse(result.slides[0].state));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

  }, [userInfo?.sessionId, location, setInitialState, setLayoutName]);

  return (
    <Provider>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          position: "relative",
        }}
      >
        <Box className="main-screen" style={{ flex: 1 }}>
          <TopBar />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
              flexDirection: "column",
              backgroundColor: "#f1f2f6",
              height: "calc(100vh - 60px - 70px)",
              maxHeight: "calc(100vh - 60px - 70px)",
            }}
          >
            {initialState !== null && <Canvas />}
          </Box>
        </Box>
        {isPanelOpen && <PickContentPanel />}
        <Box className="right-sidebar">
          <EditorRSB />
        </Box>
      </Box>
    </Provider>
  );
}

export default LayoutEditor;
