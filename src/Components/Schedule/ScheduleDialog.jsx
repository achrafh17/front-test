import { useState, useEffect } from "react";
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
  Typography,
  Grid,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TvIcon from "@mui/icons-material/Tv";
import { styled } from "@mui/material/styles";
import EditTimelineDialog from "./EditTimelineDialog";
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

export default function ScheduleDialog({
  open,
  onClose,
  openCreate,
  mode,
  onSubmit,
  playlists,
  scheduleData,
  setScheduleData,
  devices,
  onValidate,
  step,
  setStep,
  validationFeedBack,

  submissionFeedback,
  setValidationFeedBack,
  isSubmitting,
}) {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const startPage = (page - 1) * ITEMS_PER_PAGE;
  const endPage = startPage + ITEMS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(devices.length / ITEMS_PER_PAGE));

  const devicesToShow = devices.slice(startPage, endPage);
  useEffect(() => {
    setPage(1);
  }, [devices]);

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {mode === "create"
            ? "Créer un Schedule"
            : "Modifier un schedule existant"}
        </DialogTitle>

        {/* Ligne de séparation propre */}
        <Divider />

        <DialogContent>
          <TextField
            label="Titre du calendrier"
            placeholder="Ex: Playlist matin magasin"
            fullWidth
            value={scheduleData.title}
            onChange={(e) =>
              setScheduleData((prev) => ({ ...prev, title: e.target.value }))
            }
          />

          <StyledFormControl fullWidth>
            <InputLabel id="playlist-label">Playlist</InputLabel>
            <Select
              labelId="playlist-label"
              value={scheduleData.playlist.playlistId}
              label="Playlist"
              onChange={(e) => {
                const selected = playlists.find(
                  (playlist) => playlist.playlistId === e.target.value,
                );
                if (!selected) return;
                setScheduleData((prev) => ({ ...prev, playlist: selected }));
              }}
            >
              {playlists.map((p) => (
                <MenuItem key={p.playlistId} value={p.playlistId}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <Box
            sx={{
              mt: 2,
              p: 2,
              gap: 10,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography fontSize={14} fontWeight={600}>
                Écrans
              </Typography>
              <Button
                size="small"
                variant="text"
                sx={{ textTransform: "none", fontSize: 12 }}
                onClick={() => {
                  setScheduleData((prev) => ({
                    ...prev,
                    devices: [...devices],
                  }));
                }}
              >
                Tout sélectionner
              </Button>

              <Button
                size="small"
                variant="text"
                color="inherit"
                sx={{ textTransform: "none", fontSize: 12 }}
                onClick={() => {
                  setScheduleData((prev) => ({ ...prev, devices: [] }));
                }}
              >
                Tout désélectionner
              </Button>
              <Typography variant="caption" color="text.secondary">
                {scheduleData.devices.length} sélectionné(s)
              </Typography>
            </Box>

            {/* Grid */}
            <Grid container spacing={1.5}>
              {devicesToShow.map((d) => {
                const selected = scheduleData.devices.some(
                  (dev) => dev.deviceId === d.deviceId,
                );

                return (
                  <Grid item xs={12} sm={6} key={d.deviceId}>
                    <Paper
                      onClick={() => {
                        setScheduleData((prev) => {
                          const exists = prev.devices.some(
                            (device) => device.deviceId === d.deviceId,
                          );

                          return {
                            ...prev,
                            devices: exists
                              ? prev.devices.filter(
                                  (device) => device.deviceId !== d.deviceId,
                                )
                              : [...prev.devices, d],
                          };
                        });
                      }}
                      sx={{
                        px: 2,
                        py: 1.4,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderRadius: 3,

                        border: selected
                          ? d.isGroup
                            ? "1.5px solid #7b1fa2"
                            : "1.5px solid #1976d2"
                          : "1px solid #e5e7eb",

                        backgroundColor: selected
                          ? d.isGroup
                            ? "#f6f0ff"
                            : "#f3f8ff"
                          : "#ffffff",

                        boxShadow: selected
                          ? "0 4px 12px rgba(0,0,0,0.05)"
                          : "0 1px 2px rgba(0,0,0,0.04)",

                        transition: "all 0.2s ease",

                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                          borderColor: d.isGroup ? "#7b1fa2" : "#1976d2",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.2}>
                        <TvIcon
                          sx={{
                            fontSize: 18,
                            color: d.isGroup ? "#7b1fa2" : "#1976d2",
                          }}
                        />

                        {/* Texts */}
                        <Box>
                          <Typography fontSize={13} fontWeight={600}>
                            {d.name}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            {d.isGroup ? "Groupe d’écrans" : "Écran individuel"}
                          </Typography>
                        </Box>
                      </Box>

                      <Checkbox checked={selected} size="small" />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <IconButton
                size="small"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>

              <Typography variant="caption" color="text.secondary">
                Page {page} / {totalPages}
              </Typography>

              <IconButton
                size="small"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {/* ------------------------------------------ */}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>

          <Button
            variant="contained"
            disabled={
              !scheduleData.title ||
              !scheduleData.playlist.playlistId ||
              scheduleData.devices.length === 0
            }
            onClick={() => {
              setStep(2);
            }}
          >
            Suivant
          </Button>
        </DialogActions>
      </Dialog>

      <EditTimelineDialog
        open={openCreate && step === 2}
        openCreate={openCreate}
        onClose={onClose}
        mode={mode}
        onSubmit={onSubmit}
        onValidate={onValidate}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        step={step}
        setStep={setStep}
        validationFeedBack={validationFeedBack}
        setValidationFeedBack={setValidationFeedBack}
        submissionFeedback={submissionFeedback}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
