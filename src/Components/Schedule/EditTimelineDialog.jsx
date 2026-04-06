import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Divider,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatIcon from "@mui/icons-material/Repeat";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Text } from "@mantine/core";
import useAuth from "../../hooks/useAuth";
import FormFeedback from "./FormFeedback";
import {
  LabelWithIcon,
  validateSchedule,
  mergeDateAndTime,
} from "./schedule.utilis";

/* ===================================================== */
export default function EditTimelineDialog({
  open,
  onClose,
  onSave,
  title,
  selectedDevices,
  playlistId,
  editSchedule,
  addscheduleByPlaylistOrDevice,
}) {
  const { userInfo } = useAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [startTime, setStartTime] = useState(() => {
    const s = new Date();
    s.setHours(8, 0, 0, 0);
    return s;
  });
  const [endTime, setEndTime] = useState(() => {
    const e = new Date();
    e.setHours(18, 0, 0, 10);
    return e;
  });

  const [repeatType, setRepeatType] = useState("none");
  const [error, setError] = useState({});
  const [validation, setValidation] = useState("");
  const [editTimeLineTitle, seteditTimeLineTitle] = useState("");
  const isEdit = !!editSchedule;
  const URL = isEdit
    ? "http://localhost:8000/update-schedule"
    : "http://localhost:8000/add-schedule";

  const method = isEdit ? "PUT" : "POST";
  const handleSubmit = () => {
    setError({});
    setValidation("");
    const errorMessage = validateSchedule({
      startDate,
      endDate,
      startTime,
      endTime,
      selectedDevices,
      repeatType,
    });
    if (errorMessage) {
      setError((prev) => ({ ...prev, message: errorMessage }));
      setTimeout(() => {
        setError({});
      }, 3000);
      return;
    }
    const payload = {
      title: addscheduleByPlaylistOrDevice ? editTimeLineTitle : title,
      playlistId: playlistId,
      deviceIdsRaw: selectedDevices,
      startDate: mergeDateAndTime(
        startDate,
        startTime,
        repeatType,
      ).toISOString(),
      endDate: mergeDateAndTime(endDate, endTime, repeatType).toISOString(),
      priority: 1,
      repeatType: repeatType,
      isActive: true,
      createdAt: new Date().toISOString(),
      sessionId: userInfo?.sessionId,
      scheduleId: editSchedule?.scheduleId ? editSchedule?.scheduleId : "",
    };

    fetch(URL, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setError({});
        if (!data.success) {
          setError(data);
          setTimeout(() => {
            setError({});
          }, 3000);
          return;
        }
        setValidation(data.message);
        setTimeout(() => {
          setValidation("");
          onSave(payload);
          seteditTimeLineTitle("");
          onClose();
        }, 1500);
      })
      .catch(() => {
        setError((prev) => ({ ...prev, message: "Erreur serveur." }));
      });
  };
  useEffect(() => {
    if (!open) {
      setStartDate(today);
      setEndDate(today);
      const s = new Date();
      s.setHours(8, 0, 0, 0);
      setStartTime(s);

      const e = new Date();
      e.setHours(18, 0, 0, 0);
      setEndTime(e);

      setRepeatType("none");
      setError({});
      setValidation("");
    }
  }, [open]);
  useEffect(() => {
    if (editSchedule && open) {
      const start = new Date(editSchedule.startDate);
      const end = new Date(editSchedule.endDate);

      setStartDate(start);
      setEndDate(end);
      setStartTime(start);
      setEndTime(end);
      setRepeatType(editSchedule.repeatType);
    }
  }, [editSchedule, open]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          overflow: "visible",
        },
      }}
    >
      {/* -----------------ALERT AND VALIDATION------------------------- */}
      <FormFeedback error={error} validation={validation} />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", px: 3, pt: 2 }}
      >
        <DialogTitle sx={{ p: 0 }}>ÉTABLIR LE CALENDRIER</DialogTitle>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
      </Box>

      {addscheduleByPlaylistOrDevice && (
        <Box sx={{ px: 3, pt: 2 }}>
          <TextField
            label="Titre du calendrier"
            placeholder="Ex: Playlist matin magasin"
            fullWidth
            value={editTimeLineTitle}
            onChange={(e) => seteditTimeLineTitle(e.target.value)}
          />
        </Box>
      )}
      <DialogContent sx={{ px: 3, overflow: "visible" }}>
        {!editSchedule && (
          <>
            <FormControl fullWidth size="small">
              <FormLabel sx={{ mb: 1 }}>
                <LabelWithIcon icon={RepeatIcon} text="Répétition" />
              </FormLabel>

              <Select
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
              >
                <MenuItem value="none">Aucune</MenuItem>
                <MenuItem value="daily">Quotidienne</MenuItem>
              </Select>
            </FormControl>

            {repeatType === "daily" && <Text mt={2}>📌 Tous les jours</Text>}

            <Text size="xs" color="dimmed" mt={1}>
              <span style={{ color: "red" }}>*</span> Obligatoire
            </Text>

            <Divider sx={{ my: 3 }} />
          </>
        )}

        {repeatType === "none" && (
          <Grid container spacing={2}>
            {/* START DATE */}
            <Grid item xs={8}>
              <DatePicker
                label={
                  <LabelWithIcon
                    icon={CalendarMonthIcon}
                    text="Date Début"
                    required
                  />
                }
                value={startDate}
                minDate={today}
                onChange={setStartDate}
                dropdownType="popover"
                withinPortal={false}
                popoverProps={{
                  middlewares: { flip: true, shift: true },
                  position: "bottom-start",
                }}
              />
            </Grid>

            <Grid item xs={4}>
              <TimeInput
                label={
                  <LabelWithIcon
                    icon={AccessTimeIcon}
                    text="Heure début"
                    required
                  />
                }
                value={startTime}
                onChange={setStartTime}
                withSeconds
                size="sm"
              />
            </Grid>

            {/* END DATE */}

            <>
              <Grid item xs={8}>
                <DatePicker
                  label={
                    <LabelWithIcon
                      icon={CalendarMonthIcon}
                      text="Date fin"
                      required
                    />
                  }
                  value={endDate}
                  minDate={startDate}
                  onChange={setEndDate}
                  size="sm"
                  dropdownType="popover"
                  withinPortal={false}
                />
              </Grid>

              <Grid item xs={4}>
                <TimeInput
                  label={
                    <LabelWithIcon
                      icon={AccessTimeIcon}
                      text="Heure fin"
                      required
                    />
                  }
                  value={endTime}
                  onChange={setEndTime}
                  withSeconds
                  size="sm"
                />
              </Grid>
            </>
          </Grid>
        )}

        {repeatType === "daily" && (
          <Grid container spacing={2}>
            {/* START TIME */}
            <Grid item xs={6}>
              <TimeInput
                label={
                  <LabelWithIcon
                    icon={AccessTimeIcon}
                    text="Heure début"
                    required
                  />
                }
                value={startTime}
                onChange={setStartTime}
                withSeconds
                size="sm"
                fullWidth
              />
            </Grid>

            {/* END TIME */}
            <Grid item xs={6}>
              <TimeInput
                label={
                  <LabelWithIcon
                    icon={AccessTimeIcon}
                    text="Heure fin"
                    required
                  />
                }
                value={endTime}
                onChange={setEndTime}
                withSeconds
                size="sm"
                fullWidth
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          RETOUR
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          ENREGISTRER
        </Button>
      </DialogActions>
    </Dialog>
  );
}
