import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UsersTable from "./UsersTable";
// @ts-expect-error
import LogoIMG from "../../assets/images/logoWhite.png";
import Alert from "@mui/material/Alert";
import ConfirmationDialog from "./ConfirmationDialog";
import useStore from "../../store/store";
import Snackbar from "@mui/material/Snackbar";
import React from "react";

function AdminApp() {

  const userToPerformActionOn = useStore(
    (state) => state.userToPerformActionOn
  );
  const setUserToPerformActionOn = useStore(
    (state) => state.setUserToPerformActionOn
  );
  const failState = useStore((state) => state.failState);
  const setFailState = useStore((state) => state.setFailState);
  const successState = useStore((state) => state.successState);
  const setSuccessState = useStore((state) => state.setSuccessState);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 7,
          alignItems: "center",
          py: 2,
          px: 3,
          backgroundColor: "#123",
        }}
      >
        <img src={LogoIMG} alt="logo" style={{ height: 60, width: 60 }} />
        <Typography component="h1" sx={{ color: "white", fontSize: 34 }}>
          Dashboard
        </Typography>
      </Box>
      <UsersTable />
      <ConfirmationDialog
        open={userToPerformActionOn !== null}
        onClose={() => {
          setUserToPerformActionOn(null);
        }}
      />
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={successState}
        onClose={() => {
          setSuccessState(false);
        }}
      >
        <Alert
          variant="filled"
          onClose={() => {
            setSuccessState(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          Opération effectuée avec succès
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={failState}
        onClose={() => {
          setFailState(false);
        }}
      >
        <Alert
          variant="filled"
          onClose={() => {
            setSuccessState(false);
          }}
          severity="error"
          sx={{ width: "100%" }}
        >
          Opération non effectuée
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminApp;
