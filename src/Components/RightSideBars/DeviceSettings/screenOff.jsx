import {  useState } from "react";

import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";

import { DatePicker, TimeInput } from "@mantine/dates";
import useAuth from "../../../hooks/useAuth";

export default function ScreenOff({ open, onClose, deviceId, setFields }) {
  const { userInfo } = useAuth();
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState("");
  const [startTime, setStartTime] = useState(() => {
    const s = new Date();
    s.setHours(8, 0, 0, 0);
    return s;
  });
  

  //-----------------------------------------------------------------
  const handleSubmit = () => {
    setError("");
    try {
      if (!startDate) return setError("Veuillez choisir une date de début.");
      const start = new Date(startDate);
      start.setHours(
        startTime.getHours(),
        startTime.getMinutes(),
        startTime.getSeconds(),
      );
      
      const now = new Date();
      if (start <= now)
        return setError("La date de début doit être après l'heure actuelle.");
 
      setFields((old) => {
        return {
          ...old,
          sleepMode: true,
          sleepStart: start.toISOString(),
        
        };
      });
      fetch(
        `http://localhost:8000/screenOff?sessionId=${userInfo?.sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startDate: start.toISOString(),
            deviceId: deviceId,
          }),
        },
      )
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
            onClose();
          }, 3000);
        })
        .catch(() => setError("Erreur réseau. Veuillez réessayer. "));
    } catch (error) {
      console.error("error from turn off screen", error);
      setError("error");
    }
  };

  //---------------------------------------------------------------------------------

  return (
    <Collapse
      sx={{
        display: "flex",
        p: 1,
      }}
      in={open}
      timeout={300}
      unmountOnExit
    >
      <Collapse in={Boolean(error)} timeout={300}>
        <Box
          sx={{
            display: "",
            justifyContent: "center",
            mt: 2,
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
        <Box sx={{ mt: 1 }}>
          <Alert severity="success">
            <AlertTitle>Succès</AlertTitle>
            {validation}
          </Alert>
        </Box>
      </Collapse>
      {/* -------- Début -------- */}
      <Box sx={{}}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          Date début
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <DatePicker
            value={startDate}
            minDate={today}
            onChange={setStartDate}
            size="sm"
            withinPortal
            sx={{ mt: 0.5 }}
          />

          <TimeInput
            value={startTime}
            onChange={setStartTime}
            withSeconds
            size="sm"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
    
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 3,
        }}
      >
        <Button size="meduim" variant="outlined" onClick={onClose}>
          ANNULER
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={Boolean(validation)}
          size="small"
        >
          ENREGISTRER
        </Button>
      </Box>
    </Collapse>
  );
}
