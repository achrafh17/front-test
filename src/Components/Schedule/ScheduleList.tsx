import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { ISchedule } from "./Main";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { Divider } from "@mui/material";
import { IDevice } from "../../types/api.types";

// Props du composant
interface Props {
  isLoading: boolean;
  sliderValue: number;
  schedules: ISchedule[];
  searchTerm: string;
  onEdit: (schedule: ISchedule) => void;
  onDelete: (scheduleId: number) => void;
  devices?: IDevice[];
}

const ScheduleList: React.FC<Props> = ({
  isLoading,
  schedules,
  sliderValue,
  searchTerm,
  onEdit,
  onDelete,
  devices = [],
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(
    null,
  );
  const [showInfoSchedule, setShowInfoSchedule] = useState<ISchedule | null>(
    null,
  );
  const [deviceName, setDeviceName] = useState("");
  const now = new Date();
  const filteredSchedules = schedules.filter(
    (s) =>
      (s.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) &&
      s.endDate &&
      new Date(s.endDate) >= now,
  );
  const passedSchedules = schedules.filter(
    (s: ISchedule) => s.endDate && new Date(s.endDate) < now,
  );

  const handleDeleteClick = (schedule: ISchedule) => {
    setSelectedSchedule(schedule);
    setShowConfirmDelete(true);
  };

  const handleInfoClick = (schedule: ISchedule) => {
    setShowInfoSchedule(schedule);
    const dev = devices.find((d: IDevice) => d.deviceId === schedule.deviceId);
    setDeviceName(dev?.name ?? "");
  };

  useEffect(() => {
    if (!showInfoSchedule) return;
    const timer = setTimeout(() => {
      setShowInfoSchedule(null);
      setDeviceName("");
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, [showInfoSchedule]);

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <Grid item key={n} sx={{ width: "100%" }}>
              <Skeleton variant="rectangular" height={50} />
            </Grid>
          ))
        ) : filteredSchedules.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                minHeight: "40vh", // centre verticalement
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "text.secondary",
              }}
            >
              <EventBusyIcon sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="h6">Aucune planification prévue</Typography>
              <Typography variant="body2">
                Vous n'avez pas encore de planifications
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredSchedules.map((schedule) => (
            <Grid item key={schedule.scheduleId} sx={{ width: "100%" }}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #eee",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{schedule.title}</Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleInfoClick(schedule)}
                    title="Plus d'infos"
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(schedule)}
                    title="Modifier"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(schedule)}
                    title="Supprimer"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>
      {/*--------------------------------palinifications passees---------------------------*/}

      {passedSchedules.length !== 0 && searchTerm === "" && (
        <>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Divider>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  letterSpacing: 0.5,
                }}
              >
                PLANIFICATIONS PASSÉES
              </Typography>
            </Divider>
          </Box>

          <Grid container spacing={2}>
            {/* Map ici tes schedules passés */}
            <Grid item sx={{ width: "100%" }}>
              {passedSchedules.map((s: ISchedule) => (
                <Box
                  key={s.scheduleId}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px dashed #d1d5db",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#6b7280",
                        fontWeight: 500,
                      }}
                    >
                      {s.title}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        fontSize: 11,
                        borderRadius: 1,
                        backgroundColor: "#e5e7eb",
                        color: "#374151",
                        fontWeight: 500,
                      }}
                    >
                      Planification terminée{" "}
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => handleInfoClick(s)}
                      title="Plus d'infos"
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => onEdit(s)}
                      title="Modifier"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteClick(s)}
                      title="Supprimer"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        </>
      )}
      {/* Dialogue confirmation suppression */}
      <ConfirmDeleteDialog
        open={showConfirmDelete && !!selectedSchedule}
        title={selectedSchedule?.title}
        onClose={() => {
          setShowConfirmDelete(false);
          setSelectedSchedule(null);
        }}
        onConfirm={() => {
          if (selectedSchedule) onDelete(selectedSchedule.scheduleId);
          setShowConfirmDelete(false);
          setSelectedSchedule(null);
        }}
      />

      {/* Dialogue infos schedule */}
      {showInfoSchedule && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
            zIndex: 1300,
          }}
        >
          <Typography variant="h6">{showInfoSchedule.title}</Typography>
          <Typography>
            <strong>Dates:</strong>{" "}
            {showInfoSchedule.startDate && showInfoSchedule.endDate
              ? `${new Date(
                  showInfoSchedule.startDate,
                ).toLocaleString()} → ${new Date(
                  showInfoSchedule.endDate,
                ).toLocaleString()}`
              : "-"}
          </Typography>
          <Typography>
            <strong>Écrans:</strong>{" "}
            {devices?.find(
              (d: IDevice) => d.deviceId === showInfoSchedule.deviceId,
            )?.name ?? "— Aucun appareil —"}
          </Typography>
          <Button
            sx={{ mt: 2 }}
            onClick={() => {
              setShowInfoSchedule(null);
              setDeviceName("");
            }}
          >
            Fermer
          </Button>
        </Box>
      )}
    </>
  );
};

export default ScheduleList;
