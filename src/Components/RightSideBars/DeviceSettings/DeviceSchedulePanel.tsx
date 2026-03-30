import { Box, Typography } from "@mui/material";
import {
  PlayCircleFilledOutlined,
  EventOutlined,
  CalendarMonthOutlined,
  PauseCircleOutlined,
} from "@mui/icons-material";
import { ISchedule } from "../../Schedule/Main";
import Collapse from "@mui/material/Collapse";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import { useState, useMemo } from "react";
import ScheduleCard, { ShowMoreLess } from "./deviceSchedulePanel.utils";

interface DeviceSchedulePanelProps {
  actualSchedule?: ISchedule;
  nextSchedule?: ISchedule;
  otherSchedules: ISchedule[];
  dailySchedules: ISchedule[];
  open: boolean;
}

export default function DeviceSchedulePanel({
  actualSchedule,
  nextSchedule,
  otherSchedules,
  dailySchedules,
  open,
}: DeviceSchedulePanelProps) {
  const [endOtherSchedules, setEndOtherSchedules] = useState(5);
  const [endDailySchedules, setEndDailySchedules] = useState(5);

  const visibleOtherSchedules = useMemo(() => {
    return otherSchedules.slice(0, endOtherSchedules);
  }, [otherSchedules, endOtherSchedules]);

  const visibleDailySchedules = useMemo(() => {
    return dailySchedules.slice(0, endDailySchedules);
  }, [dailySchedules, endDailySchedules]);

  return (
    <Collapse in={open} timeout={300} unmountOnExit>
      <Box sx={{ mt: 1 }}>
        {/* ------------------------------------------actual schedule-------------------------------------- */}
        {actualSchedule ? (
          <Box
            sx={{
              border: "1px solid #86efac",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              backgroundColor: "#ecfdf5",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PlayCircleFilledOutlined
                sx={{ fontSize: 16, color: "#047857" }}
              />{" "}
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#047857",
                }}
              >
                Actuellement actif
              </Typography>
            </Box>

            <ScheduleCard
              s={actualSchedule}
              color="#047857"
              scheduleType="actual"
            />
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #86efac",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              backgroundColor: "#ecfdf5",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <PauseCircleOutlined
                sx={{
                  fontSize: 16,
                  color: "#047857",
                }}
              />

              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#065f46",
                  lineHeight: 1,
                }}
              >
                Aucune programmation en cours
              </Typography>
            </Box>
          </Box>
        )}

        {/*------------------------------------------- next schedule ------------------------------------------- */}
        {nextSchedule && (
          <Box
            sx={{
              border: "1px solid #d1d5db",
              borderRadius: 2,
              p: 2,
              mb: 1.5,
              backgroundColor: "#eef2f9ff",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.3,
              }}
            >
              <EventOutlined
                sx={{
                  fontSize: 16,
                  color: "#374151",
                }}
              />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1f2937",
                  lineHeight: 1,
                }}
              >
                Prochaine programmation
              </Typography>
            </Box>

            <ScheduleCard
              s={nextSchedule}
              color="#4b5563"
              scheduleType="next"
            />
          </Box>
        )}

        {/*--------------------------------- autres programmations-----------------------*/}
        <Box
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 2,
            p: 1.75,
            backgroundColor: "#f1f2f2ff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: 0.75,
            }}
          >
            <CalendarMonthOutlined
              sx={{
                fontSize: 15,
                color: "#4b5563",
              }}
            />
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "#374151",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Autres programmations
            </Typography>
          </Box>

          {otherSchedules.length === 0 ? (
            <Typography
              sx={{
                fontSize: 11,
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              Aucune programmation prévue pour le futur
            </Typography>
          ) : (
            <Box>
              {visibleOtherSchedules.map((s: ISchedule, i: number) => (
                <ScheduleCard
                  key={s.scheduleId ?? i}
                  s={s}
                  color="#4b5563"
                  scheduleType="other"
                />
              ))}
              {otherSchedules.length > 3 && (
                <ShowMoreLess
                  end={endOtherSchedules}
                  total={otherSchedules.length}
                  setEnd={setEndOtherSchedules}
                  step={3}
                />
              )}
            </Box>
          )}
        </Box>
        {/*--------------------------------- planifications quotidiennes -----------------------*/}
        <Box
          sx={{
            border: "1px solid #bfdbfe",
            borderRadius: 2,
            p: 1.75,
            backgroundColor: "#eff6ff",
            mt: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mb: 0.75,
            }}
          >
            <AutorenewOutlinedIcon
              sx={{
                fontSize: 15,
                color: "#1d4ed8",
              }}
            />
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: "#1e3a8a",
                letterSpacing: "0.04em",
                lineHeight: 1,
              }}
            >
              Planifications quotidiennes
            </Typography>
          </Box>

          {dailySchedules.length === 0 ? (
            <Typography
              sx={{
                fontSize: 11,
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              Aucune planification quotidienne configurée
            </Typography>
          ) : (
            visibleDailySchedules.map((s, i) => (
              <ScheduleCard
                key={s.scheduleId ?? i}
                s={s}
                color="#1e40af"
                scheduleType="daily"
              />
            ))
          )}
          {dailySchedules.length > 3 && (
            <ShowMoreLess
              end={endDailySchedules}
              total={dailySchedules.length}
              setEnd={setEndDailySchedules}
            />
          )}
        </Box>
      </Box>
    </Collapse>
  );
}
