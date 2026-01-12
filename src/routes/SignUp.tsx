import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {Link} from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
//@ts-ignore
import logoBlack from "../assets/images/logoBlack.png";
import { Typography } from "@mui/material";
import PhoneInput from "../Components/Common/phone-input"


const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export default function SignUp() {

  const [isLoading, setIsLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    phone: "",
    fName: "",
    lName:"",
  });

  const [error, setError] = useState<{
    severity: "error" | "warning" | "info";
    message: string;
  } | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if (!formFields.email || !formFields.password || !formFields.phone) {
        setError({
          severity: "error",
          message: "Entrez toutes les données requises",
        });
      } else if (!isValidEmail(formFields.email)) {
        setError({
          severity: "error",
          message: "Vous devez entrer une adresse email valide",
        });
      } else {
        setError(null);
        setIsLoading(true);
        var payload = {
          email: formFields.email,
          password: formFields.password,
          phone: formFields.phone,
          lName: formFields.lName,
          fName: formFields.fName,
        };
        console.log(payload)
        var res = await fetch("https://www.powersmartscreen.com/sign-up", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        var resJson = await res.json();
        setIsLoading(false);
        if (resJson?.success) {
          // var result = resJson.result as IUserInfo;
          // localStorage.setItem("sessionId", result.sessionId);
          // auth.setUserInfo(result);
          setError({
            severity:"info",
            message:"Votre compte a été créé avec succès.\nUn email de confirmation a été envoyé à " + payload.email
          })
          // navigate("/devices");
        } else {
          if (resJson?.reason === "user_exists") {
            setError({ severity: "error", message: "Cet email existe déjà." });
          } else if (resJson?.reason === "no_data") {
            setError({
              severity: "error",
              message: "Vérifiez les données entrées",
            });
          } else {
            // all other errors
            setError({
              severity: "error",
              message: "Une erreur est survenue. Veuillez réessayer",
            });
          }
        }
      }
    } catch (e) {
      setIsLoading(false);
      setError({severity: "error", message:"Une erreur est survenue. Veuillez réessayer"});
    }
  };

  return (
    <>
      <Grid
        container
        component="main"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
      >
        <Box
          sx={{
            my: 4,
            mx: 11,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 500,
          }}
        >
          <img
            style={{ width: "80px", height: "80px" }}
            src={logoBlack}
            alt=""
          ></img>
          <Box
            component="form"
            noValidate
            sx={{ mt: 2 }}
            onSubmit={handleSubmit}
          >
            <Box sx={{ display: "flex", gap: 1, mb:1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="fName"
                label="Prénom"
                name="fName"
                value={formFields.fName}
                onChange={(e) => {
                  setFormFields((oldFormData) => {
                    return { ...oldFormData, fName: e.target.value };
                  });
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="lName"
                label="Nom"
                name="lName"
                value={formFields.lName}
                onChange={(e) => {
                  setFormFields((oldFormData) => {
                    return { ...oldFormData, lName: e.target.value };
                  });
                }}
              />
            </Box>

            <PhoneInput
              value={formFields.phone}
              onChange={(newVal) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, phone: newVal };
                });
              }}
            />

            <TextField
              sx={{ mt: 2}}
              fullWidth
              id="email"
              label="Email*"
              name="email"
              value={formFields.email}
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, email: e.target.value };
                });
              }}
            />

            <TextField
              sx={{ mt: 2}}
              fullWidth
              name="password"
              label="Password*"
              type="password"
              id="password"
              value={formFields.password}
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, password: e.target.value };
                });
              }}
            />
            <Typography sx={{ fontSize: 12, mt: 2, color: "#888" }}>
              Les champs avec <span style={{ fontWeight: "bold" }}>*</span> sont
              requis.
            </Typography>
            {isLoading ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 2,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 3, height: "40px" }}
              >
                S'enregistrer
              </Button>
            )}

            <Grid container>
              <Grid item xs>
                Vous avez déjà enregistré un compte?{" "}
                <Link to="/signin">
                  <Typography
                    sx={{
                      color: "#F00020",
                      display: "inline",
                      fontSize: 14,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    S'identifier
                  </Typography>
                </Link>
              </Grid>
            </Grid>

            {!!error && (
              <Alert
                variant="outlined"
                severity={error.severity}
                sx={{ textAlign: "center", mt: 2 }}
              >
                {error.message.split("\n").map((p, i) => (
                  <Typography key={i}>{p}</Typography>
                ))}
              </Alert>
            )}
          </Box>
        </Box>
      </Grid>
    </>
  );
}
