import { Box, Typography } from "@mui/material";
import { ISchedule } from "../../Schedule/Main";
import React from "react";

type ScheduleType = "actual" | "next" | "other" | "daily";
interface props {
  s: ISchedule;
  color: string;
  scheduleType: ScheduleType;
}
interface ShowMoreLessProps {
  end: number;
  total: number;
  setEnd: React.Dispatch<React.SetStateAction<number>>;
  step?: number;
}
const time = (date: string) => {
  return date
    ? new Date(date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
};

const fullDate = (date: string) => {
  return date
    ? new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
};
function ScheduleCard({ s, color, scheduleType }: props) {
  return (
    <Box
      sx={{
        pb: 1,
        borderBottom: scheduleType === "other" ? "1px solid #d8d8dbff" : "",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          color: color,
          mt: 2,
          fontSize: 12,
        }}
      >
        {s.title}
      </Typography>
      {s.repeatType === "daily" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              color: "#374151",
            }}
          >
            {s.startDate && time(s.startDate)}
          </Typography>

          <span style={{ opacity: 0.6 }}>→</span>

          <Typography
            sx={{
              fontSize: 11,
              color: "#374151",
            }}
          >
            {s.endDate && time(s.endDate)}
          </Typography>

          {scheduleType !== "daily" && (
            <Box
              sx={{
                fontSize: 10,
                fontWeight: 600,
                px: 1,
                py: "2px",
                borderRadius: 999,
                backgroundColor: "rgba(4, 120, 87, 0.12)",
                color: color,
                letterSpacing: "0.04em",
              }}
            >
              Quotidienne
            </Box>
          )}
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: 12,
            color: "#374151",
            mt: 0.5,
            display: "flex",
          }}
        >
          <span>{s.startDate && fullDate(s.startDate)}</span>
          <span style={{ margin: "0 8px" }}>→</span>
          <span>{s.endDate && fullDate(s.endDate)}</span>
        </Typography>
      )}
    </Box>
  );
}

export default React.memo(ScheduleCard);
export function ShowMoreLess({
  end,
  total,
  setEnd,
  step = 3,
}: ShowMoreLessProps) {
  if (total < step) return null;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        mt: 1.5,
      }}
    >
      {end > step && (
        <Typography
          onClick={() => setEnd((prev) => Math.max(prev - step, step))}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "#6b7280",
            cursor: "pointer",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#111827",
            },
          }}
        >
          Afficher moins
        </Typography>
      )}{" "}
      {end < total && (
        <Typography
          onClick={() => setEnd((prev) => Math.min(prev + step, total))}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "#4b5563",
            cursor: "pointer",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              color: "#111827",
            },
            "&:after": {
              content: '""',
              position: "absolute",
              width: "0%",
              height: "1px",
              bottom: -2,
              left: 0,
              backgroundColor: "#111827",
              transition: "width 0.2s ease",
            },
            "&:hover:after": {
              width: "100%",
            },
          }}
        >
          Afficher plus
        </Typography>
      )}
    </Box>
  );
}
