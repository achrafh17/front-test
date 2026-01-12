import Box from "@mui/material/Box";
import React from "react";
import { canvasObjectType } from "../../../types";
import { Tooltip } from "@mui/material";
import {createCanvasObject} from "../../../utils/canvas.utils";
import useStore from "../../../store/store";
import SidePanelIcons from "./SidePanelIcons";


const SidePanelButtons: {
  id: canvasObjectType;
  label: string;
}[] = [
  {
    id: "layer",
    label: "Calque",
  },
  {
    id: "weather",
    label: "Météo",
  },
  {
    id: "clock",
    label: "Horloge",
  },
  {
    id: "playlist",
    label: "Playlist",
  }
];


  

const SidePanel: React.FC<{}> = () => {

  const {frame, canvas, addLayer, setActiveObject} = useStore((state) => ({
    frame: state.frame,
    canvas: state.canvas,
    addLayer: state.addLayer,
    setActiveObject: state.setActiveObject,
  }));


  const addObject = React.useCallback(async (type: canvasObjectType) => {
    if (frame && canvas) {
      // create a rectangle
      var canvasObject = createCanvasObject(
        type,
        frame.aCoords.tl.x,
        frame.aCoords.tl.y,
        frame.width,
        frame.height,
      );

      if(canvasObject){
        addLayer(canvasObject);
        canvas.add(canvasObject.object);
        canvas.setActiveObject(canvasObject.object);
        setActiveObject(canvasObject);
        canvas.renderAll();
      }
    }
  }, [frame, canvas, addLayer, setActiveObject]);

  return (
    <Box
      sx={{
        height: "100%",
        width: 47,
        borderRight: "1px solid #d9dfe0",
        px: 1,
        py: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
      }}
    >
      {SidePanelButtons.map(({ id, label}) => {
        
        return (
          <Tooltip
            title={<p style={{ fontSize: 14, fontWeight: "300" }}>{label}</p>}
            key={id}
            placement="left"
            arrow
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                width: 28,
                height: 28,
              }}
              onClick={() => addObject(id)}
            >
              <SidePanelIcons id={id} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};



export default SidePanel;
