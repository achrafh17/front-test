import React from "react";
import Box from "@mui/material/Box";
import useStore from "../../../../../store/store";
import Layer from "./Layer"

const LayersTab: React.FC<{}> = () => {

  const layers = useStore((state) => (state.layers));

  return (
    <Box
      sx={{
        width: "100%",
        height: "calc(100vh - 60px - 50px)",
        maxHeight: "calc(100vh - 60px - 50px)",
        overflowY: "scroll",
      }}
      className="hide-scrollbar"
    >
      {layers.map((layer, idx) => {
        return <Layer key={idx} canvasObject={layer} />;
      })}
    </Box>
  );
};

export default LayersTab;
