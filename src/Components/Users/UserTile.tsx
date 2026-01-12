import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { IUserSingle } from "../../types/api.types";
//@ts-ignore
import userProfileSVG from "../../assets/svg/no_avatar_tile.svg";

interface props {
  user: IUserSingle;
  highlighted: boolean;
  onTileClick: () => void;
}

const getUserTitle = (userInfo: IUserSingle) => {
  if (userInfo.privileges === null) {
    return "Administrateur";
  }
  var { devices, contents, layers, playlists, stats } = userInfo.privileges;

  if (devices && contents && layers && playlists && stats) {
    return "Administrateur";
  } else {
    if (devices || contents || layers || playlists || stats) {
      return "Modérateur";
    } else {
      return "Invité";
    }
  }
};


const UserTile: React.FC<props> = ({ user, highlighted, onTileClick}) => {

  return (
    <Grid item sm={4} lg={3} xl={2}>
      <Box
        sx={{
          height: 230,
          border: "2px solid #e3e3e3",
          borderRadius: "6px",
          px: 2,
          py: 4,
          // mr: 1,
          // mb: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          transition: ".3s all ease",
          boxShadow: highlighted
            ? "0 9px 18px rgb(132 137 138 / 30%)"
            : undefined,
          "&:hover": {
            boxShadow: "0 9px 18px rgb(132 137 138 / 30%)",
          },
        }}
        onClick={onTileClick}
      >
        <img
          src={userProfileSVG}
          alt="user"
          style={{
            maxWidth: 100,
            marginBottom: 20,
          }}
        />
        <Typography
          sx={{ color: "#3f4242", fontSize: 16, mb: 0.6, maxWidth: "90%" }}
          noWrap
        >
          {user.userName ?? user.email}
        </Typography>
        <Typography sx={{ fontSize: 12, color: "#84898a" }}>
          {getUserTitle(user)}
        </Typography>
      </Box>
    </Grid>
  );
};

export default UserTile;
