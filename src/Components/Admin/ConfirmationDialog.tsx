import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import useStore from "../../store/store";

interface props {
  open: boolean;
  onClose: () => void;
}

const ConfirmationDialog : React.FC<props> = ({
  open,
  onClose,
}) => {

    const onConfirm = useStore((state) => state.onConfirm);


  return (
    <Dialog open={open} onClose={onClose} fullWidth id="delete-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Confirmation</DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent>
        <p>Êtes-vous sûr de vouloir poursuivre?</p>
      </DialogContent>
      <DialogActions sx={{ paddingBottom: 3, paddingRight: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
          Annuler
        </Button>
        <Button
          type="submit"
          onClick={onConfirm}
          variant="contained"
          sx={{ paddingX: 5 }}
        >
          Continuer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;