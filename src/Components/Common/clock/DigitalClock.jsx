import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

export default function DigitalClock({
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
      t = setInterval(()=>{
        setTime(dayjs())
      }, 1000)
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
    <Box sx={{ maxWidth: "45%", flex: 1 }}>
      {showLocation && (
        <Typography
          sx={{
            color: theme === "light" ? "#222" : "white",
            fontSize: infoFontSize,
          }}
        >
          {timezone === "Localisation de l'écran"
            ? "Screen Location"
            : timezone.split("/")[1].replace(/_/g, " ")}
        </Typography>
      )}
      <Box
        sx={{
          backgroundColor:
            theme === "light"
              ? "rgba(0, 0, 0, 0.06)"
              : "rgba(255, 255, 255, 0.06)",
          px: 2,
          py: 1,
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: theme === "light" ? "#222" : "white",
            fontSize: timeFontSize,
            textAlign: "center",
          }}
        >
          {clockFormat === "12" ? time.format("hh:mm") : time.format("HH:mm")}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: theme === "light" ? "#222" : "white",
            fontSize: infoFontSize,
            opacity: showDate ? 1 : 0,
          }}
        >
          {time.format("ddd, DD MMMM")}
        </Typography>
        {clockFormat === "12" && (
          <Typography
            sx={{
              color: theme === "light" ? "#222" : "white",
              fontSize: infoFontSize,
              textAlign: "right",
            }}
          >
            {time.format("A")}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
