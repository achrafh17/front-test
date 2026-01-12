//@ts-ignore
import { ReactComponent as PlaylistDefaultSideBarSVG } from "../../assets/svg/playlist-default-sidebar.svg";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

import React from "react"

interface props {
  addPlaylist: () => void;
}

const PlaylistDefaultRSB: React.FC<props> = ({addPlaylist})  => {
  return (
    <Box sx={{ textAlign: "center", padding: 4 }}>
      <PlaylistDefaultSideBarSVG />
      <Typography variant="h6" sx={{ paddingTop: 2 }}>
        Créez des playlists
      </Typography>
      <Typography variant="body2" sx={{ paddingTop: 1 }}>
        Ici vous pouvez créer des playlists pour fixer l'ordre de lecture et la
        durée de vie de contenu, ainsi q'ajouter des déclencheurs et des widgets
        à vos playlists.
      </Typography>
      <Button
        variant="outlined"
        onClick={addPlaylist}
        sx={{ mt: 3 }}
        fullWidth
      >
        Ajouter une playlist
      </Button>
    </Box>
  );
}
export default PlaylistDefaultRSB;