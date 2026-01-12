import { ReactComponent as DeviceDefaultSideBarSVG } from "../../assets/svg/device-default-sidebar.svg";
import Box from "@mui/material/Box";
import  Typography from "@mui/material/Typography";
import React from "react";


export default function DeviceDefaultRSB() {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <DeviceDefaultSideBarSVG />
      <Typography  variant="h6" sx={{ paddingTop: 2 }}>
        Ajustez vos écrans
      </Typography>
      <Typography  variant="body2" sx={{ paddingTop: 1 }}>
        Ici vous pouvez modifier la luminosité, le volume, le fuseau horaire ou
        même l'orientation des écrans, ainsi que définir l'heure où vos écrans
        passent au mode veille.
      </Typography>
    </Box>
  );
}
