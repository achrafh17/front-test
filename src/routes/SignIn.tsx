import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
//@ts-ignore
import logoBlack from "../assets/images/logoBlack.png";
import { useNavigate, useLocation,} from "react-router";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Alert, CircularProgress } from "@mui/material";
import { IUserInfo } from "../types/api.types";



export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState<{
    severity: "error" | "warning";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getUserInfoFromSession = async (
    sessionId: string
  ): Promise<{ userInfo: IUserInfo | null; error: any }> => {
    try {
      var res = await fetch(
        "https://www.powersmartscreen.com/get-user-info?sessionId=" + sessionId
      );
      var resJson = await res.json();
      if (resJson.success) {
        return {
          userInfo: resJson.result as IUserInfo,
          error: null,
        };
      } else {
        return {
          userInfo: null,
          error: resJson.reason,
        };
      }
    } catch (e) {
      return {
        userInfo: null,
        error: e,
      };
    }
  };

  useEffect(() => {
    (async () => {
      var sessionId = localStorage.getItem("sessionId");
      if (sessionId) {
        //check if valid
        var { userInfo, error } = await getUserInfoFromSession(sessionId);
        if (error || userInfo === null) {
          if (error === "invalid_session" || error === "session_expired") {
            setError({
              severity: "warning",
              message: "Votre session est expirée",
            });
          } else {
            console.log(error);
            setError({ severity: "error", message: "Une erreur est survenue" });
          }
          return;
        } else {
          console.log(userInfo);
          auth.setUserInfo(userInfo);
        }
        //@ts-ignore
        var to = location?.state?.from?.pathname || "/devices";
        navigate(to, {
          replace: true,
        });
      }
    })();
  }, [auth, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formFields.email || !formFields.password) {
        setError({
          severity: "error",
          message: "Vérifiez les données entrées",
        });
      } else {
        setError(null);
        setIsLoading(true);
        var payload = {
          email: formFields.email,
          password: formFields.password,
        };
        var res = await fetch("https://www.powersmartscreen.com/sign-in", {
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
          var result = resJson.result as IUserInfo;
          localStorage.setItem("sessionId", result.sessionId);
          auth.setUserInfo(result);
          navigate("/devices");
        } else {
          if (resJson?.reason === "invalid_credentials") {
            setError({
              severity: "error",
              message: "Votre email et/ou mot de passe sont erronés",
            });
          } else if (resJson?.reason === "inactive_account") {
            setError({
              severity: "warning",
              message:
                "Votre compte n'est pas encore activé.\nContactez Power Society pour plus de détails.",
            });
          } else if (resJson?.reason === "unconfirmed_email") {
            setError({
              severity: "warning",
              message:
                "Votre adresse mail n'est pas confirmée.\nUn email de confirmation vous a été envoyé.",
            });
          } else {
            setError({
              severity: "error",
              message: "Une erreur est survenue. Veuillez réessayer",
            });
          }
        }
      }
    } catch (e) {
      setIsLoading(false);
      setError({
        severity: "error",
        message: "Une erreur est survenue. Veuillez réessayer",
      });
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
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, email: e.target.value };
                });
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, password: e.target.value };
                });
              }}
            />

            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link to="/forgotten-password">
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
                    Mot de passe oublié?
                  </Typography>{" "}
                </Link>
              </Grid>
            </Grid>

            {isLoading ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
                sx={{ mt: 3, mb: 3, height: "40px" }}
              >
                Se connecter
              </Button>
            )}

            <Grid container>
              <Grid item xs>
                Vous n'avez pas de compte?{" "}
                <Link to="/signup">
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
                    S'enregistrer
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
