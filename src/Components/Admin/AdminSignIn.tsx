import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
//@ts-ignore
import logoBlack from "../../assets/images/logoBlack.png";

interface props {
    onSuccess: ()=>void;
}
const AdminSignIn : React.FC<props> = ({onSuccess}) => {

  const [formFields, setFormFields] = useState({
    username: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!formFields.username || !formFields.password) {
        setErrorMsg("Vérifiez les données entrées");
      } else {
        setErrorMsg(null);
        
        if(formFields.username === "admin" && formFields.password === "PowerSociety.91"){
            onSuccess();
        }else{
                setErrorMsg("Votre username et/ou mot de passe sont erronés");
        }
        }
      }


  return (
    <>
      <Grid
        container
        component="main"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh", position:"relative"}}
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
              id="Username"
              label="Username"
              name="Username"
              autoFocus
              value={formFields.username}
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, username: e.target.value };
                });
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Mot de Passe"
              type="password"
              id="password"
              value={formFields.password}
              onChange={(e) => {
                setFormFields((oldFormData) => {
                  return { ...oldFormData, password: e.target.value };
                });
              }}
            />

            {!!errorMsg && (
              <Typography
                variant="subtitle2"
                sx={{ color: "#F00020", textAlign: "center", mt: 1 }}
              >
                {errorMsg}
              </Typography>
            )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 3, height: "40px" }}
              >
                Se connecter
              </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
}

export default AdminSignIn;