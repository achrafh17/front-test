import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";

interface props {
  userId: number;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteUserDialog: React.FC<props> = ({
  userId,
  open,
  onClose,
  onSuccess,
}) => {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      var payload = {
        userId: userId,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/delete-user", {
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
        onSuccess();
        onClose();
      }
    } catch (e) {}
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
        <DialogTitle>Supprimer l'utilisateur</DialogTitle>
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
        <Typography>Vouler vous vraiment supprimer l'utilisateur?</Typography>
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
        ) : (
          <>
            <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleConfirm}
              variant="contained"
              sx={{ paddingX: 5 }}
            >
              Supprimer
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;
