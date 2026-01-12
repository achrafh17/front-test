import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState } from "react";
import { TextField } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { IPlaylistInfo } from "../../types/api.types";

interface props{
  open: boolean;
  onClose: () => void;
  onSave: (newPlaylist: IPlaylistInfo)=>void;
}

 const AddPlaylistDialog: React.FC<props> = ({ open, onClose, onSave }) => {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    var payload = {
      sessionId: userInfo?.sessionId,
      name: playlistName,
    };
    try {
      var res = await fetch("https://www.powersmartscreen.com/add-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      setIsLoading(false);
      if (resJson.success) {
        var addedPlaylist = resJson.result as IPlaylistInfo;
        onSave(addedPlaylist);
        setPlaylistName("");
        onClose();
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      id="add-content-dialog"
      maxWidth="md"
    >
      <div className="add-dialog-top">
        <DialogTitle>Ajouter une playlist</DialogTitle>
        <CloseIcon
          onClick={onClose}
          
          sx={{ marginRight: 2, cursor: "pointer", color: "#ccc"}}
        />
      </div>
      <DialogContent
        sx={{
          padding: 6,
          maxHeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          variant="outlined"
          label="Nom de la playlist"
          value={playlistName}
          onChange={(e) => {
            setPlaylistName(e.target.value);
          }}
          fullWidth
        />
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
}

export default AddPlaylistDialog;