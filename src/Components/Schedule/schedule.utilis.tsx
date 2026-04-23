import { Box } from "@mui/material";
import { IDevice, IPlaylistInfo } from "../../types/api.types";
import { Slide } from "@mui/material";
import { forwardRef } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import { ComponentType } from "react";
type LabelWithIconProps = {
  icon: ComponentType<SvgIconProps>;
  text: string;
  required?: boolean;
};
export function LabelWithIcon({
  icon: Icon,
  text,
  required,
}: LabelWithIconProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Icon fontSize="small" sx={{ color: "text.secondary" }} />
      <span>
        {text} {required && <span style={{ color: "red" }}>*</span>}
      </span>
    </Box>
  );
}

export function mergeDateAndTime(
  date: Date,
  time: Date,
  repeatType: "none" | "daily",
) {
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
  isFromPlaylist,
  title,
}: {
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  devices: IDevice[];
  repeatType: "none" | "daily";
  isFromPlaylist: boolean;
  title: string;
}) => {
  const now = new Date();

  if (!devices || devices.length === 0) return "Veuillez choisir un écran.";
  if (isFromPlaylist && title === "") return "Veuillez saisir un titre";
  if (!startDate) return "Veuillez choisir une date de début.";
  if (!endDate) return "Veuillez sélectionner la date de fin.";
  if (!startTime) return "Veuillez choisir une heure de début.";
  if (!endTime) return "Veuillez sélectionner l heure de fin.";
  const start = mergeDateAndTime(startDate, startTime, repeatType);
  const end = mergeDateAndTime(endDate, endTime, repeatType);
  if (!start || !end) return "Un Erreur est survenue";
  if (start <= now && repeatType === "none")
    return "La date de début doit être aujourd'hui ou après.";
  if (end <= start) return "La date de fin doit être après la date de début.";
};
export const mapPlaylistToSchedule = (playlist: IPlaylistInfo) => {
  return {
    contents: playlist.contents,
    playlistId: playlist.playlistId,
    name: playlist.name,
    totalDuration: playlist.totalDuration,
    numberOfScreens: playlist.numberOfScreens,
    numberOfWidgets: playlist.numberOfWidgets,
    userId: playlist.userId,
  };
};

export const Transition = forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={250} />;
});
