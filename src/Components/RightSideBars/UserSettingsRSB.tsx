import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IUserSingle, userPrivilegesStripped } from "../../types/api.types";
import IOSSwitch from "../Common/IOSSwitch";
import { Button, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useAuth from "../../hooks/useAuth";

const translations = {
  devices: "Écrans",
  contents: "Contenu",
  playlists: "Playlists",
  stats: "Statistiques",
  layers: "Calques",
};

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

interface props {
  user: IUserSingle;
  onDeleteUserPress: () => void;
  updatePrivileges: (newPrivileges: userPrivilegesStripped) => void;
}

const UserSettingsRSB: React.FC<props> = ({
  user,
  onDeleteUserPress,
  updatePrivileges,
}) => {
  const { userInfo } = useAuth();
  const [privileges, setPrivileges] = useState<userPrivilegesStripped>(
    user.privileges
  );
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const submit = async () => {
    try {
      setIsLoading(true);
      var payload = {
        sessionId: userInfo?.sessionId,
        userIdToModify: user.userId,
        devices: privileges.devices,
        contents: privileges.contents,
        playlists: privileges.playlists,
        layers: privileges.layers,
        stats: privileges.stats,
      };

      var res = await fetch("https://www.powersmartscreen.com/update-user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      setIsLoading(false);
      if (resJson.success) {
        updatePrivileges(privileges)
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
        }, 1000);
      } else {
        setSuccess(false);
        setTimeout(() => {
          setSuccess(null);
        }, 1000);
      }
    } catch (e) {
      setSuccess(false);
      setTimeout(() => {
        setSuccess(null);
      }, 1000);
    }
  };

  useEffect(() => {
    setPrivileges(user.privileges);
  }, [user]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: 18 }}>
          {user.userName ?? user.email}
        </Typography>
        <Typography sx={{ fontWeight: 400, fontSize: 14, color: "#84898a" }}>
          {getUserTitle(user)}
        </Typography>
      </Box>
      <Box
        sx={{
          p: 3,
          height: "calc(100vh - 80px - 60px - 76px)",
          maxHeight: "calc(100vh - 80px - 60px - 76px)",
          overflowY: "scroll",
        }}
        className="hide-scrollbar"
      >
        {Object.keys(privileges).map((key, idx) => {
          return (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
            >
              <IOSSwitch
                //@ts-ignore
                checked={privileges[key] === true}
                onChange={() => {
                  setPrivileges((old) => ({ ...old, [key]: !old[key] }));
                }}
              />
              <Typography sx={{ fontSize: 16 }}>{translations[key]}</Typography>
            </Box>
          );
        })}
        <Button
          variant="outlined"
          fullWidth
          sx={{ mt: 2 }}
          onClick={onDeleteUserPress}
        >
          Supprimer l'utilisateur
        </Button>
      </Box>
      <Box
        sx={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
          background: "#f3f5f5",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : success !== null ? (
          <Box
            sx={{
              width: "100%",
              borderRadius: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
              backgroundColor: "#F00020",
            }}
          >
            {success ? (
              <CheckCircleIcon sx={{ color: "white" }} />
            ) : (
              <CancelIcon sx={{ color: "white" }} />
            )}
          </Box>
        ) : (
          <Button variant="contained" onClick={submit} fullWidth>
            Enregistrer
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default UserSettingsRSB;
