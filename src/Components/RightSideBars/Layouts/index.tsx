import Box from "@mui/material/Box";
import React from "react";
import MainPanel from "./MainPanel";
import SidePanel from "./SidePanel";


const LayoutRSB: React.FC<{}> = () => {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        borderLeft: "1px solid #ccc",
      }}
    >
      <SidePanel />
      <MainPanel />
    </Box>
  );
};

export default LayoutRSB;