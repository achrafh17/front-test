import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
//@ts-ignore
import { ReactComponent as LandscapeSVG } from "../../../assets/svg/layouts_landscape.svg";
//@ts-ignore
import { ReactComponent as PortraitSVG } from "../../../assets/svg/layouts_portrait.svg";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import React from "react";
import useStore from "../../../store/store";
import { useEditor } from "@layerhub-io/react";
import { ICanvasObject } from "../../../types";
import useAuth from "../../../hooks/useAuth";

const TopBar: React.FC<{}> = () => {
  const editor = useEditor();
  const {userInfo} = useAuth();
  const frameOrientation = useStore((state) => state.frameOrientation);
  const setFrameOrientation = useStore((state) => state.setFrameOrientation);
  const activeObject = useStore((state) => state.activeObject);
  const setActiveObject = useStore((state) => state.setActiveObject);
  const canvas = useStore((state) => state.canvas);
  const frame = useStore((state) => state.frame);
  const setFrameDimensions = useStore((state) => state.setFrameDimensions);
  const layers = useStore((state) => state.layers);
  const layoutName = useStore((state) => state.layoutName);
  
const [isLoading, setIsLoading] = React.useState(false);
const [success, setSuccess] = React.useState<boolean | null>(null);


  const save = async () => {
    if(!frame) return;
    var canvasState = {
      frameWidth: frame.getScaledWidth(),
      frameHeight: frame.getScaledHeight(),
      layers: layers.map(layer => {
        var layerInfo = layer as Partial<ICanvasObject>;
        delete layerInfo.object;
        return layerInfo;
      }),
    };
    var canvasStateString = JSON.stringify(canvasState);

    var [_x, _y, layoutHashId, slideHashId] = window.location.pathname.split("/");

    setIsLoading(true);
    try{
      var res = await fetch("https://www.powersmartscreen.com/save-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sessionId: userInfo?.sessionId,
          name: layoutName,
          state: canvasStateString,
          layoutHashId: layoutHashId,
          slideHashId: slideHashId,
        }),
      })
      var resJson = await res.json();
      if(resJson.success){
        setSuccess(true);
      }else{
        setSuccess(false);
      }
      setTimeout(()=>{
        setSuccess(null);
      }, 1000);
    }catch(e){
      console.log(e)
    }
    setIsLoading(false);
  }

  return (
    <div
      style={{
        width: "100%",
        height: 70,
        backgroundColor: "#FFF",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 2,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 20,
        padding: 18,
      }}
    >
      <Box
        sx={{
          minWidth: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {success === true ? (
          <CheckCircleOutlinedIcon sx={{color:"#05cd7d"}}/>
        ) : success === false ? (
          <CancelOutlinedIcon sx={{color:"#f00020"}}/>
        ) : isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Button variant="outlined" onClick={save}>
            Sauvegarder
          </Button>
        )}
      </Box>
      <Tooltip title="Orientation Horizontale" arrow placement="bottom">
        <div
          style={{ height: 20, width: 26, cursor: "pointer" }}
          onClick={() => {
            if (frame && editor) {
              if (frame.width < frame.height) {
                // it's portrait
                setFrameDimensions({
                  width: frame.height,
                  height: frame.width,
                });
              }
            }
            setFrameOrientation("horizontal");
          }}
        >
          <LandscapeSVG
            fill={frameOrientation === "horizontal" ? "#84898a" : "#bec4c4"}
          />
        </div>
      </Tooltip>
      <Tooltip title="Horientation Verticale" arrow placement="bottom">
        <div
          style={{ height: 26, width: 20, cursor: "pointer" }}
          onClick={() => {
            if (frame && editor) {
              if (frame.width > frame.height) {
                // it's landscape
                setFrameDimensions({
                  width: frame.height,
                  height: frame.width,
                });
              }
            }
            setFrameOrientation("vertical");
          }}
        >
          <PortraitSVG
            fill={frameOrientation === "vertical" ? "#84898a" : "#bec4c4"}
          />
        </div>
      </Tooltip>
      <Tooltip title="Paramètres de Calque" arrow placement="bottom">
        <SettingsIcon
          sx={{
            color: activeObject === null ? "#84898a" : "#bec4c4",
            cursor: "pointer",
          }}
          onClick={() => {
            setActiveObject(null);

            // unset canvas active object
            canvas && canvas.discardActiveObject();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default TopBar;
