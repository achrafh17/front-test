import React from "react";
import { ICanvasObject } from "../../../../../types/index";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStore from "../../../../../store/store";
import CanvasObjectDimensionsInput from "./CanvasObjectDimensionsInput";
import {resizeCanvasObject} from "../../../../../utils/canvas.utils";
import LayerSettings from "./CustomSettings/LayerSettings";
interface props {
  canvasObject: ICanvasObject;
}

const CanvasObjectSettings: React.FC<props> = (props) => {
  const layers = useStore((state) => state.layers);
  const setActiveObject = useStore((state) => state.setActiveObject);
  const updateLayer = useStore((state) => state.updateLayer);
  const frameDimensions = useStore((state) => state.frameDimensions);
  const frameACoords = useStore((state) => state.frameACoords);
  const canvas = useStore((state) => state.canvas);

  const [canvasObject, setCanvasObject] = React.useState(props.canvasObject);
  

  React.useEffect(() => {
    var layer = layers.find((layer) => layer.object === props.canvasObject.object);
    if (layer) {
      setCanvasObject(layer);
    } else {
      setActiveObject(null);
    }
  }, [layers, props.canvasObject, setActiveObject]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 60px - 50px)",
        maxHeight: "calc(100vh - 60px - 50px)",
        overflowY: "scroll",
        p: 2,
      }}
      className="hide-scrollbar"
    >
      <Typography sx={{ mb: 2 }}>{canvasObject.id}</Typography>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: "#84898a" }}>
          Taille (%)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <CanvasObjectDimensionsInput
            value={canvasObject.width}
            onValueChange={(value) => {
              updateLayer(canvasObject.object, { width: value });
              if (frameDimensions && frameACoords && canvas) {
                resizeCanvasObject(
                  canvasObject,
                  {
                    width: value,
                  },
                  canvas, 
                  frameDimensions.width,
                  frameDimensions.height,
                  frameACoords.tl.x,
                  frameACoords.tl.y,
                );
              }
            }}
            adornmentText="W:"
          />
          <CanvasObjectDimensionsInput
            value={canvasObject.height}
            onValueChange={(value) => {
              updateLayer(canvasObject.object, { height: value });
              if (frameDimensions && frameACoords && canvas) {
                resizeCanvasObject(
                  canvasObject,
                  {
                    height: value,
                  },
                  canvas, 
                  frameDimensions.width,
                  frameDimensions.height,
                  frameACoords.tl.x,
                  frameACoords.tl.y,
                );
              }
            }}
            adornmentText="H:"
          />
        </Box>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: "#84898a" }}>
          Position (%)
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <CanvasObjectDimensionsInput
            value={canvasObject.x}
            onValueChange={(value) => {
              updateLayer(canvasObject.object, { x: value });
              if (frameACoords && frameDimensions && canvas) {
                canvasObject.object.set({
                  left: frameACoords.tl.x + (value / 100) * frameDimensions.width,
                });
                canvasObject.object.setCoords();
                canvas.requestRenderAll();
              }
            }}
            adornmentText="X:"
          />
          <CanvasObjectDimensionsInput
            value={canvasObject.y}
            onValueChange={(value) => {
              updateLayer(canvasObject.object, { y: value });
              if (frameACoords && frameDimensions && canvas) {
                canvasObject.object.set({
                  top: frameACoords.tl.y + (value / 100) * frameDimensions.height,
                });
                canvasObject.object.setCoords();
                canvas.requestRenderAll();
              }
            }}
            adornmentText="Y:"
          />
        </Box>
      </Box>

      {canvasObject.id === "layer" ? <LayerSettings canvasObject={canvasObject} /> : null}
    </Box>
  );
};

export default CanvasObjectSettings;
