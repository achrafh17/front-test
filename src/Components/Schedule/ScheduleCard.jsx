import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ScheduleCard({
  schedule,
  type,
  onInfo,
  onDelete,
  onEdit,
}) {
  const isDaily = type === "daily";
  const isPassed = type === "passed";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #f0f0f0",
        backgroundColor: "#ffffff",
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              color: isPassed ? "text.secondary" : "text.primary",
            }}
          >
            {schedule.title}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" onClick={() => onInfo(schedule)}>
              <InfoIcon fontSize="small" />
            </IconButton>

            <IconButton size="small" onClick={() => onEdit(schedule)}>
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(schedule)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {isDaily
              ? schedule.startDate && schedule.endDate
                ? `${new Date(schedule.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} — ${new Date(schedule.endDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Heure non définie"
              : schedule.startDate && schedule.endDate
                ? `${new Date(schedule.startDate).toLocaleString()} — ${new Date(schedule.endDate).toLocaleString()}`
                : "Heure non définie"}
          </Typography>

          {isDaily && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              • Quotidienne
            </Typography>
          )}

          {isPassed && (
            <Typography
              variant="caption"
              sx={{
                color: "text.disabled",
              }}
            >
              • Terminée
            </Typography>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
