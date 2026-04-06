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
import { forwardRef, useState } from "react";
import { Box, Chip } from "@mui/material";
import TvIcon from "@mui/icons-material/Tv";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";

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
  let devicesList = schedule.devices?.map((d) => d.device) || [];

  const [showChildrens, setshowChildrens] = useState<Record<number, boolean>>(
    {},
  );
  const showChildrensToggle = (id: number) => {
    setshowChildrens((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

            <Grid container spacing={1} alignItems="flex-start">
              {devicesList.length > 0 ? (
                devicesList.map((d) => {
                  const isOpen = !!showChildrens[d.deviceId];

                  return (
                    <Grid item xs={12} sm={6} key={d.deviceId}>
                      <Box
                        sx={{
                          px: 1.5,
                          py: 1,
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: d.isGroup ? "#e1bee7" : "#bbdefb",
                          backgroundColor: d.isGroup ? "#f6f0ff" : "#f3f8ff",

                          alignSelf: "flex-start",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          onClick={() =>
                            d.isGroup && showChildrensToggle(d.deviceId)
                          }
                          sx={{
                            cursor: d.isGroup ? "pointer" : "default",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <TvIcon
                              sx={{
                                fontSize: 18,
                                color: d.isGroup ? "#7b1fa2" : "#1976d2",
                              }}
                            />

                            <Box>
                              <Typography fontSize={13} fontWeight={600} noWrap>
                                {d.name}
                              </Typography>

                              <Typography fontSize={11} color="text.secondary">
                                {d.isGroup
                                  ? `Groupe • ${d.children?.length || 0}`
                                  : "Écran individuel"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* ICON */}
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

                        {/* CHILDREN GRID */}
                        {d.isGroup && (
                          <Collapse in={isOpen} timeout={250} unmountOnExit>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              {d.children?.map((child: any) => (
                                <Grid item xs={12} sm={6} key={child.deviceId}>
                                  {" "}
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                      px: 1,
                                      py: 0.7,
                                      borderRadius: 1.5,
                                      backgroundColor: "#f3f8ff",
                                      border: "1px solid #e0e0e0",
                                    }}
                                  >
                                    <TvIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "#1976d2",
                                      }}
                                    />

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
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Aucun appareil
                </Typography>
              )}
            </Grid>
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
