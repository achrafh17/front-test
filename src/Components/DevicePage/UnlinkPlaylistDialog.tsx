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
  onDelete: (deletedLinkId: number) => void;
  linkId: number;
}

const UnlinkPlaylistDialog: React.FC<props> = ({
  open,
  onClose,
  onDelete,
    linkId,
}) => {
  const { userInfo } = useAuth();
  const deletePlaylist = async () => {
    var payload = {
      linkId: linkId,
      sessionId: userInfo?.sessionId,
    };
    var res = await fetch("https://www.powersmartscreen.com/unlink-playlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    var resJson = await res.json();
    if (resJson.success) {
      onDelete(linkId);
      onClose();
    } else {
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="delete-playlist-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Supprimer la playlist</DialogTitle>
        <CloseIcon
          onClick={onClose}

          sx={{ marginRight: 2, cursor: "pointer", color:"#ccc" }}
        />
      </div>
      <DialogContent>
        <p>Êtes-vous sûr de vouloir la supprimer?</p>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
          Annuler
        </Button>
        <Button
          type="submit"
          onClick={deletePlaylist}
          variant="contained"
          sx={{ paddingX: 5 }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UnlinkPlaylistDialog;