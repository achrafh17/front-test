import { useState } from "react";
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

export default function CreateScheduleDialog({
  open,
  onClose,
  onAdd,
  playlists,
  scheduleData,
  setScheduleData,
  devices,
  onValidate,
  step,
  setStep,
  validationError,
  openValidateScheduleDialog,
  addScheduleValidationError,
  addScheduleValidationSuccess,
}) {
  const devicesExamples = [
    {
      deviceId: "dev-101",
      name: "Écran Accueil",
      location: "Entrée magasin",
      status: "online",
    },
    {
      deviceId: "dev-102",
      name: "Écran Vitrine",
      location: "Vitrine principale",
      status: "online",
    },
    {
      deviceId: "dev-103",
      name: "Écran Caisse",
      location: "Zone caisse",
      status: "offline",
    },
    {
      deviceId: "dev-104",
      name: "Écran Restaurant",
      location: "Salle principale",
      status: "online",
    },
    {
      deviceId: "dev-105",
      name: "Écran Promotion",
      location: "Rayon promotions",
      status: "offline",
    },
    {
      deviceId: "dev-106",
      name: "Écran Étages",
      location: "2ème étage",
      status: "online",
    },
    {
      deviceId: "dev-107",
      name: "Écran Produits",
      location: "Rayon produits",
      status: "online",
    },
    {
      deviceId: "dev-108",
      name: "Écran Publicité",
      location: "Entrée secondaire",
      status: "online",
    },
    {
      deviceId: "dev-109",
      name: "Écran Menu",
      location: "Zone restauration",
      status: "offline",
    },
    {
      deviceId: "dev-110",
      name: "Écran Infos",
      location: "Accueil clients",
      status: "online",
    },
    {
      deviceId: "dev-111",
      name: "Écran Direction",
      location: "Bureau direction",
      status: "online",
    },
    {
      deviceId: "dev-112",
      name: "Écran Stock",
      location: "Zone stockage",
      status: "offline",
    },
    {
      deviceId: "dev-113",
      name: "Écran Couloir",
      location: "Couloir principal",
      status: "online",
    },
    {
      deviceId: "dev-114",
      name: "Écran Hall",
      location: "Hall principal",
      status: "online",
    },
    {
      deviceId: "dev-115",
      name: "Écran Parking",
      location: "Entrée parking",
      status: "offline",
    },
    {
      deviceId: "dev-116",
      name: "Écran Salle Réunion",
      location: "Salle réunion",
      status: "online",
    },
    {
      deviceId: "dev-117",
      name: "Écran Couloir Nord",
      location: "Couloir nord",
      status: "online",
    },
    {
      deviceId: "dev-118",
      name: "Écran Couloir Sud",
      location: "Couloir sud",
      status: "offline",
    },
    {
      deviceId: "dev-119",
      name: "Écran Couloir Sud",
      location: "Couloir sud",
      status: "offline",
    },
  ];

  const [openTimeline, setTimeline] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const startPage = (page - 1) * ITEMS_PER_PAGE;
  const endPage = startPage + ITEMS_PER_PAGE;
  const totalPages = Math.max(
    1,
    Math.ceil((devices.length || 0) / ITEMS_PER_PAGE),
  );

  const devicesToShow = devices.slice(startPage, endPage);
  const handleClose = () => {
    setScheduleData((prev) => ({ ...prev, title: "" }));
    setScheduleData((prev) => ({ ...prev, playlist: {} }));
    setScheduleData((prev) => ({ ...prev, devices: [] }));
    setStep(1);
    setTimeline(false);
    setPage(1);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open && step === 1}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Créer un Schedule</DialogTitle>

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
              value={scheduleData.playlist}
              label="Playlist"
              onChange={(e) =>
                setScheduleData((prev) => ({
                  ...prev,
                  playlist: e.target.value,
                }))
              }
            >
              {playlists.map((p) => (
                <MenuItem key={p.playlistId} value={p}>
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
                  setScheduleData((prev) => ({ ...prev, devices: devices }));
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
                {scheduleData.devices?.length} sélectionné(s)
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
                        setScheduleData((prev) => ({
                          ...prev,
                          devices: prev.devices.some(
                            (device) => device.deviceId === d.deviceId,
                          )
                            ? prev.devices.filter(
                                (device) => device.deviceId !== d.deviceId,
                              )
                            : [...prev.devices, d],
                        }));
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
              !scheduleData.playlist ||
              scheduleData.devices.length === 0
            }
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
        onClose={onClose}
        onAdd={onAdd}
        onValidate={onValidate}
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        step={step}
        setStep={setStep}
        validationError={validationError}
        openValidateScheduleDialog={openValidateScheduleDialog}
        addScheduleValidationError={addScheduleValidationError}
        addScheduleValidationSuccess={addScheduleValidationSuccess}
      />
    </>
  );
}
