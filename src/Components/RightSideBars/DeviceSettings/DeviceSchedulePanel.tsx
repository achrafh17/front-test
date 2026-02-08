import { Box, Typography } from "@mui/material";
import {
  PlayCircleFilledOutlined,
  EventOutlined,
  CalendarMonthOutlined,
  PauseCircleOutlined,
} from "@mui/icons-material";
import { ISchedule } from "../../Schedule/Main";
import { useState } from "react";

interface DeviceSchedulePanelProps {
  actualSchedule?: ISchedule;
  nextSchedule?: ISchedule;
  otherSchedules?: ISchedule[];
}

export default function DeviceSchedulePanel({
  actualSchedule,
  nextSchedule,
  otherSchedules,
}: DeviceSchedulePanelProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        sx={{
          color: "#6b7280",
          fontSize: 12,
          fontWeight: 500,
          mb: 1,
        }}
      >
        Planning de diffusion
      </Typography>

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
            <PlayCircleFilledOutlined sx={{ fontSize: 16, color: "#047857" }} />{" "}
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

          <Typography
            sx={{
              fontWeight: 500,
              color: "#047857",
              mt: 1,
              fontSize: 12,
            }}
          >
            {actualSchedule.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#065f46",
              mt: 0.5,
              display: "flex",
            }}
          >
            <span>
              {actualSchedule.startDate &&
                new Date(actualSchedule.startDate).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
            <span style={{ margin: "0 8px" }}>→</span>
            <span>
              {actualSchedule.endDate &&
                new Date(actualSchedule.endDate).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </Typography>
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

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: "#047857",
              mt: 0.5,
            }}
          >
            Aucune programmation en cours
          </Typography>
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
              gap: 0.75,
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

          <Typography
            sx={{
              fontWeight: 500,
              mt: 1,
              fontSize: 12,
              color: "#4b5563",
            }}
          >
            {nextSchedule.title}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              color: "#6b7280",
              mt: 0.5,
              display: "flex",
            }}
          >
            <span>
              {nextSchedule.startDate &&
                new Date(nextSchedule.startDate).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
            <span style={{ margin: "0 8px" }}>→</span>
            <span>
              {nextSchedule.endDate &&
                new Date(nextSchedule.endDate).toLocaleString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </span>
          </Typography>
        </Box>
      )}

      {/*--------------------------------- autres programmations-----------------------*/}
      <Box
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          p: 1.75,
          backgroundColor: "#f9fafb",
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

        {otherSchedules && otherSchedules.length === 0 ? (
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
            {otherSchedules &&
              otherSchedules.map((s: ISchedule, i: number) => (
                <Box
                  key={s.scheduleId ?? i}
                  sx={{
                    py: 0.75,
                    borderBottom: "1px solid #e5e7eb",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: 11,
                      color: "#4b5563",
                    }}
                  >
                    {s.title}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      fontSize: 12,
                      color: "#6b7280",
                      mt: 0.5,
                    }}
                  >
                    <span>
                      {s.startDate &&
                        new Date(s.startDate).toLocaleString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                    <span style={{ opacity: 0.6 }}>→</span>
                    <span>
                      {s.endDate &&
                        new Date(s.endDate).toLocaleString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </span>
                  </Box>
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
