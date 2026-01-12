import { ReactComponent as ContentDefaultSideBarSVG } from "../../assets/svg/content-default-sidebar.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import React from "react";
interface props {
  addContent: () => void;
}

const ContentDefaultRSB : React.FC<props> = ({addContent}) => {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <ContentDefaultSideBarSVG />
      <Typography variant="h6" sx={{ paddingTop: 2 }}>
        Téléchargez des contenus
      </Typography>
      <Typography variant="body2" sx={{ paddingTop: 1 }}>
        Ajoutez des images, des fichiers vidéo et audio, des sites web ou des
        archives zip HTML, des vidéos en continu en format HLS et audios en
        continu en format MP3
      </Typography>
      <Button variant="outlined" onClick={addContent} sx={{ mt: 3 }} fullWidth>
        Ajouter Contenu
      </Button>
    </Box>
  );
}

export default ContentDefaultRSB;