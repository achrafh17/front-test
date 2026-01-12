import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
// @ts-ignore
import logoBlack from "../assets/images/logoBlack.png";

import { CircularProgress } from "@mui/material";

const ResetPassword: React.FC<{}> = () => {
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<{
    severity: "success" | "error";
    text: string;
  }>({
    severity: "success",
    text: "",
  });
  const [searchParams] = useSearchParams();
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(false)

  console.log(searchParams);
  const navigate = useNavigate();

  React.useEffect(() => {
    let resetCode = searchParams.get("code");
    if (!resetCode) navigate("/devices");
  }, [searchParams, navigate]);

  const onSubmit = async () => {
    let resetCode = searchParams.get("code");
    if (!resetCode) return;

    setIsLoading(true);
    let payload = {
      code: resetCode,
      newPassword: password,
    };

    try {
      let res = await fetch("https://www.powersmartscreen.com/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      let resJson = await res.json();

      if (resJson.success === true) {
        setMsg({
          severity: "success",
          text: "Votre mot de passe a été changé avec succès",
        });
        setIsSubmitDisabled(true);
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } else {
        setMsg({ severity: "error", text: "Une erreur est survenue" });
      }
    } catch (e) {
      setMsg({ severity: "error", text: "Une erreur est survenue." });
    }

    setIsLoading(false);
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

        <Typography>Entrez un nouveau mot de passe</Typography>

        <TextField
          fullWidth
          variant="outlined"
          type="password"
          label="Mot de passe"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          sx={{ mt: 5 }}
        />
        <TextField
          fullWidth
          variant="outlined"
          type="password"
          label="Confirmation du mot de passe"
          value={passwordConfirmation}
          onChange={(e) => {
            setPasswordConfirmation(e.target.value);
          }}
          sx={{ mt: 2 }}
        />

        {password !== passwordConfirmation && (
          <Typography
            sx={{
              textAlign: "center",
              color: "#F00020",
              fontSize: 14,
              fontWeight: "bold",
              mt: 2,
            }}
          >
            Veuillez saisir le même mot de passe pour confirmer
          </Typography>
        )}

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            sx={{ width: 170, mt: 4, mb: 2 }}
            onClick={onSubmit}
            disabled={password !== passwordConfirmation || isSubmitDisabled}
          >
            Envoyer
          </Button>
        )}

        {msg.text !== "" && (
          <Alert sx={{ width: "100%" }} severity={msg.severity}>
            {msg.text}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ResetPassword;
