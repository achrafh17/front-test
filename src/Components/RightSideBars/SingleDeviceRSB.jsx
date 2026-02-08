//this needs a lot of refactoring omg
// tbd : detect when a change has been done to show the save button

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { ReactComponent as CropDisplayModeSvg } from "../../assets/svg/crop-display-mode.svg";
import { ReactComponent as OriginalDisplayModeSvg } from "../../assets/svg/original-display-mode.svg";
import { ReactComponent as StretchDisplayModeSvg } from "../../assets/svg/stretch-display-mode.svg";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { styled } from "@mui/material/styles";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import timezones from "../../assets/data/timezones.json"

//to parse time with dayjs
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CircularProgress } from "@mui/material";
dayjs.extend(customParseFormat);

//styles for select input
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      marginTop: 7,
    },
  },
};

export default function SingleDeviceRSB({deviceInfo }) {

  const [hasChanged, setHasChanged] = useState(false);

  const [formFields, setFormFields] = useState({
    deviceId: "",
    name: "",
    volume: 50,
    brightness: 100,
    sleepMode: false,
    sleepStart: dayjs("21:00:00", "HH:mm:ss").toDate(),
    sleepEnd: dayjs("09:00:00", "HH:mm:ss").toDate(),
    timezone: "",
    screenOrientation: "",
    displayMode: "original",
  });

  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [isRestartExpanded, setIsRestartExpanded] = useState(false);
  const [isDailyRebootExpanded, setIsDailyRebootExpanded] = useState(false);

  const [restartMedium, setRestartMedium] = useState("screen");
  const [dailyRestartMedium, setDailyRestartMedium] = useState("screen");
  const [dailyRestartAt, setDailyRestartAt] = useState(
    dayjs("00:00:00", "HH:mm:ss").toDate()
  );


  useEffect(() => {
    setFormFields({
      deviceId: deviceInfo?.deviceId,
      name: deviceInfo?.name || "",
      volume: deviceInfo?.volume || 50,
      brightness: deviceInfo?.brightness || 100,
      sleepMode: deviceInfo?.sleepMode === "1" || false,
      sleepStart: dayjs(deviceInfo?.sleepStart).toDate(),
      sleepEnd: dayjs(deviceInfo?.sleepEnd).toDate(),
      timezone: deviceInfo?.timezone || "",
      screenOrientation: deviceInfo?.screenOrientation || "0",
      displayMode: deviceInfo?.displayMode || "original",
    });
  }, [deviceInfo]);

  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const synchronize = () => {
    // call to api
  }

  const updateDeviceInfo = (newDeviceInfo) => {
    // call to api
  }

  const save = async () => {
    setIsLoading(true);
    var success = await updateDeviceInfo({
      ...deviceInfo,
      ...formFields,
    });
    setIsLoading(false);
    if(success){
      setSuccess(true);
      setTimeout(()=>{
        setHasChanged(false);
        setSuccess(false);
      }, 700)
      setFail(false)
    }else{
      setFail(true);
      setTimeout(()=>{
        setFail(false);
      }, 700)
      setSuccess(false);
    }
  };

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
          value={formFields.name}
          onChange={(e) => {
            setHasChanged(true);
            setFormFields((old) => {
              return { ...old, name: e.target.value };
            });
          }}
          sx={{ width: "100%" }}
        />
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
              as="p"
              sx={{ fontWeight: 400, fontSize: 16 }}
            >
              Info 
            </Typography>
            <Typography
              className="show-info"
              variant="subtitle1"
              as="p"
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
                  {deviceInfo?.operatingSystem}
                </span>
              </p>
              <p className="info-label">
                Version du lecteur:{" "}
                <span className="info-value">
                  {deviceInfo?.playerVersion}
                </span>
              </p>
              <p className="info-label">
                Était ajouté:{" "}
                <span className="info-value">
                  {dayjs(deviceInfo?.dateAdded).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </span>
              </p>
              <p className="info-label">
                Synchronisation dernière:{" "}
                <span className="info-value">
                  {dayjs(deviceInfo?.timeLastSync).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </span>
              </p>
              <p className="info-label">
                Résolution de l'écran:{" "}
                <span className="info-value">
                  {deviceInfo?.screenResolution}
                </span>
              </p>
              <p className="info-label">
                Utilisé / Total:{" "}
                <span className="info-value">
                  {deviceInfo?.usedOnTotal}
                </span>
              </p>
            </>
          )}
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            as="p"
            sx={{
              color: "#9ca0a1",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Volume: {formFields.volume}
          </Typography>

          <CustomSlider
            step={5}
            min={0}
            max={100}
            value={parseInt(formFields.volume)}
            onChange={(e) => {
              setHasChanged(true);
              setFormFields((old) => {
                return { ...old, volume: e.target.value };
              });
            }}
            valueLabelDisplay="auto"
            components={{
              ValueLabel: ValueLabelComponent,
            }}
          />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Switch
              checked={formFields.brightness === "auto"}
              onChange={(e) => {
                setHasChanged(true);
                if (e.target.checked) {
                  setFormFields((old) => {
                    return { ...old, brightness: "auto" };
                  });
                } else {
                  setFormFields((old) => {
                    return { ...old, brightness: 50 };
                  });
                }
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>
              Luminosité adaptive
            </Typography>
          </Box>
          {formFields.brightness !== "auto" && (
            <>
              <Typography
                variant="subtitle1"
                as="p"
                sx={{
                  color: "#9ca0a1",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Luminosité: {formFields.brightness}
              </Typography>

              <CustomSlider
                step={5}
                min={0}
                max={100}
                value={parseInt(formFields.brightness)}
                onChange={(e) => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return { ...old, brightness: e.target.value };
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
            <Switch
              checked={formFields.sleepMode}
              onChange={(e) => {
                setHasChanged(true);
                if (e.target.checked) {
                  setFormFields((old) => {
                    return { ...old, sleepMode: true };
                  });
                } else {
                  setFormFields((old) => {
                    return { ...old, sleepMode: false };
                  });
                }
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>Mode Veille</Typography>
          </Box>
          {!!formFields.sleepMode && (
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
                value={formFields.sleepStart}
                onChange={(newTime) => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return {
                      ...old,
                      sleepStart: newTime,
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
                value={formFields.sleepEnd}
                onChange={(newTime) => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return {
                      ...old,
                      sleepEnd: newTime,
                    };
                  });
                }}
              />
            </Box>
          )}
        </Box>
        <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
          <InputLabel id="timezone-label" sx={{ color: "#9ca0a1" }}>
            Fuseau Horaire
          </InputLabel>
          <Select
            label="Fuseau Horaire"
            labelId="timezone-label"
            fullWidth
            variant="standard"
            value={formFields.timezone}
            onChange={(e) => {
              setHasChanged(true);
              setFormFields((old) => {
                return {
                  ...old,
                  timezone: e.target.value,
                };
              });
            }}
            MenuProps={MenuProps}
          >
            {timezones.map((timezone, idx) => {
              return (
                <MenuItem key={idx} value={timezone.value}>
                  {timezone.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
          <InputLabel id="screen_orientation_label" sx={{ color: "#9ca0a1" }}>
            Orientation de l'écran
          </InputLabel>
          <Select
            label="Orientation de l'écran"
            labelId="screen_orientation_label"
            fullWidth
            variant="standard"
            value={formFields.screenOrientation}
            onChange={(e) => {
              setHasChanged(true);
              setFormFields((old) => {
                return {
                  ...old,
                  screenOrientation: e.target.value,
                };
              });
            }}
            MenuProps={MenuProps}
          >
            {["0", "90", "180", "270"].map((value, idx) => {
              return (
                <MenuItem key={idx} value={value}>
                  {value}°
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

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
                    formFields.displayMode === "original" ? "#f00020" : "#fff",
                  cursor: "pointer",
                  borderRight: "1px solid #9ca0a1",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return { ...old, displayMode: "original" };
                  });
                }}
              >
                <OriginalDisplayModeSvg
                  width={26}
                  height={26}
                  fill={
                    formFields.displayMode === "original" ? "#fff" : "#9ca0a1"
                  }
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
                    formFields.displayMode === "stretch" ? "#f00020" : "#fff",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return { ...old, displayMode: "stretch" };
                  });
                }}
              >
                <StretchDisplayModeSvg
                  width={26}
                  height={26}
                  fill={
                    formFields.displayMode === "stretch" ? "#fff" : "#9ca0a1"
                  }
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
                    formFields.displayMode === "crop" ? "#f00020" : "#fff",
                  cursor: "pointer",
                  borderLeft: "1px solid #9ca0a1",
                }}
                onClick={() => {
                  setHasChanged(true);
                  setFormFields((old) => {
                    return { ...old, displayMode: "crop" };
                  });
                }}
              >
                <CropDisplayModeSvg
                  width={26}
                  height={26}
                  fill={formFields.displayMode === "crop" ? "#fff" : "#9ca0a1"}
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        <Box
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
              as="p"
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
        </Box>
        <Box sx={{ py: 1.5, width: "100%" }}>
          <Button
            variant="outlined"
            onClick={() => {
              synchronize();
            }}
            sx={{ width: "100%" }}
          >
            Synchroniser
          </Button>
        </Box>
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
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ height: 24, width: 24 }} />
        ) : (
          <Button variant="contained" fullWidth onClick={save}>
            {success ? (
              <CheckCircleOutlinedIcon
                sx={{ color: "white", width: 24, height: 24 }}
              />
            ) : fail ? (
              <CancelOutlinedIcon
                sx={{ color: "white", width: 24, height: 24 }}
              />
            ) : (
              "Enregistrer"
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
}

const CustomSlider = styled(Slider)({
  color: "#F00020",
  height: 6,
  padding: "13px 0",
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
