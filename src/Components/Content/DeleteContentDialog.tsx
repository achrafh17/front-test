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
  onDelete: (deletedId: number) => void;
  contentId: number;
}

const DeleteContentDialog: React.FC<props> = ({
  open,
  onClose,
  onDelete,
  contentId,
}) => {
  const { userInfo } = useAuth();
  const deleteContent = async () => {
    var payload = {
      contentId: contentId,
      sessionId: userInfo?.sessionId,
    };
    var res = await fetch("https://www.powersmartscreen.com/delete-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    var resJson = await res.json();
    if (resJson?.success) {
      onDelete(contentId);
      onClose();
    } else {
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="delete-content-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Supprimer le contenu</DialogTitle>
        <CloseIcon
          onClick={onClose}

          sx={{ marginRight: 2, cursor: "pointer", color:"#ccc" }}
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
          onClick={deleteContent}
          variant="contained"
          sx={{ paddingX: 5 }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteContentDialog;