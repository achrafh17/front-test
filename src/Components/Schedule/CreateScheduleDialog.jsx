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

export default function CreateScheduleDialog({
  open,
  onClose,
  editSchedule,
  onSave,
  playlists,
  devices,
}) {
  const [title, setTitle] = useState(editSchedule?.title || "");
  const [playlist, setPlaylist] = useState(editSchedule?.playlistId || "");
  const [selectedDevice, setSelectedDevice] = useState(
    editSchedule?.deviceId || "",
  );
  const [step, setStep] = useState(1);
  const [openTimeline, setTimeline] = useState(false);

  const saveTimeline = (data) => {
    onSave({
      scheduleId: editSchedule ? editSchedule.scheduleId : Date.now(),
      title,
      playlistId: playlist,
      deviceId: selectedDevice,
      ...data,
    });
    handleClose();
  };
  const handleClose = () => {
    setTitle("");
    setPlaylist("");
    setSelectedDevice("");
    setStep(1);
    setTimeline(false);
    onClose();
  };
  useEffect(() => {
    if (open) {
      if (editSchedule) {
        setTitle(editSchedule.title || "");
        setPlaylist(editSchedule.playlistId || "");
        setSelectedDevice(editSchedule.deviceId || "");
      } else {
        setTitle("");
        setPlaylist("");
        setSelectedDevice("");
      }
      setStep(1);
      setTimeline(false);
    }
  }, [open, editSchedule]);

  return (
    <>
      <Dialog
        open={open && step === 1}
        onClose={handleClose}
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
            <InputLabel id="playlist-label">Playlist</InputLabel>
            <Select
              labelId="playlist-label"
              value={playlist}
              label="Playlist"
              onChange={(e) => setPlaylist(e.target.value)}
            >
              {playlists.map((p) => (
                <MenuItem key={p.playlistId} value={p.playlistId}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          {/* ------------------------------------------ */}
          {playlist && devices.length > 0 && (
            <StyledFormControl fullWidth>
              <InputLabel id="device-label">Écrans</InputLabel>
              <Select
                labelId="device-label"
                value={selectedDevice}
                label="Écrans"
                onChange={(e) => setSelectedDevice(e.target.value)}
              >
                {devices.map((d) => (
                  <MenuItem key={d.deviceId} value={d.deviceId}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            variant="contained"
            disabled={!title || !playlist || !selectedDevice}
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
        addscheduleByPlaylistOrDevice={false}
        title={title}
        selectedDevice={selectedDevice}
        playlistId={playlist}
        editSchedule={editSchedule}
      />
    </>
  );
}
