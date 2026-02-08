import {
  Alert,
  AlertTitle,
  Box,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker, TimeInput } from "@mantine/dates";
const LabelWithIcon = ({ icon: Icon, text, required }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Icon fontSize="small" sx={{ color: "text.secondary" }} />
    <span>
      {text} {required && <span style={{ color: "red" }}>*</span>}
    </span>
  </Box>
);
export default function ScreenOff({ open, onClose }) {
  const [startDate, setstartDate] = useState("");
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {
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
      }

      <Collapse in={Boolean(validation)} timeout={300}>
        <Box sx={{ px: 2, mt: 1 }}>
          <Alert severity="success">
            <AlertTitle>Succès</AlertTitle>
            {validation}
          </Alert>
        </Box>
      </Collapse>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", px: 3, pt: 2 }}
      >
        <DialogTitle sx={{ p: 0 }}>ÉTABLIR LE CALENDRIER</DialogTitle>
        <CloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
      </Box>

      <DialogContent sx={{ px: 3 }}>
        <Grid container spacing={2}>
          {/* START DATE */}
          <Grid item xs={8}>
            <DatePicker
              label={
                <LabelWithIcon
                  icon={CalendarMonthIcon}
                  text="Date début"
                  required
                />
              }
              value={startDate}
              minDate={today}
              onChange={setStartDate}
              size="sm"
              withinPortal={false}
            />
          </Grid>

          <Grid item xs={4}>
            <TimeInput
              label={
                <LabelWithIcon icon={AccessTimeIcon} text="Heure" required />
              }
              value={startTime}
              onChange={setStartTime}
              withSeconds
              size="sm"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose}>
          ANNULER
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          ENREGISTRER
        </Button>
      </DialogActions>
    </Dialog>
  );
}
