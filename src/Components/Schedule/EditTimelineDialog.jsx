import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RepeatIcon from "@mui/icons-material/Repeat";
import { DatePicker, TimeInput } from "@mantine/dates";
import { Text } from "@mantine/core";
import FormFeedback from "./FormFeedback";
import { LabelWithIcon } from "./schedule.utilis";
import ScheduleReviewDialog from "./ScheduleReviewDialog";

/* ===================================================== */
export default function EditTimelineDialog({
  open,
  onClose,
  onSubmit,
  mode,
  onValidate,
  scheduleData,
  setScheduleData,
  step,
  setStep,
  validationFeedBack,
  feedBackFinal,
  setValidationFeedBack,
  isSubmitting,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  useEffect(() => {
    if (mode === "edit") return;
    setScheduleData((prev) => {
      if (prev.startDate && prev.startTime) return prev;

      const s = new Date();
      s.setHours(8, 0, 0, 0);

      const e = new Date();
      e.setHours(18, 0, 0, 0);

      return {
        ...prev,
        startDate: new Date(),
        endDate: new Date(),
        startTime: s,
        endTime: e,
      };
    });
  }, [mode]);
  const updateField = (field, value) => {
    setScheduleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 3,
            pt: 2,
          }}
        >
          <DialogTitle sx={{ p: 0 }}>ÉTABLIR LE CALENDRIER</DialogTitle>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* -----------------ALERT AND VALIDATION------------------------- */}
        <FormFeedback
          error={!validationFeedBack.success ? validationFeedBack : {}}
          validation={""}
          onClose={() => setValidationFeedBack({})}
        />
        <DialogContent sx={{ px: 3, overflow: "visible" }}>
          <FormControl fullWidth size="small">
            <FormLabel sx={{ mb: 1 }}>
              <LabelWithIcon icon={RepeatIcon} text="Répétition" />
            </FormLabel>

            <Select
              value={scheduleData.repeatType}
              onChange={(e) => updateField("repeatType", e.target.value)}
            >
              <MenuItem value="none">Aucune</MenuItem>
              <MenuItem value="daily">Quotidienne</MenuItem>
            </Select>
          </FormControl>

          {scheduleData.repeatType === "daily" && (
            <Text mt={2}>📌 Tous les jours</Text>
          )}

          <Text size="xs" color="dimmed" mt={1}>
            <span style={{ color: "red" }}>*</span> Obligatoire
          </Text>

          <Divider sx={{ my: 3 }} />

          {scheduleData.repeatType === "none" && (
            <Grid container spacing={2}>
              {/* START DATE */}
              <Grid item xs={8}>
                <DatePicker
                  label={
                    <LabelWithIcon
                      icon={CalendarMonthIcon}
                      text="Date Début"
                      required
                    />
                  }
                  value={scheduleData.startDate}
                  minDate={today}
                  onChange={(value) => {
                    updateField("startDate", value);
                    updateField("endDate", value);
                  }}
                  dropdownType="popover"
                  withinPortal={false}
                  popoverProps={{
                    middlewares: { flip: true, shift: true },
                    position: "bottom-start",
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TimeInput
                  label={
                    <LabelWithIcon
                      icon={AccessTimeIcon}
                      text="Heure début"
                      required
                    />
                  }
                  value={scheduleData.startTime}
                  onChange={(value) => {
                    updateField(
                      "startTime",
                      value instanceof Date
                        ? value
                        : new Date(`1970-01-01T${value}`),
                    );
                  }}
                  withSeconds
                  size="sm"
                />
              </Grid>

              {/* END DATE */}

              <>
                <Grid item xs={8}>
                  <DatePicker
                    label={
                      <LabelWithIcon
                        icon={CalendarMonthIcon}
                        text="Date fin"
                        required
                      />
                    }
                    value={scheduleData.endDate}
                    minDate={scheduleData.startDate}
                    onChange={(value) => {
                      updateField("endDate", value);
                    }}
                    size="sm"
                    dropdownType="popover"
                    withinPortal={false}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TimeInput
                    label={
                      <LabelWithIcon
                        icon={AccessTimeIcon}
                        text="Heure fin"
                        required
                      />
                    }
                    value={scheduleData.endTime}
                    onChange={(value) => {
                      updateField(
                        "endTime",
                        value instanceof Date
                          ? value
                          : new Date(`1970-01-01T${value}`),
                      );
                    }}
                    withSeconds
                    size="sm"
                  />
                </Grid>
              </>
            </Grid>
          )}

          {scheduleData.repeatType === "daily" && (
            <Grid container spacing={2}>
              {/* START TIME */}
              <Grid item xs={6}>
                <TimeInput
                  label={
                    <LabelWithIcon
                      icon={AccessTimeIcon}
                      text="Heure début"
                      required
                    />
                  }
                  value={scheduleData.startTime}
                  onChange={(value) => {
                    updateField("startTime", value);
                  }}
                  withSeconds
                  size="sm"
                  fullWidth
                />
              </Grid>

              {/* END TIME */}
              <Grid item xs={6}>
                <TimeInput
                  label={
                    <LabelWithIcon
                      icon={AccessTimeIcon}
                      text="Heure fin"
                      required
                    />
                  }
                  value={scheduleData.endTime}
                  onChange={(value) => {
                    updateField("endTime", value);
                  }}
                  withSeconds
                  size="sm"
                  fullWidth
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" onClick={() => setStep(1)}>
            RETOUR
          </Button>
          <Button variant="contained" onClick={onValidate}>
            VALIDER
          </Button>
        </DialogActions>
      </Dialog>
      <ScheduleReviewDialog
        open={step === 3}
        onSubmit={onSubmit}
        step={step}
        setStep={setStep}
        scheduleData={scheduleData}
        feedBackFinal={feedBackFinal}
        validationFeedBack={validationFeedBack}
        isSubmitting={isSubmitting}
        mode={mode}
      />
    </>
  );
}
