import React from "react"
import useStore  from "../../../../../store/store"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { ICanvasObject } from "../../../../../types"
import SidePanelIcons from "../../SidePanelIcons"

interface props {
    canvasObject: ICanvasObject
}

const Layer: React.FC<props> = ({canvasObject}) => {
    const activeObject = useStore((state) => state.activeObject)
    const setActiveObject = useStore((state) => state.setActiveObject)
    const canvas = useStore((state) => state.canvas)

    return (
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #ccc",
          px: 2,
          py: 1,
          cursor: "pointer",
          backgroundColor:
            activeObject?.object === canvasObject.object
              ? "#e9eef5"
              : "transparent",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
        onClick={() => {
          setActiveObject(canvasObject);
          if (canvas) {
            canvas.setActiveObject(canvasObject.object);
            canvas.requestRenderAll();
          }
        }}
      >
        <Box
          sx={{
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SidePanelIcons id={canvasObject.id} />
        </Box>
        <Typography sx={{ fontSize: 14, color: "#595d5e" }}>{canvasObject.label}</Typography>
      </Box>
    );
}

export default Layer;