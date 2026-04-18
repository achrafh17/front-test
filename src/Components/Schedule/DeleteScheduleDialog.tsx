import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";


interface Props {
  open: boolean;
  title?: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteScheduleDialog: React.FC<Props> = ({
  open,
  title,
  isLoading,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={isLoading ? undefined : onClose}>
      {" "}
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        Êtes-vous sûr de vouloir supprimer le schedule <strong>{title}</strong>{" "}
        ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button color="error" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Suppression..." : "Supprimer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteScheduleDialog;
