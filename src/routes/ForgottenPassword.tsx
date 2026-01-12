import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router";
// @ts-ignore
import logoBlack from "../assets/images/logoBlack.png";

import useAuth from "../hooks/useAuth";

const ForgottenPassword: React.FC<{}> = () => {
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState<{
    severity: "success" | "error";
    text: string;
  }>({
    severity: "success",
    text: "",
  });
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (userInfo !== null) {
      navigate("/devices");
    }
  }, [userInfo, navigate]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const onSubmit = async () => {
    setMsg({ severity: "success", text: "" });
    let localEmail = email;
    if (!isValidEmail(localEmail)) {
      setMsg({
        severity: "error",
        text: "Veuillez saisir une adresse email valide",
      });
    } else {
      try {
        let res = await fetch(
          `https://www.powersmartscreen.com/send-reset-email?email=${localEmail}`
        );
        let resJson = await res.json();

        if (resJson.success === true) {
          setMsg({
            severity: "success",
            text: "Un email de réinitialisation vous a été envoyé",
          });
        } else {
          setMsg({
            severity: "error",
            text: "L'adresse mail que vous avez saisi ne correspond à aucun compte.",
          });
        }
      } catch (e) {
        setMsg({ severity: "error", text: "Une erreur est survenue" });
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "30%",
          height: "50%",
          minWidth: 500,
          maxWidth: 600,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <img
          style={{ width: "80px", height: "80px", marginBottom: 2 * 8 }}
          src={logoBlack}
          alt=""
        ></img>
        <Typography
          sx={{ textAlign: "center", fontSize: 24, fontWeight: "500", mb: 2 }}
        >
          Récupération de votre compte
        </Typography>

        <Typography>
          Entrez votre adresse mail. Un email de récupération vous sera envoyé
          pour réinitialiser votre mot de passe
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          sx={{ mt: 5 }}
        />

        <Button
          variant="contained"
          sx={{ width: 170, mt: 4, mb: 2 }}
          onClick={onSubmit}
        >
          Envoyer
        </Button>

        {msg.text !== "" && (
          <Alert sx={{ width: "100%" }} severity={msg.severity}>
            {msg.text}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ForgottenPassword;
