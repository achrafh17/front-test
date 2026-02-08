import React, { useEffect, useState } from "react";
import { IDeviceSingle } from "../../../types/api.types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import IOSSwitch from "../../Common/IOSSwitch";
import { Select } from "@mantine/core";
import CircularProgress from "@mui/material/CircularProgress";
//@ts-ignore
import { ReactComponent as CropDisplayModeSvg } from "../../../assets/svg/crop-display-mode.svg";
//@ts-ignore
import { ReactComponent as OriginalDisplayModeSvg } from "../../../assets/svg/original-display-mode.svg";
//@ts-ignore
import { ReactComponent as StretchDisplayModeSvg } from "../../../assets/svg/stretch-display-mode.svg";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { styled } from "@mui/material/styles";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";

import timezones from "../../../assets/data/timezones.json";
import useAuth from "../../../hooks/useAuth";
import { ISchedule } from "../../Schedule/Main";
import DeviceSchedulePanel from "./DeviceSchedulePanel";

interface props {
  deviceInfo: IDeviceSingle;
  onNewDeviceInfo: (newDeviceInfo: IDeviceSingle) => void;
}

const DeviceEditableSettings: React.FC<props> = ({
  deviceInfo,
  onNewDeviceInfo,
}) => {
  const { userInfo } = useAuth();

  const [isInfoExpanded, setIsInfoExpanded] = React.useState(true);
  const [fields, setFields] = React.useState<IDeviceSingle>(deviceInfo);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<boolean | null>(null);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [actualSchedule, setActualSchedule] = useState<ISchedule>();
  const [nextSchedule, setNextSchedule] = useState<ISchedule>();
  const [otherSchedules, setOtherSchedules] = useState<ISchedule[]>([]);
  const updateDeviceInfo = async () => {
    if (userInfo?.sessionId) {
      try {
        var res = await fetch(
          "https://www.powersmartscreen.com/update-device",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              sessionId: userInfo.sessionId,
              deviceInfo: fields,
            }),
          },
        );

        var resJson = await res.json();
        if (resJson.success) {
          if (onNewDeviceInfo !== undefined) {
            onNewDeviceInfo(resJson.result as IDeviceSingle);
          }
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  };
  useEffect(() => {
    fetch(
      `http://localhost:8000/get-schedules-by-device?sessionId=${userInfo?.sessionId}&deviceId=${deviceInfo.deviceId}`,
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          setSchedules([]);
          setActualSchedule(undefined);
          setNextSchedule(undefined);
          return;
        }

        setSchedules(data.schedules);
        const now = new Date();
        const actual = data.schedules?.find(
          (s: ISchedule) =>
            s.startDate &&
            new Date(s?.startDate) <= now &&
            s.endDate &&
            new Date(s?.endDate) > now,
        );
        setActualSchedule(actual);
        const next = data.schedules.find(
          (s: ISchedule) => s.startDate && new Date(s.startDate) > now,
        );
        setNextSchedule(next);

        const others = data.schedules.filter(
          (s: ISchedule) =>
            s.scheduleId !== actual?.scheduleId &&
            s.scheduleId !== next?.scheduleId &&
            s.endDate &&
            new Date(s.endDate) > now,
        );
        setOtherSchedules(others);
      });
    return () => {};
  }, [userInfo?.sessionId, deviceInfo?.deviceId]);
  const save = async () => {
    setIsLoading(true);
    var success = await updateDeviceInfo();
    setIsLoading(false);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        setHasChanged(false);
        setSuccess(null);
      }, 700);
    } else {
      setSuccess(false);
      setTimeout(() => {
        setSuccess(null);
      }, 700);
    }
  };

  React.useEffect(() => {
    setFields(deviceInfo);
  }, [deviceInfo]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "#575b5c",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          Paramètres de l'écran
        </Typography>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          overflowY: "scroll",
          height: hasChanged
            ? "calc(100vh - 60px - 80px - 68px)"
            : "calc(100vh - 60px - 80px)",
        }}
        className="hide-scrollbar"
      >
        <TextField
          autoComplete="off"
          variant="standard"
          label="Nom de l'écran"
          value={fields.name}
          onChange={(e) => {
            setHasChanged(true);
            setFields((old) => {
              return { ...old, name: e.target.value };
            });
          }}
          sx={{ width: "100%", mb: 2 }}
        />
        {!deviceInfo.isGroup && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 16 }}
              >
                Info
              </Typography>
              <Typography
                className="show-info"
                variant="subtitle1"
                sx={{
                  color: "#9ca0a1",
                  cursor: "pointer",
                  fontSize: 12,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setIsInfoExpanded((old) => !old);
                }}
              >
                {isInfoExpanded ? "Masquer" : "Afficher"}
              </Typography>
            </Box>
            {isInfoExpanded && (
              <>
                <p className="info-label">
                  Système d'exploitation:{" "}
                  <span className="info-value">
                    {deviceInfo.operatingSystem}
                  </span>
                </p>
                <p className="info-label">
                  Version du lecteur:{" "}
                  <span className="info-value">{deviceInfo.playerVersion}</span>
                </p>
                <p className="info-label">
                  Était ajouté:{" "}
                  <span className="info-value">
                    {dayjs(deviceInfo.dateAdded).format("DD/MM/YYYY, HH:mm")}
                  </span>
                </p>
                <p className="info-label">
                  Synchronisation dernière:{" "}
                  <span className="info-value">
                    {dayjs(deviceInfo.timeLastSync).format("DD/MM/YYYY, HH:mm")}
                  </span>
                </p>
                <p className="info-label">
                  Résolution de l'écran:{" "}
                  <span className="info-value">
                    {deviceInfo.screenResolution}
                  </span>
                </p>
                <p className="info-label">
                  Utilisé / Total:{" "}
                  <span className="info-value">{deviceInfo.usedOnTotal}</span>
                </p>
              </>
            )}
          </Box>
        )}

        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#9ca0a1",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Volume: {fields.volume}
          </Typography>

          <CustomSlider
            step={5}
            min={0}
            max={100}
            value={fields.volume ?? 50}
            onChange={(e) => {
              setHasChanged(true);
              setFields((old) => {
                //@ts-ignore
                return { ...old, volume: e?.target?.value ?? 50 };
              });
            }}
            valueLabelDisplay="auto"
            components={{
              ValueLabel: ValueLabelComponent,
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IOSSwitch
              sx={{ mr: 1 }}
              checked={fields.brightness === "auto"}
              onChange={(e) => {
                setHasChanged(true);
                if (e.target.checked) {
                  setFields((old) => {
                    return { ...old, brightness: "auto" };
                  });
                } else {
                  setFields((old) => {
                    return { ...old, brightness: "50" };
                  });
                }
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>
              Luminosité adaptive
            </Typography>
          </Box>
          {fields.brightness !== "auto" && (
            <>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#9ca0a1",
                  cursor: "pointer",
                  fontSize: 12,
                  mt: 1,
                }}
              >
                Luminosité: {fields.brightness}
              </Typography>

              <CustomSlider
                step={5}
                min={0}
                max={100}
                value={parseInt(fields.brightness ?? "50")}
                onChange={(e) => {
                  setHasChanged(true);
                  setFields((old) => {
                    //@ts-ignore
                    return { ...old, brightness: `${e.target.value ?? 50}` };
                  });
                }}
                valueLabelDisplay="auto"
                components={{
                  ValueLabel: ValueLabelComponent,
                }}
              />
            </>
          )}
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IOSSwitch
              sx={{ mr: 1 }}
              checked={Boolean(fields.sleepMode)}
              onChange={(e) => {
                setHasChanged(true);
                if (e.target.checked) {
                  setFields((old) => {
                    return {
                      ...old,
                      sleepMode: true,
                      sleepStart: dayjs()
                        .hour(0)
                        .minute(0)
                        .second(0)
                        .toISOString(),
                      sleepEnd: dayjs()
                        .hour(23)
                        .minute(59)
                        .second(59)
                        .toISOString(),
                    };
                  });
                } else {
                  setFields((old) => {
                    return { ...old, sleepMode: false };
                  });
                }
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>Mode Veille</Typography>
          </Box>
          {/* -------------- Schedule information for device-------------------- */}
          <DeviceSchedulePanel
            actualSchedule={actualSchedule}
            nextSchedule={nextSchedule}
            otherSchedules={otherSchedules}
          />
          {!!fields.sleepMode && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TimeInput
                style={{
                  width: "45%",
                }}
                withSeconds
                label="Début:"
                labelProps={{
                  style: {
                    color: "#9ca0a1",
                    fontSize: 12,
                    fontWeight: 400,
                  },
                }}
                value={dayjs(fields.sleepStart).toDate()}
                onChange={(newTime) => {
                  setHasChanged(true);
                  setFields((old) => {
                    return {
                      ...old,
                      sleepStart: newTime.toISOString(),
                    };
                  });
                }}
              />

              <TimeInput
                withSeconds
                style={{
                  width: "45%",
                }}
                label="Fin:"
                labelProps={{
                  style: {
                    color: "#9ca0a1",
                    fontSize: 12,
                    fontWeight: 400,
                  },
                }}
                value={dayjs(fields.sleepEnd).toDate()}
                onChange={(newTime) => {
                  setHasChanged(true);
                  setFields((old) => {
                    return {
                      ...old,
                      sleepEnd: newTime.toISOString(),
                    };
                  });
                }}
              />
            </Box>
          )}
        </Box>

        <Select
          sx={{ marginBottom: 8, marginTop: 8 }}
          label="Fuseau Horaire"
          labelProps={{
            style: {
              color: "#9ca0a1",
              fontSize: 13,
              fontWeight: "normal",
            },
          }}
          value={fields.timezone}
          onChange={(newVal) => {
            if (newVal) {
              setHasChanged(true);
              setFields((old) => {
                return {
                  ...old,
                  timezone: newVal,
                };
              });
            }
          }}
          data={timezones.map((t) => ({ label: t.label, value: t.value }))}
        />

        <Select
          label="Orientation de l'écran"
          labelProps={{
            style: {
              color: "#9ca0a1",
              fontSize: 13,
              fontWeight: "normal",
            },
          }}
          value={`${fields.screenOrientation}`}
          onChange={(newVal) => {
            if (newVal) {
              setHasChanged(true);
              setFields((old) => {
                return {
                  ...old,
                  screenOrientation: parseInt(newVal),
                };
              });
            }
          }}
          data={["0", "90", "180", "270"].map((v) => ({
            label: v + "°",
            value: v,
          }))}
        />

        <Box sx={{ mt: 2 }}>
          <Typography sx={{ color: "#9ca0a1", fontSize: 12 }}>
            Mode d'affichage des images
          </Typography>
          <Box
            sx={{
              display: "flex",
              borderRadius: 1.1,
              border: "1px solid #9ca0a1",
              height: 35,
              overflow: "hidden",
              mt: 1,
            }}
          >
            <Tooltip title="Original" placement="top" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor:
                    fields.displayMode === "original" ? "#f00020" : "#fff",
                  cursor: "pointer",
                  borderRight: "1px solid #9ca0a1",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFields((old) => {
                    return { ...old, displayMode: "original" };
                  });
                }}
              >
                <OriginalDisplayModeSvg
                  width={26}
                  height={26}
                  fill={fields.displayMode === "original" ? "#fff" : "#9ca0a1"}
                />
              </Box>
            </Tooltip>
            <Tooltip title="Étirer" placement="top" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor:
                    fields.displayMode === "stretch" ? "#f00020" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFields((old) => {
                    return { ...old, displayMode: "stretch" };
                  });
                }}
              >
                <StretchDisplayModeSvg
                  width={26}
                  height={26}
                  fill={fields.displayMode === "stretch" ? "#fff" : "#9ca0a1"}
                />
              </Box>
            </Tooltip>
            <Tooltip title="Recadrer" placement="top" arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor:
                    fields.displayMode === "crop" ? "#f00020" : "#fff",
                  cursor: "pointer",
                  borderLeft: "1px solid #9ca0a1",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFields((old) => {
                    return { ...old, displayMode: "crop" };
                  });
                }}
              >
                <CropDisplayModeSvg
                  width={26}
                  height={26}
                  fill={fields.displayMode === "crop" ? "#fff" : "#9ca0a1"}
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* <Box
          sx={{
            mt: 2,
            borderTop: "1px solid #ccc",
            borderBottom: "1px solid #ccc",
            mx: -3,
            py: 1.5,
            px: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              setIsRestartExpanded((old) => !old);
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 400, fontSize: 18, flex: 1 }}
            >
              Redémarrage
            </Typography>
            {isRestartExpanded ? <ExpandLessIcon /> : <ChevronRightIcon />}
          </Box>
          {isRestartExpanded && (
            <>
              <RadioGroup
                row
                value={restartMedium}
                onChange={(e) => {
                  setRestartMedium(e.target.value);
                }}
              >
                <FormControlLabel
                  value="screen"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" sx={{ fontSize: 14 }}>
                      Écran
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="app"
                  control={<Radio size="small" />}
                  label={
                    <Typography variant="body2" sx={{ fontSize: 14 }}>
                      Appli
                    </Typography>
                  }
                />
              </RadioGroup>
              <Button variant="outlined" onClick={() => {}}>
                {restartMedium === "screen"
                  ? "Écran de redémarrage"
                  : "Redémarrer l'application"}
              </Button>
              <Box
                sx={{ display: "flex", alignItems: "center", mt: 1, ml: -1 }}
              >
                <Switch
                  checked={isDailyRebootExpanded}
                  onChange={(e) => {
                    setIsDailyRebootExpanded((old) => !old);
                  }}
                />
                <Typography sx={{ color: "#9ca0a1" }}>
                  Rédémarrage diurne
                </Typography>
              </Box>
              {isDailyRebootExpanded && (
                <>
                  <RadioGroup
                    row
                    value={dailyRestartMedium}
                    onChange={(e) => {
                      setDailyRestartMedium(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="screen"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ fontSize: 14 }}>
                          Écran
                        </Typography>
                      }
                    />
                    <FormControlLabel
                      value="app"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ fontSize: 14 }}>
                          Appli
                        </Typography>
                      }
                    />
                  </RadioGroup>
                  <TimeInput
                    style={{
                      width: "100%",
                    }}
                    withSeconds
                    label="Redémarrer à:"
                    labelProps={{
                      style: {
                        color: "#9ca0a1",
                        fontSize: 12,
                        fontWeight: 400,
                      },
                    }}
                    value={dailyRestartAt}
                    onChange={(newTime) => {
                      setDailyRestartAt(newTime);
                    }}
                  />
                </>
              )}
            </>
          )}
        </Box> */}
      </Box>
      <Box
        className={` ${hasChanged ? "slide-top" : "slide-bottom"}`}
        sx={{
          width: "100%",
          padding: 2,
          backgroundColor: "white",
          boxShadow: "0px 3px 15px 6px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: ".3s all ease",
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ height: 20, width: 20 }} />
        ) : (
          <>
            {success === true ? (
              <CheckCircleOutlinedIcon
                sx={{ color: "#05cd7d", width: 24, height: 24 }}
              />
            ) : success === false ? (
              <CancelOutlinedIcon
                sx={{ color: "#F00020", width: 24, height: 24 }}
              />
            ) : (
              <Button variant="contained" fullWidth onClick={save}>
                Enregistrer
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default DeviceEditableSettings;

const CustomSlider = styled(Slider)({
  color: "#F00020",
  height: 6,
  padding: "6px 0",
  "&:focus": {
    boxShadow: "none",
  },

  "& .MuiSlider-thumb": {
    height: 13,
    width: 13,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "none",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 3,
  },
  "& .MuiSlider-rail": {
    color: "#bfbfbf",
    height: 3,
  },
});

function ValueLabelComponent({ children, value, ...props }) {
  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}
