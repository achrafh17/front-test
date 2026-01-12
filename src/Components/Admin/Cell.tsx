import React, { ReactNode } from "react";
import Box from "@mui/material/Box";

const Cell: React.FC<{
  children?: ReactNode;
  first?: boolean;
}> = ({ children , first}) => {
  return (
    <Box
      sx={{
        overflow: "hidden",
        px: 2,
        py: 1,
        minWidth: first ? 80 : 250,
        flex: first ? undefined : 1,
        width: first ? 80 : undefined,
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      {!!children && children}
    </Box>
  );
};

export default Cell;
