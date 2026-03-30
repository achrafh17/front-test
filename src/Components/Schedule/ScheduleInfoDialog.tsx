import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { ISchedule } from "./Main";
import { IDevice } from "../../types/api.types";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import { Box, Chip } from "@mui/material";

interface Props {
  open: boolean;
  schedule: ISchedule | null;
  devices?: IDevice[];
  onClose: () => void;
}

const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={250} />;
});
export default function ScheduleInfoDialog({
  open,
  schedule,
  devices = [],
  onClose,
}: Props) {
  if (!schedule) return null;
  // @ts-ignore
  let devicesName = schedule.devices?.map((d) => d.device.name) || [];

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

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Dates
            </Typography>
            <Typography variant="body2">
              {schedule.startDate && schedule.endDate
                ? `${new Date(
                    schedule.startDate,
                  ).toLocaleString()} — ${new Date(
                    schedule.endDate,
                  ).toLocaleString()}`
                : "Non définies"}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="caption" color="text.secondary">
              Appareils
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {devicesName.length > 0 ? (
                devicesName.map((name, index) => (
                  <Chip
                    key={index}
                    label={name.toUpperCase()}
                    size="small"
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun appareil
                </Typography>
              )}
            </Box>
          </Stack>

          {schedule.repeatType === "daily" && (
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Répétition
              </Typography>
              <Typography variant="body2">Quotidienne</Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
