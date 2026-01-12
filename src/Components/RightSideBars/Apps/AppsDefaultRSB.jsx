import { ReactComponent as AppsDefaultSidebarSVG } from "../../../assets/svg/apps-default-sidebar.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AppsDefaultRSB() {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <AppsDefaultSidebarSVG />
      <Typography as="h4" variant="h6" sx={{ paddingTop: 2 }}>
        Ajoutez des applis
      </Typography>
      <Typography as="p" variant="body2" sx={{ paddingTop: 1 }}>
        Sélectionnez une des options proposées.
        <br />
        Éditez ses paramètres et l'ajoutez comme un contenu.
        <br />
        Vous pourrez ensuite l'ajouter à des playlists.
      </Typography>
    </Box>
  );
}
