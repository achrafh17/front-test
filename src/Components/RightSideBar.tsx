import "../styles/RightSideBar.css";
import Box from "@mui/material/Box";
import React from "react";
import { VariantName, RSBProps } from "../types/rsb.types";

const RightSideBar: React.FC<RSBProps> = ({ name, renderComponent }) => {
  if (name === "NULL") {
    return <></>;
  }
  const component = renderComponent();
  return <Box className="right-sidebar">{component}</Box>;
};

export default RightSideBar;

