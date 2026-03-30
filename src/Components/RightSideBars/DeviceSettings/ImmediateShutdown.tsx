import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useEffect, useState } from "react";
import { Transition } from "../../../utils/schedule.utilis";
import { IDevice } from "../../../types/api.types";
import { ISchedule } from "../../Schedule/Main";
interface Props {
  deviceInfo: IDevice;
  sessionId: string | null;
  actualSchedule: ISchedule;
}

export default function ImmediateShutdown({
  deviceInfo,
  sessionId,
  actualSchedule,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceInfoTemp, setDeviceInfoTemp] = useState<IDevice | null>(null);
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/get-deviceOff?sessionId=${sessionId}&deviceId=${deviceInfo.deviceId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (!res.ok) return;
        const data = await res.json();

        setDeviceInfoTemp(data.device);
      } catch (error) { 
        if (error instanceof Error)
          console.log(
            "error from fetch device shutDOWN immediat",
            error.message,
          );
      }
    };
    fetchDevice();
  }, [openDialog, sessionId, deviceInfo.deviceId]);

  const sleepMode = deviceInfoTemp?.sleepMode;
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!deviceInfo?.deviceId) {
        setError("Device Not found");
        setLoading(false);
        return;
      }
      if (!deviceInfoTemp) {
        setLoading(false);
        return;
      }
      const res = await fetch(
        `http://localhost:8000/immediat-turn-off-screen?sessionId=${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deviceId: deviceInfo.deviceId,
            sleepMode: !sleepMode,
          }),
        },
      );
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        setTimeout(() => {
          setError("");
          setLoading(false);
        }, 3000);
        return;
      }
      setValidation(data.message);
      setTimeout(() => {
        setLoading(false);
        setValidation("");
        setOpenDialog(false);
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error from shutDOWN", error.message);
      }
      setLoading(false);
      setError("Erreur serveur");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box fullWidth sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<PowerSettingsNewIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            textTransform: "none",
            fontSize: 14,
            height: 40,
            borderRadius: 1.5,
            justifyContent: "center",
            color: sleepMode ? "#6b7280" : "#F00020",
            borderColor: sleepMode ? "#d1d5db" : "#F00020",
            "&:hover": {
              borderColor: "#F00020",
              backgroundColor: "rgba(240,0,32,0.04)",
            },
          }}
        >
          {sleepMode ? "Allumer l'écran" : "Éteindre l'écran"}
        </Button>
      </Box>
      <Dialog
        open={openDialog}
        onClose={() => {
          if (!loading) setOpenDialog(false);
        }}
        TransitionComponent={Transition}
      >
        {" "}
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
        <DialogTitle>
          {sleepMode
            ? "Confirmer l'activation de l'écran"
            : "Confirmer l'arrêt de l'écran"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir
            {sleepMode ? " allumer" : " éteindre"} l'écran{" "}
            <strong>{deviceInfo.name}</strong> ?
          </Typography>

          {actualSchedule?.endDate && !sleepMode && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <AlertTitle>Attention</AlertTitle>
              Une planification{" "}
              {actualSchedule.repeatType === "daily" ? "quotidienne" : ""} est
              actuellement en cours :<strong> {actualSchedule.title}</strong>.
              Elle se termine{" "}
              {actualSchedule.repeatType === "daily" ? "aujourd'hui à" : "le"}{" "}
              <strong>
                {actualSchedule.repeatType === "daily"
                  ? new Date(actualSchedule.endDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : new Date(actualSchedule.endDate).toLocaleString()}
              </strong>
              .
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button color="error" onClick={handleSubmit} disabled={loading}>
            {loading
              ? sleepMode
                ? "demarage..."
                : "Arrêt..."
              : sleepMode
                ? "Allumer l'ecran"
                : "Confirmer l'arrêt de l'écran"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
