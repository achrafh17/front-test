import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { ISchedule } from "./Main";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

// Props du composant
interface Props {
  isLoading: boolean;
  sliderValue: number;
  schedules: ISchedule[];
  searchTerm: string;
  onEdit: (schedule: ISchedule) => void;
  onDelete: (scheduleId: number) => void;
}

const ScheduleList: React.FC<Props> = ({
  isLoading,
  schedules,
  sliderValue,
  searchTerm,
  onEdit,
  onDelete,
}) => {

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(null);
  const [showInfoSchedule, setShowInfoSchedule] = useState<ISchedule | null>(null);

  const filteredSchedules = schedules.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (schedule: ISchedule) => {
    setSelectedSchedule(schedule);
    setShowConfirmDelete(true);
  };

  const handleInfoClick = (schedule: ISchedule) => {
    setShowInfoSchedule(schedule);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {isLoading ? (
          [1, 2, 3].map(n => (
            <Grid item key={n} sx={{ width: "100%" }}>
              <Skeleton variant="rectangular" height={50} />
            </Grid>
          ))
        ) : (
          filteredSchedules.map(schedule => (
            <Grid item key={schedule.scheduleId} sx={{ width: "100%" }}>
              <Box sx={{
                p: 2,
                backgroundColor: "#fff",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee"
              }}>
                <Box>
                  <Typography variant="subtitle1">{schedule.title}</Typography>
        
                </Box>
                <Box>
                  <IconButton size="small" onClick={() => handleInfoClick(schedule)} title="Plus d'infos">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => onEdit(schedule)} title="Modifier">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteClick(schedule)} title="Supprimer">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialogue confirmation suppression */}
      <ConfirmDeleteDialog
        open={showConfirmDelete && !!selectedSchedule}
        title={selectedSchedule?.title}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={() => {
          if (selectedSchedule) onDelete(selectedSchedule.scheduleId);
          setShowConfirmDelete(false);
        }}
      />

      {/* Dialogue infos schedule */}
      {showInfoSchedule && (
        <Box sx={{
          position: "fixed",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          p: 3, borderRadius: 2, boxShadow: 3, zIndex: 1300
        }}>
          <Typography variant="h6">{showInfoSchedule.title}</Typography>
          <Typography>
            <strong>Dates:</strong>{" "}
            {showInfoSchedule.startDate && showInfoSchedule.endDate
              ? `${new Date(showInfoSchedule.startDate).toLocaleString()} → ${new Date(showInfoSchedule.endDate).toLocaleString()}`
              : "-"}
          </Typography>
          <Typography>
            <strong>Devices:</strong> {showInfoSchedule.screens?.join(", ") || "-"}
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => setShowInfoSchedule(null)}>Fermer</Button>
        </Box>
      )}
    </>
  );
};

export default ScheduleList;
