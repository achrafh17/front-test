import React from "react";
import { IDeviceSingle } from "../../types/api.types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface props {
  deviceInfo: IDeviceSingle;
}

const TitleBarName: React.FC<props> = ({ deviceInfo }) => {
  const navigate = useNavigate();

  if (deviceInfo.parent !== null) {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              lineHeight: 1.25,
              color: "#3f4242",
              cursor: "pointer",
              "&:hover": {
                color: "#eb576b",
              },
            }}
            onClick={() => {
              navigate("/device/" + deviceInfo.parent?.hashId);
            }}
          >
            {deviceInfo.parent.name}
          </Typography>
          <ChevronRightIcon sx={{ height: 24, width: 24, color: "#3f4242" }} />
          <Typography variant="h6" sx={{ lineHeight: 1.25, color: "#65696a" }}>
            {deviceInfo.name}
          </Typography>
        </Box>
        <Typography variant="body2" color="#b2b7b8">
          Écran
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography variant="h6" sx={{ lineHeight: 1.25 }}>
        {deviceInfo.name}
      </Typography>
      <Typography variant="body2" color="#b2b7b8">
        {deviceInfo.isGroup ? "Groupe d'écrans" : "Écran"}
      </Typography>
    </>
  );
};

export default TitleBarName;
