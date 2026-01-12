import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const ScheduleDefaultRSB: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <Typography variant="h6" sx={{ paddingBottom: 2 }}>
        Créez des plannings
      </Typography>
      <Typography variant="body2">
        Ici vous pouvez créer des plannings pour diffuser du contenu sur vos écrans.
        Choisissez une playlist, sélectionnez les écrans et définissez les horaires
        et la durée de diffusion pour chaque contenu.
      </Typography>
    </Box>
  );
};

export default ScheduleDefaultRSB;
