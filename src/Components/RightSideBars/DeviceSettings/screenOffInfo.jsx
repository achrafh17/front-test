import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { Collapse, Alert, AlertTitle } from "@mui/material";
import Button from "@mui/material/Button";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function ScreenOffInfo({ userInfo, open, deviceId }) {
  const [deviceInfo, setDeviceInfo] = useState();
  const [error, setError] = useState("");
  const [validation, setValidation] = useState("");
  useEffect(() => {
    if (!open || !userInfo?.sessionId || !deviceId) return;
    fetch(
      `http://localhost:8000/get-deviceOff?sessionId=${userInfo?.sessionId}&deviceId=${deviceId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setDeviceInfo(data.device);
      })
      .catch((error) => console.log("error from screenOff info ", error));
    return () => {};
  }, [open, userInfo?.sessionId, deviceId]);

  const disabledSleepMode = () => {
    fetch(
      `http://localhost:8000/disabled-sleep-mode?sessionId=${userInfo?.sessionId}&deviceId=${deviceId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    )
      .then((res) => res.json())
      .then((data) => {
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
          setDeviceInfo((prev) => ({
            ...prev,
            sleepMode: false,
            sleepStart: null,
            sleepEnd: null,
          }));
        }, 2000);
      });
  };
  const isSleepScheduled =
    deviceInfo?.sleepMode && new Date(deviceInfo?.sleepStart) >= new Date();
  return (
    <Collapse in={open} timeout={300}>
      <>
        {" "}
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
        </Collapse>{" "}
        <Collapse in={Boolean(validation)} timeout={300}>
          <Box sx={{ mt: 1 }}>
            <Alert severity="success">
              <AlertTitle>Succès</AlertTitle>
              {validation}
            </Alert>
          </Box>
        </Collapse>
      </>
      {isSleepScheduled ? (
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f8f9fa",
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 500,
              color: "#555555ff",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <DarkModeIcon sx={{ color: "#dba41aff" }} /> Mode veille programmé
          </Typography>

          <Typography variant="body2" sx={{ color: "#777" }}>
            {/* {dayjs(deviceInfo?.sleepStart).format("DD/MM/YYYY HH:mm")} */}
            {new Date(deviceInfo?.sleepStart).toLocaleString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{
              alignSelf: "flex-end",
              mt: 1,
              borderColor: "#dba41a",
              color: "#dba41a",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "rgba(219, 164, 26, 0.08)",
                borderColor: "#c79314",
              },
            }}
            onClick={disabledSleepMode}
          >
            Désactiver le mode veille
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 2,
            backgroundColor: "#f8f9fa",
            border: "1px dashed #dcdcdc",
            alignItems: "center",
            display: "flex",
            gap: 1.5,
          }}
        >
          <DarkModeIcon sx={{ color: "#9ca0a1" }} />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 500, color: "#555" }}
            >
              Aucun arrêt programmé
            </Typography>

            <Typography variant="body2" sx={{ color: "#888" }}>
              L’écran reste actif en continu
            </Typography>
          </Box>
        </Box>
      )}
    </Collapse>
  );
}
