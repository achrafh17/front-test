import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { TextField, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import {IUserSingle, userPrivilegesStripped, IaddUserResponseResult}from "../../types/api.types"
import IOSSwitch from "../Common/IOSSwitch"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface props {
  open: boolean;
  onClose: () => void;
  onSave: (newUser: IUserSingle) => void;
}

const translations = {
    devices: "Écrans",
    contents: "Contenu",
    playlists: "Playlists",
    stats: "Statistiques",
    layers: "Calques"
}

 const AddUserDialog: React.FC<props> = ({ open, onClose, onSave }) => {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true)
  const [isUserAdded, setIsUserAdded] = useState(false);
  const [privileges, setPrivileges] = useState<userPrivilegesStripped>({
    devices: false,
    contents: false,
    playlists: false,
    layers: false,
    stats: false,
  })

  const handleSubmit = async () => {
    setIsLoading(true);
    var payload = {
      sessionId: userInfo?.sessionId,
      email: email,
      ...privileges
    };
    try {
      var res = await fetch("https://www.powersmartscreen.com/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      setIsLoading(false);
      if (resJson.success) {
        var result = resJson.result as IaddUserResponseResult;
        var newUser = {
          email: result.email,
          userId: result.userId,
          userName: result.userName, 
          privileges: result.privileges,
        } as IUserSingle;
        setPassword(result.password)
        setIsUserAdded(true);
        onSave(newUser)
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      id="add-user-dialog"
      maxWidth="md"
    >
      <div className="add-dialog-top">
        <DialogTitle>Ajouter un utilisateur</DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent
        sx={{
          padding: 4,
          maxHeight: 600,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isUserAdded ? (
          <Box>
            <Box
              sx={{
                backgroundColor: "#05cd7d5c",
                borderRadius: 1.2,
                width: "fit-content",
                px: 1,
                py: 0.5,
              }}
            >
              <Typography sx={{ color: "#088553", fontWeight: "500" }}>
                Utilisateur ajouté avec succès
              </Typography>
            </Box>
            <table style={{ marginTop: 20 }}>
              <tr>
                <td>email :</td>
                <td style={{ fontWeight: "600", paddingLeft: 12 }}>{email}</td>
              </tr>
              <tr>
                <td>password :</td>
                <td style={{ fontWeight: "600", paddingLeft: 12 }}>
                  {isPasswordHidden ? password.replace(/./g, "*") : password}
                </td>
                <td>
                  {isPasswordHidden ? (
                    <VisibilityIcon
                    sx={{cursor:"pointer", color:"#666"}}
                      onClick={() => {
                        setIsPasswordHidden((old) => !old);
                      }}
                    />
                  ) : (
                    <VisibilityOffIcon
                    sx={{cursor:"pointer", color:"#666"}}
                      onClick={() => {
                        setIsPasswordHidden((old) => !old);
                      }}
                    />
                  )}
                </td>
              </tr>
            </table>
          </Box>
        ) : (
          <>
            <Typography
              variant="subtitle1"
              sx={{ fontSize: 12, color: "#84898a" }}
            >
              Inviter par adresse email
            </Typography>
            <TextField
              variant="standard"
              //   label="Inviter par adresse email"
              placeholder="Email"
              autoComplete="off"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              fullWidth
              sx={{
                mb: 2,
              }}
            />
            <Typography
              variant="button"
              sx={{ fontSize: 14, color: "#84898a", fontWeight: "400", mb: 2 }}
            >
              paramètres d'accès
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {Object.keys(privileges).map((key, idx) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      width: "45%",
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      mr: 1,
                    }}
                  >
                    <IOSSwitch
                      sx={{ mr: 1 }}
                      //@ts-ignore
                      checked={privileges[key]}
                      onChange={(e) => {
                        setPrivileges((old) => ({
                          ...old,
                          [key]: !old[key],
                        }));
                      }}
                    />
                    <Typography
                      sx={{ color: privileges[key] ? "black" : "#84898a" }}
                    >
                      {translations[key]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isUserAdded ? (
          <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
            Terminer
          </Button>
        ) : (
          <>
            <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              sx={{ paddingX: 5 }}
            >
              Ajouter
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddUserDialog;