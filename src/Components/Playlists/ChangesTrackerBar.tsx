import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";


interface props {
    numberOfChanges: number;
    onSave: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

const ChangesTrackerBar: React.FC<props> = ({numberOfChanges, isLoading, onSave, onCancel}) => {
    return (
      <Box
        className={`${numberOfChanges !== 0 ? "slide-top" : "slide-bottom"}`}
        sx={{
          width: "100%",
          padding: 2,
          backgroundColor: "#e6ebf0",
          boxShadow: "0px 3px 15px 6px rgba(0,0,0,0.3)",
          height: 68,
          maxHeight: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              backgroundColor: "#F00020",
              color: "white",
              py: 0.5,
              px: 2.5,
              borderRadius: 4,
            }}
          >
            {numberOfChanges}
          </Typography>
          <Typography sx={{ color: "#575b5c" }}>PLAYLISTS MODIFIÉES</Typography>
        </Box>
       {isLoading? <CircularProgress />: <Button variant="contained" onClick={onSave}>
          Enregistrer
        </Button>}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={onCancel}
        >
          <Typography sx={{ color: "#575b5c", textDecoration: "underline" }}>
            ANNULER
          </Typography>
          <CloseIcon sx={{ color: "#575b5c", fontSize: 24 }} />
        </Box>
      </Box>
    );
}
export default ChangesTrackerBar;