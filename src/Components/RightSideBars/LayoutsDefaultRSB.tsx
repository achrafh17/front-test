import { ReactComponent as ContentDefaultSideBarSVG } from "../../assets/svg/layout-default-sidebar.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import React from "react"

interface props {
  addLayout: () => void;
}
const LayoutsDefaultRSB : React.FC<props> = ({
  addLayout
}) => {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <ContentDefaultSideBarSVG />
      <Typography  variant="h6" sx={{ paddingTop: 2 }}>
        Configurez les calques d'écran
      </Typography>
      <Typography  variant="body2" sx={{ paddingTop: 1 }}>
        Ici vous pouvez créer et configurer des calques adaptables pour vos
        écrans, ainsi q'ajouter et configurer de differents widgets.
      </Typography>
      <Button
        variant="outlined"
        onClick={addLayout}
        sx={{ mt: 3 }}
        fullWidth
      >
        Ajouter un calque
      </Button>
    </Box>
  );
}

export default LayoutsDefaultRSB;
