import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatIcon from "@mui/icons-material/Repeat";

import { DatePicker, TimeInput } from "@mantine/dates";
import { Text } from "@mantine/core";
import useAuth from "../hooks/useAuth";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";

/* ---------------- LABEL ---------------- */
const LabelWithIcon = ({ icon: Icon, text, required }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Icon fontSize="small" sx={{ color: "text.secondary" }} />
    <span>
      {text} {required && <span style={{ color: "red" }}>*</span>}
    </span>
  </Box>
);

/* ---------------- MERGE DATE+TIME ---------------- */
const mergeDateAndTime = (date, time) => {
  const d = new Date(date);
  d.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);
  return d;
};

/* ---------------- DAYS MAP ---------------- */
const WEEK_DAYS = [
  { label: "Lundi", value: "Lundi" },
  { label: "Mardi", value: "Mardi" },
  { label: "Mercredi", value: "Mercredi" },
  { label: "Jeudi", value: "Jeudi" },
  { label: "Vendredi", value: "Vendredi" },
  { label: "Samedi", value: "Samedi" },
  { label: "Dimanche", value: "Dimanche" },
];

/* ===================================================== */
export default function EditTimelineDialog({
  open,
  onClose,
  onSave,
  title,
  selectedDevice,
  playlistId,
  editSchedule,
  addscheduleByPlaylistOrDevice,
}) {
  /* ========== DEFAULT DATES ========== */
  const { userInfo } = useAuth();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [eventType, setEventType] = useState("schedule");

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [startTime, setStartTime] = useState(() => {
    const s = new Date();
    s.setHours(8, 0, 0, 0);
    return s;
  });
  const [endTime, setEndTime] = useState(() => {
    const e = new Date();
    e.setHours(18, 0, 0, 0);
    return e;
  });

  const [repeatType, setRepeatType] = useState("none");
  const [repeatDays, setRepeatDays] = useState([]);

  const [error, setError] = useState("");
  const [validation, setValidation] = useState("");
  const [editTimeLineTitle, seteditTimeLineTitle] = useState("");

  /* ---------------- REPEAT AUTO LOGIC ---------------- */
  const autoFillRepeat = (type, date) => {
    if (!date) return setRepeatDays([]);

    const jsDay = date.getDay(); //0 = Dimanche
    const mappedDay = WEEK_DAYS[(jsDay + 6) % 7].value;
    const dayNum = date.getDate();
    const month = date.getMonth() + 1;

    switch (type) {
      case "weekly":
        return setRepeatDays([mappedDay]);
      case "monthly":
        return setRepeatDays([`day-${dayNum}`]);
      case "yearly":
        return setRepeatDays([`${dayNum}/${month}`]);
      case "daily":
        return setRepeatDays(WEEK_DAYS.map((d) => d.value));
      case "weekday":
        return setRepeatDays([
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
        ]);
      default:
        return setRepeatDays([]);
    }
  };

  const handleRepeatTypeChange = (value) => {
    setRepeatType(value);
    autoFillRepeat(value, startDate);
  };

  useEffect(() => {
    autoFillRepeat(repeatType, startDate);
  }, [startDate]);

  /* ---------------- VALIDATION + SUBMIT ---------------- */
  const handleSubmit = () => {
    console.log("for the new feature here is the edit", editSchedule);
    setError("");
    setValidation("");

    if (!startDate) return setError("Veuillez choisir une date de début.");
    if (startDate < today)
      return setError("La date de début doit être aujourd'hui ou après.");

    if (eventType === "schedule" && !endDate)
      return setError("Veuillez sélectionner la date de fin.");

    if (endDate < startDate)
      return setError("La date de fin ne peut pas être avant le début.");

    if (
      startDate.toDateString() === endDate.toDateString() &&
      endTime < startTime
    )
      return setError("Heure fin < heure début.");

    const payload = {
      title: addscheduleByPlaylistOrDevice ? editTimeLineTitle : title,
      playlistId: playlistId,
      deviceId: selectedDevice,
      startDate: mergeDateAndTime(startDate, startTime).toISOString(),
      endDate:
        eventType === "schedule"
          ? mergeDateAndTime(endDate, endTime).toISOString()
          : null,
      priority: 1,
      repeatType: repeatType === "none" ? "none" : repeatType,
      repeatDays: repeatDays.length ? repeatDays.join(",") : null,
      isActive: true,
      createdAt: new Date().toISOString(),
      sessionId: userInfo?.sessionId,
      scheduleId: editSchedule?.scheduleId ? editSchedule?.scheduleId : "",
    };
    console.log("here is the payload", payload);
    if (editSchedule !== null && editSchedule !== undefined) {
      fetch(`http://localhost:8000/update-schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (!data.success) {
            setError(data.message);
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          }
          setValidation(data.message);
          setTimeout(() => {
            setValidation("");
            onSave(payload);
            seteditTimeLineTitle("");
            onClose();
          }, 3000);
        });
    } else {
      console.log("here is the payload", payload);
      fetch(`http://localhost:8000/add-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setError("");
          if (!data.success) {
            setError(data.message);
            setTimeout(() => {
              setError("");
            }, 3000);
            return;
          }
          setValidation(data.message);
          setTimeout(() => {
            setValidation("");
            onSave(payload);
            seteditTimeLineTitle("");
            onClose();
          }, 3000);
        });
    }
  };
  useEffect(() => {
    if (!open) {
      setEventType("schedule");
      setStartDate(today);
      setEndDate(today);

      const s = new Date();
      s.setHours(8, 0, 0, 0);
      setStartTime(s);

      const e = new Date();
      e.setHours(18, 0, 0, 0);
      setEndTime(e);

      setRepeatType("none");
      setRepeatDays([]);
      setError("");
      setValidation("");
    }
  }, [open]);

  /* ===================== UI ===================== */
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* HEADER */}
      <Collapse in={Boolean(error)} timeout={300}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
            px: 2,
          }}
        >
          <Alert
            severity="error"
            sx={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 2,
            }}
          >
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
        </Box>
      </Collapse>

      <Collapse in={Boolean(validation)} timeout={300}>
        <Box sx={{ px: 2, mt: 1 }}>
          <Alert severity="success">
            <AlertTitle>Succès</AlertTitle>
            {validation}
          </Alert>
        </Box>
      </Collapse>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", px: 3, pt: 2 }}
      >
        <DialogTitle sx={{ p: 0 }}>ÉTABLIR LE CALENDRIER</DialogTitle>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
      </Box>

      {/* EVENT TYPE */}
      <Box sx={{ px: 3, pt: 1 }}>
        {addscheduleByPlaylistOrDevice && (
          <TextField
            label="Titre"
            fullWidth
            value={editTimeLineTitle}
            onChange={(e) => seteditTimeLineTitle(e.target.value)}
            size="small"
            sx={{
              mt: 2,
              mb: 2,
            }}
          />
        )}

        <FormControl>
          <FormLabel>Type d'événement</FormLabel>
          <RadioGroup
            row
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <FormControlLabel
              value="schedule"
              control={<Radio />}
              label="Schedule Content"
            />
            <FormControlLabel
              value="turn_off"
              control={<Radio />}
              label="Turn Screen Off"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <DialogContent sx={{ px: 3 }}>
        <Grid container spacing={2}>
          {/* START DATE */}
          <Grid item xs={8}>
            <DatePicker
              label={
                <LabelWithIcon
                  icon={CalendarMonthIcon}
                  text="Date début"
                  required
                />
              }
              value={startDate}
              minDate={today}
              onChange={setStartDate}
              size="sm"
              withinPortal={false}
            />
          </Grid>

          <Grid item xs={4}>
            <TimeInput
              label={
                <LabelWithIcon icon={AccessTimeIcon} text="Heure" required />
              }
              value={startTime}
              onChange={setStartTime}
              withSeconds
              size="sm"
            />
          </Grid>

          {/* END DATE */}
          {eventType === "schedule" && (
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
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* REPEAT */}
        <FormControl fullWidth size="small">
          <FormLabel sx={{ mb: 1 }}>
            <LabelWithIcon icon={RepeatIcon} text="Répétition" />
          </FormLabel>

          <Select
            value={repeatType}
            onChange={(e) => handleRepeatTypeChange(e.target.value)}
          >
            <MenuItem value="none">Aucune</MenuItem>
            <MenuItem value="daily">Quotidienne</MenuItem>
       
          </Select>
        </FormControl>

        {/* AUTO DISPLAY */}
        {repeatType === "weekly" && (
          <Text mt={2}>
            📌 Répète chaque <b>{repeatDays}</b>
          </Text>
        )}
        {repeatType === "monthly" && (
          <Text mt={2}>
            📌 Chaque <b>{repeatDays[0]?.replace("day-", "")}</b> du mois
          </Text>
        )}
        {repeatType === "yearly" && (
          <Text mt={2}>
            📌 Chaque année le <b>{repeatDays[0]}</b>
          </Text>
        )}
        {repeatType === "daily" && <Text mt={2}>📌 Tous les jours</Text>}

        <Text size="xs" color="dimmed" mt={1}>
          <span style={{ color: "red" }}>*</span> Obligatoire
        </Text>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          ANNULER
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          ENREGISTRER
        </Button>
      </DialogActions>
    </Dialog>
  );
}
