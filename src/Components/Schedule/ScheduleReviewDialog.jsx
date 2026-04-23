import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Collapse,
} from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { mergeDateAndTime } from "./schedule.utilis";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import CircularProgress from "@mui/material/CircularProgress";

export default function ScheduleReviewDialog({
  open,
  onClose,
  onSubmit,
  scheduleData,
  step,
  setStep,
  submissionFeedback,
  validationFeedBack,
  isSubmitting,
  mode,
}) {
  const duration = useMemo(() => {
    const start = mergeDateAndTime(
      scheduleData.startDate,
      scheduleData.startTime,
      scheduleData.repeatType,
    );
    const end = mergeDateAndTime(
      scheduleData.endDate,
      scheduleData.endTime,
      scheduleData.repeatType,
    );
    if (!start || !end) return 0;

    return Math.max(0, Math.floor((end - start) / 60000));
  }, [
    scheduleData.startDate,
    scheduleData.endDate,
    scheduleData.startTime,
    scheduleData.endTime,
    scheduleData.repeatType,
  ]);

  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "--");

  const [showChildrens, setShowChildrens] = useState({});
  const toggleChildren = (id) => {
    setShowChildrens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const isWarning = validationFeedBack?.type === "WARNING";
  const isError = submissionFeedback?.type === "ERROR";
  const isValid = submissionFeedback?.type === "SUCCESS";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ p: 4 }}>
        {/* ===== HEADER ===== */}
        <Box
          sx={{
            mt: 1,
            mb: 3,
            p: 2,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: isWarning ? "#fff4e5 " : "#f1f8f4",
            border: isWarning ? "1px solid #ffb74d" : " 1px solid #81c784",
          }}
        >
          <Box>
            <Typography fontWeight={600}>
              {isWarning
                ? "Vérification recommandée"
                : " Schedule prêt à être activé"}
            </Typography>
            {isWarning && (
              <Typography
                fontSize={12}
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  lineHeight: 1.4,
                  opacity: 0.9,
                }}
              >
                {validationFeedBack?.message}
              </Typography>
            )}
            <Typography fontSize={12} color="text.secondary">
              Vérifiez les informations avant{" "}
              {mode === "create" ? "confirmation" : "modification"}
            </Typography>
          </Box>

          <Chip
            label={scheduleData.repeatType === "daily" ? "Quotidien" : "Normal"}
            size="small"
            sx={{
              backgroundColor:
                scheduleData.repeatType === "daily" ? "#e8f5e9" : "#e3f2fd",
              color:
                scheduleData.repeatType === "daily" ? "#2e7d32" : "#1976d2",
            }}
          />
        </Box>

        {/* ===== SCHEDULE ===== */}
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
            background: "#ffffff",
            border: "1px solid #eef2f7",
          }}
        >
          <Typography fontSize={12} color="text.secondary">
            SCHEDULE
          </Typography>

          <Typography fontWeight={600} mt={1}>
            {scheduleData.title || "Sans titre"}{" "}
          </Typography>
        </Paper>

        {/* ===== TIMELINE ===== */}
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
            background: "linear-gradient(180deg, #f8fbff, #ffffff)",
            border: "1px solid #e3f2fd",
          }}
        >
          <Typography fontSize={12} color="text.secondary" mb={2}>
            TIMELINE
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography fontSize={11} color="text.secondary">
                DÉBUT
              </Typography>
              <Typography fontWeight={600}>
                {formatTime(scheduleData.startTime)}
              </Typography>
              {scheduleData.repeatType === "none" && (
                <Typography fontSize={11} color="text.secondary">
                  {formatDate(scheduleData.startDate)}
                </Typography>
              )}
            </Box>

            <Box flex={1}>
              <Box
                sx={{
                  height: 4,
                  borderRadius: 2,
                  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translate(50%, -50%)",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: "#1976d2",
                  }}
                />
              </Box>

              <Box textAlign="center" mt={1}>
                <Typography fontSize={12} color="text.secondary">
                  Durée
                </Typography>
                <Typography fontWeight={600}>{duration} min</Typography>
              </Box>

              {scheduleData.repeatType === "daily" && (
                <Typography
                  fontSize={12}
                  color="text.secondary"
                  textAlign="center"
                  mt={1}
                >
                  Tous les jours sur ce créneau
                </Typography>
              )}
            </Box>

            <Box textAlign="right">
              <Typography fontSize={11} color="text.secondary">
                FIN
              </Typography>
              <Typography fontWeight={600}>
                {formatTime(scheduleData.endTime)}
              </Typography>
              {scheduleData.repeatType === "none" && (
                <Typography fontSize={11} color="text.secondary">
                  {formatDate(scheduleData.endDate)}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* ===== PLAYLIST ===== */}
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
            border: "1px solid #eef2f7",
          }}
        >
          <Typography fontSize={12} color="text.secondary" mb={1}>
            PLAYLIST
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <PlaylistPlayIcon />
              <Typography fontWeight={600}>
                {scheduleData.playlist?.name}
              </Typography>
            </Box>

            <Chip
              label={`${scheduleData.playlist?.contents?.length || 0} contenus`}
              size="small"
            />
            {isWarning && (
              <Box
                sx={{
                  p: 0.7,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: "rgba(237,108,2,0.08)",
                  border: "1px solid",
                  borderColor: "rgba(237,108,2,0.3)",
                }}
              >
                {validationFeedBack?.code === "PLAYLIST_LOOP" ? (
                  <AutorenewIcon sx={{ fontSize: 16, color: "#ed6c02" }} />
                ) : (
                  <ContentCutIcon sx={{ fontSize: 16, color: "#ed6c02" }} />
                )}

                <Typography fontSize={12} sx={{ fontWeight: 500 }}>
                  {validationFeedBack?.code === "PLAYLIST_LOOP"
                    ? "Lecture en boucle"
                    : "Contenu tronqué"}
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              mt: 1,
              p: 1,
              borderRadius: 2,
              background: "#f8fafc",
              fontSize: 12,
            }}
          >
            {Math.floor((scheduleData.playlist?.totalDuration || 0) / 60)} min
            réparties sur {scheduleData.playlist?.contents?.length} contenus
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" flexWrap="wrap" gap={1}>
            {scheduleData.playlist?.contents?.slice(0, 6).map((item, i) => (
              <Chip key={i} label={item.title} size="small" />
            ))}

            {scheduleData.playlist?.contents?.length > 6 && (
              <Chip
                label={`+${scheduleData.playlist.contents.length - 6}`}
                size="small"
              />
            )}
          </Box>
        </Paper>

        {/* ===== DEVICES ===== */}
        <Paper
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
            border: "1px solid #eef2f7",
          }}
        >
          <Typography fontSize={12} color="text.secondary" mb={1}>
            ÉCRANS ({scheduleData.devices.length})
          </Typography>

          <Grid container spacing={1}>
            {scheduleData.devices.map((d) => {
              const isOpen = !!showChildrens[d.deviceId];

              return (
                <Grid item xs={12} sm={6} key={d.deviceId}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: d.isGroup ? "#e1bee7" : "#bbdefb",
                      backgroundColor: d.isGroup ? "#f6f0ff" : "#f3f8ff",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => d.isGroup && toggleChildren(d.deviceId)}
                      sx={{ cursor: d.isGroup ? "pointer" : "default" }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <TvIcon
                          sx={{
                            fontSize: 18,
                            color: d.isGroup ? "#7b1fa2" : "#1976d2",
                          }}
                        />

                        <Box>
                          <Typography fontSize={13} fontWeight={600}>
                            {d.name}
                          </Typography>

                          <Typography fontSize={11} color="text.secondary">
                            {d.isGroup
                              ? `Groupe • ${d.children?.length || 0}`
                              : "Écran individuel"}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={d.isGroup ? "Groupe" : "Individuel"}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          backgroundColor: d.isGroup ? "#ede7f6" : "#e3f2fd",
                        }}
                      />

                      {d.isGroup && (
                        <ExpandMoreIcon
                          sx={{
                            transform: isOpen
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "0.2s",
                          }}
                        />
                      )}
                    </Box>

                    {d.isGroup && (
                      <Collapse in={isOpen}>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {d.children?.map((child) => (
                            <Grid item xs={12} sm={6} key={child.deviceId}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  px: 1,
                                  py: 0.7,
                                  borderRadius: 1.5,
                                  backgroundColor: "#f3f8ff",
                                }}
                              >
                                <TvIcon sx={{ fontSize: 14 }} />
                                <Typography fontSize={12} noWrap>
                                  {child.name}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Collapse>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => {
            setStep("timeline");
          }}
        >
          Retour
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={18} />
          ) : mode === "create" ? (
            "Confirmer"
          ) : (
            "Modifier"
          )}{" "}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
