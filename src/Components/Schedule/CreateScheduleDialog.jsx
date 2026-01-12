import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditTimelineDialog from "../EditTimelineDialog";

const StyledFormControl = styled(FormControl)({
  marginTop: 16,
  marginBottom: 16,
});

const Divider = styled("div")({
  height: "1px",
  backgroundColor: "#ddd",
  margin: "12px 0 16px",
  width: "100%",
});

const MOCK_PLAYLISTS = [
  { id: 1, name: "Playlist 1" },
  { id: 2, name: "Playlist 2" },
  { id: 3, name: "Playlist 3" },
];

const MOCK_SCREENS = {
  1: [
    { id: 101, name: "Écran 1A" },
    { id: 102, name: "Écran 1B" },
  ],
  2: [
    { id: 201, name: "Écran 2A" },
    { id: 202, name: "Écran 2B" },
  ],
  3: [
    { id: 301, name: "Écran 3A" },
    { id: 302, name: "Écran 3B" },
  ],
};

export default function CreateScheduleDialog({
  open,
  onClose,
  editSchedule,
  onSave,
}) {
  const [title, setTitle] = useState(editSchedule?.title || "");
  const [playlist, setPlaylist] = useState(editSchedule?.playlistId || "");
  const [screens, setScreens] = useState([]);
  const [selected, setSelected] = useState(editSchedule?.screens || []);
  const [step, setStep] = useState(1);
  const [openTimeline, setTimeline] = useState(false);

  useEffect(() => {
    playlist ? setScreens(MOCK_SCREENS[playlist]) : setScreens([]);
    setSelected([]); // reset sélection quand playlist change
  }, [playlist]);

  const saveTimeline = (data) => {
    onSave({
      id: editSchedule ? editSchedule.id : Date.now(),
      title,
      playlistId: playlist,
      screens: selected,
      ...data,
    });
    onClose();
    setTitle("");
    setPlaylist("");
    setSelected([]);
  };

  return (
    <>
      <Dialog
        open={open && step === 1}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editSchedule ? "Modifier un Schedule" : "Créer un Schedule"}
        </DialogTitle>

        {/* Ligne de séparation propre */}
        <Divider />

        <DialogContent>
          <TextField
            label="Titre"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <StyledFormControl fullWidth>
            <InputLabel>Playlist</InputLabel>
            <Select
              value={playlist}
              onChange={(e) => setPlaylist(e.target.value)}
            >
              {MOCK_PLAYLISTS.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <FormGroup>
            {screens.map((s) => (
              <FormControlLabel
                key={s.id}
                control={
                  <Checkbox
                    checked={selected.includes(s.id)}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelected((prev) => [...prev, s.id])
                        : setSelected((prev) =>
                            prev.filter((id) => id !== s.id)
                          )
                    }
                  />
                }
                label={s.name}
              />
            ))}
          </FormGroup>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            variant="contained"
            disabled={!title || !playlist || selected.length === 0}
            onClick={() => {
              setStep(2);
              setTimeline(true);
            }}
          >
            Suivant
          </Button>
        </DialogActions>
      </Dialog>

      <EditTimelineDialog
        open={openTimeline}
        onClose={() => {
          setTimeline(false);
          setStep(1);
        }}
        onSave={saveTimeline}
      />
    </>
  );
}
