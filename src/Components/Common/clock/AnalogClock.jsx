import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import AnalogClockComponent from "./AnalogClockComponent";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

export default function AnalogClock({
  theme,
  timeFontSize,
  infoFontSize,
  timezone,
  showDate,
  showLocation,
  clockFormat,
}) {
  const [time, setTime] = useState(dayjs("10:12", "HH:mm"));

  useEffect(() => {
    var t = null;
    if (timezone === "Localisation de l'écran") {
      t = setInterval(() => {
        setTime(dayjs());
      }, 1000);
    } else {
      setTime(dayjs().tz(timezone));
      t = setInterval(() => {
        setTime(dayjs().tz(timezone));
      }, 1000);
    }

    return () => {
      clearInterval(t);
    };
  }, [timezone]);

  return (
    <Box
      sx={{
        height: "80%",
        maxWidth: "45%",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {showLocation && (
        <Typography
          sx={{
            color: theme === "light" ? "#222" : "white",
            fontSize: infoFontSize,
            textAlign: "center",
          }}
        >
          {timezone === "Localisation de l'écran"
            ? "Screen Location"
            : timezone.split("/")[1].replace(/_/g, " ")}
        </Typography>
      )}
      <AnalogClockComponent
        theme={theme}
        clockDialStyle={{ width: "80%", height: "auto" }}
        hour={time.hour()}
        minute={time.minute()}
        second={time.second()}
      />
      <Typography
        sx={{
          color: theme === "light" ? "#222" : "white",
          fontSize: infoFontSize,
          textAlign: "center",
          mt: 0.5,
        }}
      >
        {clockFormat === "12" ? time.format("hh:mm A") : time.format("HH:mm")}
      </Typography>
      {showDate && (
        <Typography
          sx={{
            color: theme === "light" ? "#222" : "white",
            fontSize: infoFontSize,
            textAlign: "center",
          }}
        >
          {time.format("ddd, DD MMMM")}
        </Typography>
      )}
    </Box>
  );
}
