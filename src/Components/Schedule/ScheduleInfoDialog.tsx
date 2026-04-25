import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { ISchedule } from "../../types/api.types";
import { IDevice } from "../../types/api.types";
import Slide from "@mui/material/Slide";
import { forwardRef, useMemo, useState } from "react";
import { Box, Chip, Paper } from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import {
  formatDate,
  formatTime,
  mergeDateAndTime,
  toMinute,
} from "./schedule.utilis";

interface Props {
  open: boolean;
  schedule: ISchedule | null;
  devices?: IDevice[];
  onClose: () => void;
}

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={250} />;
});
export default function ScheduleInfoDialog({ open, schedule, onClose }: Props) {
  if (!schedule) return null;
  const devicesList = schedule.devices?.map((d) => d.device);
  const contents =
    schedule.playlist?.contents?.map((content) => content.content) || [];

  const [showChildrens, setshowChildrens] = useState<Record<number, boolean>>(
    {},
  );
  const toggleChildren = (id: number) => {
    setshowChildrens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const { duration, status, isDailyActive } = useMemo(() => {
    const now = new Date();
    const start = new Date(schedule.startDate);
    const end = new Date(schedule.endDate);
    const nowMin = toMinute(now);
    const startMin = toMinute(new Date(schedule.startDate));
    const endMin = toMinute(new Date(schedule.endDate));

    const isDailyActive =
      schedule.repeatType === "daily" && nowMin >= startMin && nowMin <= endMin;

    let status: "active" | "expired" | "upcoming" = "upcoming";

    if (now >= start && now <= end) status = "active";
    else if (now > end) status = "expired";

    if (!start || !end) return { duration: 0, status, isDailyActive };
    return {
      duration: Math.max(
        0,
        Math.floor((end.getTime() - start.getTime()) / 60000),
      ),
      status,
      isDailyActive,
    };
  }, [schedule.startDate, schedule.endDate, schedule.repeatType]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 500 }}>{schedule.title}</DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 4 }}>
        <Box
          sx={{
            mt: 1,
            mb: 3,
            p: 2,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background:
              schedule.repeatType === "daily"
                ? "#f1f8f4"
                : status === "active" || status === "upcoming"
                  ? "#f1f8f4"
                  : "#fff5f5",
            border:
              schedule.repeatType === "daily"
                ? "1px solid #81c784"
                : status === "active" || status === "upcoming"
                  ? "1px solid #81c784"
                  : "1px solid #ef9a9a",
          }}
        >
          {/* LEFT */}
          <Box>
            <Typography fontWeight={600}>Détails du schedule</Typography>

            <Typography fontSize={12} color="text.secondary">
              {schedule.repeatType === "daily" ? (
                isDailyActive ? (
                  "En cours de diffusion"
                ) : (
                  `Prochaine diffusion à ${formatTime(schedule.startDate)}`
                )
              ) : (
                <>
                  {status === "active" && "En cours d’exécution"}
                  {status === "expired" &&
                    "Terminé • Modifier les dates pour relancer"}
                  {status === "upcoming" && "Planifié (pas encore lancé)"}
                </>
              )}
            </Typography>
          </Box>

          {/* RIGHT */}
          <Stack direction="row" spacing={1}>
            {/* STATUS */}
            {schedule.repeatType !== "daily" && (
              <Chip
                label={
                  status === "active"
                    ? "Actif"
                    : status === "expired"
                      ? "Expiré"
                      : "À venir"
                }
                size="small"
                sx={{
                  backgroundColor:
                    status === "active" || status === "upcoming"
                      ? "#e8f5e9"
                      : "#ffebee",

                  color:
                    status === "active" || status === "upcoming"
                      ? "#2e7d32"
                      : "#c62828",
                  fontWeight: 500,
                }}
              />
            )}

            <Chip
              label={
                schedule.repeatType === "daily"
                  ? "Répétition : Quotidienne"
                  : "Répétition : Aucune"
              }
              size="small"
              sx={{
                backgroundColor:
                  schedule.repeatType === "daily" ? "#e3f2fd" : "#f5f5f5",
                color: schedule.repeatType === "daily" ? "#1976d2" : "#616161",
                fontWeight: 500,
              }}
            />
          </Stack>
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
            {schedule.title || "Sans titre"}{" "}
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
                {formatTime(schedule.startDate)}
              </Typography>
              {schedule.repeatType === "none" && (
                <Typography fontSize={11} color="text.secondary">
                  {formatDate(schedule.startDate)}
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

              {schedule.repeatType === "daily" && (
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
                {formatTime(schedule.endDate)}
              </Typography>
              {schedule.repeatType === "none" && (
                <Typography fontSize={11} color="text.secondary">
                  {formatDate(schedule.endDate)}
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
                {schedule.playlist?.name}
              </Typography>
            </Box>

            <Chip label={`${contents?.length || 0} contenus`} size="small" />
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
            {Math.floor((schedule.playlist?.totalDuration || 0) / 60)} min
            réparties sur {contents?.length} contenus
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box display="flex" flexWrap="wrap" gap={1}>
            {contents?.slice(0, 6).map((item, i) => (
              <Chip key={i} label={item.title} size="small" />
            ))}

            {contents?.length > 6 && (
              <Chip
                label={`+${schedule.playlist.contents.length - 6}`}
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
            ÉCRANS ({schedule.devices.length})
          </Typography>

          <Grid container spacing={1}>
            {devicesList.map((d) => {
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
                          {d.children?.map((child: IDevice) => (
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

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
