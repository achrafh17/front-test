import React from "react";
import { ICanvasObject } from "../../../../../../types";
import useStore from "../../../../../../store/store";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import { fabric } from "fabric";
import ColorInput from "../../../../../Common/ColorInput";
// @ts-ignore
// import { ReactComponent as AddContentSVG } from "../../../../../../assets/svg/editor-add-content.svg";
// import CloseIcon from "@mui/icons-material/Close";

interface props {
  canvasObject: ICanvasObject;
}

// function that checks if bgColor is valid
const isValidBgColor = (bgColor: string) => {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(bgColor);
};

const onBgColorChange = (
  newBgColor: string,
  cnvsObj: ICanvasObject,
  canvas: fabric.Canvas
) => {
  if (isValidBgColor(newBgColor)) {
    var group = cnvsObj.object as fabric.Group;
    group.getObjects()[0].set({
      fill: newBgColor,
    });
    canvas.renderAll();
    cnvsObj.bgColor = newBgColor;
    return true;
  }
  return false;
};
const onOpacityChange = (
  newOpacity: number,
  cnvsObj: ICanvasObject,
  canvas: fabric.Canvas
) => {
  if (newOpacity >= 0 && newOpacity <= 100) {
    var group = cnvsObj.object as fabric.Group;
    group.getObjects()[0].set({
      opacity: newOpacity / 100,
    });
    canvas.renderAll();
    cnvsObj.opacity = newOpacity;
    return true;
  }
  return false;
};

// const addPictureToLayer = (
//   imageURL: string,
//   canvasObject: ICanvasObject,
//   canvas: fabric.Canvas
// ) => {
//   var group = canvasObject.object as fabric.Group;
//   //check if image exists
//   if(group.getObjects().length > 1){
//     group.remove(group.getObjects()[1]);
//   }
//   fabric.Image.fromURL(`https://www.powersmartscreen.com/storage/${imageURL}`, (img) => {

//     img.scaleToWidth(group.getScaledWidth(), true);
//     img.set({
//       originX: "center",
//       originY: "center",
//       lockScalingX: true,
//       lockScalingY: true,
//     })
    
//     group.add(img);
//     img.set({
//       left: 0,
//       top: 0,
//     });

//     img.setCoords();
//     canvas.renderAll();
//   });
// };

// const removePictureFromLayer = (
//   canvasObject: ICanvasObject,
//   canvas: fabric.Canvas
// ) => {
//   var group = canvasObject.object as fabric.Group;
//   group.remove(group.getObjects()[1]);
//   canvas.renderAll();
// }

const LayerSettings: React.FC<props> = ({ canvasObject }) => {
  const canvas = useStore((state) => state.canvas);
  // const setIsPanelOpen = useStore((state) => state.setIsPanelOpen);
  // const setPanelCallback = useStore((state) => state.setPanelCallback);
  // const updateLayer = useStore((state) => state.updateLayer);

  const [bgColor, setBgColor] = React.useState(canvasObject.bgColor);
  const [opacity, setOpacity] = React.useState(canvasObject.opacity);

  return (
    <>
      <Box sx={{ mb: 3, display: "flex", gap: 1.5 }}>
        <Box sx={{ flex: 2 }}>
          <ColorInput
            label="Couleur de fond"
            value={bgColor ?? "#000000"}
            onValueChange={(newBgColor) => {
              if (canvas) {
                if (onBgColorChange(newBgColor, canvasObject, canvas)) {
                  setBgColor(newBgColor);
                }
              }
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13 }}>&nbsp;</Typography>
          <TextField
            variant="standard"
            sx={{ flex: 1 }}
            value={opacity}
            onChange={(e) => {
              const newOpacity = parseInt(e.target.value);
              if (canvas) {
                if (onOpacityChange(newOpacity, canvasObject, canvas)) {
                  setOpacity(newOpacity);
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "#84898a" }}>
                  O:
                </InputAdornment>
              ),
              inputProps: {
                min: 0,
                max: 1,
                step: 0.01,
              },
            }}
            type="number"
            onWheel={(e) => {
              e.preventDefault();
            }}
          />
        </Box>
      </Box>
      {/* <Box
        sx={{
          mb: 2,
          display: "flex",
          gap: 1,
          height: 40,
          cursor: "pointer",
          alignItems: "center",
        }}
        onClick={() => {
          setIsPanelOpen(true);
          setPanelCallback((imageURL) => {
            if (canvas && imageURL) {
              updateLayer(canvasObject.object, {
                imageURL: imageURL,
              });
              addPictureToLayer(imageURL, canvasObject, canvas);
            }
          });
        }}
      >
        {canvasObject.imageURL ? (
          <div
            style={{
              width: 40,
              height: 40,
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
            }}
          >
            <img
              src={`https://www.powersmartscreen.com/storage/${canvasObject.imageURL}`}
              width="100"
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <AddContentSVG height={40} width={40} />
        )}
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            flex: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "#84898a" }}>
            Contenu
          </Typography>
          <Typography sx={{ fontSize: 16, color: "#3f4242" }}>
            Ajouter Contenu
          </Typography>
        </Box>
        {canvasObject.imageURL && (
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (canvas) {
                removePictureFromLayer(canvasObject, canvas);
              }
              updateLayer(canvasObject.object, {
                imageURL: "",
              });
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </Box>
        )}
      </Box> */}
    </>
  );
};

export default LayerSettings;
