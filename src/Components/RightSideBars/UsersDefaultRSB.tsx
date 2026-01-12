import { ReactComponent as ContentDefaultSideBarSVG } from "../../assets/svg/content-default-sidebar.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import React from "react";
interface props {
  onAddUserPress: () => void;
}

const UsersDefaultRSB : React.FC<props> = ({onAddUserPress}) => {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <ContentDefaultSideBarSVG />
      <Typography variant="h6" sx={{ paddingTop: 2 }}>
        Accès multi-utilisateurs
      </Typography>
      <Typography variant="body2" sx={{ paddingTop: 1 }}>
        Ajoutez des utilisateurs pour gérer vos playlists et écrans. Partagez
        les tâches entre les membres de l'équipe. Limitez les permissions des
        utilisateurs selon leurs tâches.
      </Typography>
      <Button
        variant="outlined"
        onClick={onAddUserPress}
        sx={{ mt: 3 }}
        fullWidth
      >
        Ajouter un utilisateur
      </Button>
    </Box>
  );
}

export default UsersDefaultRSB;