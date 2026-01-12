import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "../../hooks/useAuth";
import React from "react";

interface props {
  open: boolean;
  onClose: () => void;
  onDelete: (deviceId: number, groupId?: number) => void;
  deviceId: number | null;
  groupId?: number; 
}

const DeleteDeviceDialog : React.FC<props> = ({
  open,
  onClose,
  onDelete,
  deviceId,
  groupId
}) => {

  const {userInfo} = useAuth();
  const deleteScreen = async () => {
    if(deviceId){
      var payload = {
        deviceId: deviceId,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/delete-device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      if (resJson?.success) {
        onDelete(deviceId, groupId);
        onClose();
      } else {
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="delete-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Supprimer l'écran</DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent>
        <p>Êtes-vous sûr de vouloir le supprimer?</p>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
          Annuler
        </Button>
        <Button
          type="submit"
          onClick={deleteScreen}
          variant="contained"
          sx={{ paddingX: 5 }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDeviceDialog;