import { Box } from "@mui/material";

export function LabelWithIcon({ icon: Icon, text, required }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Icon fontSize="small" sx={{ color: "text.secondary" }} />
      <span>
        {text} {required && <span style={{ color: "red" }}>*</span>}
      </span>
    </Box>
  );
}

export function mergeDateAndTime(date, time, repeatType) {
  if (!date || !time) return null;
  if (!(date instanceof Date) || !(time instanceof Date)) return null;

  const baseDate = new Date(date); 

  baseDate.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0);

  return baseDate;
}
export const validateScheduleInput = ({
  startDate,
  endDate,
  startTime,
  endTime,
  devices,
  repeatType,
}) => {
  const now = new Date();

  if (!devices || devices.length === 0) return "Veuillez choisir un écran.";
  if (!startDate) return "Veuillez choisir une date de début.";
  if (!endDate) return "Veuillez sélectionner la date de fin.";
  if (!startTime) return "Veuillez choisir une heure de début.";
  if (!endTime) return "Veuillez sélectionner l heure de fin.";
  const start = mergeDateAndTime(startDate, startTime, repeatType);
  const end = mergeDateAndTime(endDate, endTime, repeatType);
  if (start <= now && repeatType === "none")
    return "La date de début doit être aujourd'hui ou après.";
  if (end <= start) return "La date de fin doit être après la date de début.";
};
