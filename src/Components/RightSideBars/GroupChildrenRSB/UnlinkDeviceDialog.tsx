import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";


interface props {
  open: boolean;
  deviceId: number;
  onClose: () => void;
  onDeviceUnlinked: () => void;
}

const UnlinkDeviceDialog: React.FC<props> = ({
  open,
  deviceId,
  onClose,
  onDeviceUnlinked,
}) => {

  const [isLoading, setIsLoading] = useState(false)
  const { userInfo } = useAuth();
  const unlinkDevice = async () => {
    setIsLoading(true)
    try {
      var payload = {
        deviceId: deviceId,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/unlink-device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      var resJson = await res.json();
      setIsLoading(false)
      if (resJson.success) {
        onDeviceUnlinked();
      }
    } catch (e) {
      setIsLoading(false);

    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="delete-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>détacher l'écran du groupe</DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent>
        <p>Êtes-vous sûr de vouloir le détacher?</p>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3, px: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              sx={{
                width: 24,
                height: 24,
              }}
            />
          </Box>
        ) : (
          <>
            <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={unlinkDevice}
              variant="contained"
              sx={{ paddingX: 5 }}
            >
              Confirmer
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UnlinkDeviceDialog;
