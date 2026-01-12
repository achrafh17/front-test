import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useAuth from "../../hooks/useAuth";
import  Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface props {
  onBack: () => void;
}

const ChangePasswordView: React.FC<props> = ({ onBack }) => {
  const [passwords, setPasswords] = React.useState({
    old: "",
    new: "",
    confirmation: "",
  });

  var arePasswordsTheSame = passwords.new === passwords.confirmation

  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<{
    severity: "success" | "error";
    text: string;
  }>({ severity: "success", text: "" });

  const onSave = async () => {
    setIsLoading(true);
    let oldPassword = passwords.old;
    let newPassword = passwords.new;
    try {
      let res = await fetch("https://www.powersmartscreen.com/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sessionId: userInfo?.sessionId,
          oldPassword,
          newPassword,
        }),
      });

      let resJson = await res.json();

      if (resJson.success === true) {
        setMsg({
            severity:"success",
            text:"Votre mot de passe a été changé avec succès"
        })
        setTimeout(()=>{
            onBack();
        }, 1500)
      }else{
        if(resJson?.reason === "invalid_credentials"){
            setMsg({severity:"error", text: "L'ancien mot de passe que vous avez fourni est incorrect"})
        }else{
            setMsg({severity:"error", text: "une erreur est survenue"})

        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: "500",
          color: "#3f4242",
          mb: 4,
        }}
      >
        Changement de mot de passe
      </Typography>

      <TextField
        fullWidth
        autoComplete="off"
        type="password"
        sx={{ mb: 2 }}
        variant="outlined"
        label="Ancien mot de passe"
        value={passwords.old}
        onChange={(e) => {
          setPasswords((obj) => ({
            ...obj,
            old: e.target.value,
          }));
        }}
      />
      <TextField
        fullWidth
        autoComplete="off"
        type="password"
        sx={{ mb: 2 }}
        variant="outlined"
        label="Nouveau mot de passe"
        value={passwords.new}
        onChange={(e) => {
          setPasswords((obj) => ({
            ...obj,
            new: e.target.value,
          }));
        }}
      />
      <TextField
        fullWidth
        autoComplete="off"
        type="password"
        sx={{ mb: 2 }}
        variant="outlined"
        label="Confirmation du nouveau mot de passe"
        value={passwords.confirmation}
        onChange={(e) => {
          setPasswords((obj) => ({
            ...obj,
            confirmation: e.target.value,
          }));
        }}
      />

      {arePasswordsTheSame === false && (
        <Typography
          sx={{ textAlign: "center", color: "#F00020", fontSize: 14, fontWeight:"bold" }}
        >
          Veuillez saisir le même mot de passe pour confirmer
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          my: 2,
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Button
              sx={{ py: 1, width: 170 }}
              color="success"
              variant="contained"
              onClick={onSave}
              disabled={passwords.old === "" || passwords.new === "" || !arePasswordsTheSame}
            >
              Enregistrer
            </Button>
            <Button
              sx={{ py: 1, width: 170 }}
              color="secondary"
              variant="outlined"
              onClick={onBack}
            >
              Annuler
            </Button>
          </>
        )}
      </Box>
      {msg.text !== "" && <Alert severity={msg.severity}>{msg.text}</Alert>}
    </Box>
  );
};

export default ChangePasswordView;
