import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

interface props {
  open: boolean;
  onClose: () => void;
}

const LayoutNameDialog: React.FC<props> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const {userInfo} = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [layoutName, setLayoutName] = React.useState("Calque 1");


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      var res = await fetch("https://www.powersmartscreen.com/add-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          name: layoutName,
          sessionId: userInfo?.sessionId,
        }),
      });
      var resJson = await res.json();
      if (resJson.success) {
        navigate(`/layouts/${resJson.result.layoutHashId}/${resJson.result.slideHashId}`);
      }
    } catch (e) {}
  setIsLoading(false);

  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="add-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Ajouter un Calque</DialogTitle>
        <CloseIcon
          onClick={onClose}
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
        />
      </div>
      <DialogContent>
        <Box sx={{ width: "100%", pt: 2 }}>
          <TextField
          fullWidth
            variant="outlined"
            label="Nom du Calque"
            value={layoutName}
            onChange={(e) => {
              setLayoutName(e.target.value);
            }}
          />
        </Box>
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
              onClick={handleSubmit}
              variant="contained"
              sx={{ paddingX: 5 }}
            >
              Ajouter
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default LayoutNameDialog;
