import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ClockStylePicker from "../../Common/clock/ClockStylePicker";
import CustomBgColor from "../../Common/CustomBgColor";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ClockFormatPicker from "../../Common/clock/ClockFormatPicker";
import IOSSwitch from "../../Common/IOSSwitch";
import ClockPreview from "../../Common/clock/ClockPreview";
import { ReactComponent as ListSVG } from "../../../assets/svg/list.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import AddClocksPanel from "./AddClocksPanel";
import useStore from "../../../store/store";

export default function ClockRSB() {
  const { userInfo } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [name, setName] = useState("Horloge");
  const [clockStyle, setClockStyle] = useState("analog");
  const [clockFormat, setClockFormat] = useState("24");
  const [theme, setTheme] = useState("light");
  const [bgColor, setBgColor] = useState("#000000");
  const [useCustomBgColor, setUseCustomBgColor] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [clocks, setClocks] = useState(["Localisation de l'écran"]);

  const [isPanelShown, setIsPanelShown] = useState(false);

  const [success, setSuccess] = useState(null);

  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");

      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Horloge",
        info: {
          clocks,
          clockStyle,
          clockFormat,
          theme,
          useCustomBgColor,
          bgColor,
          showDate,
          showLocation,
        },
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/add-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();

      if (resJson?.success) {
        setName("Horloge");
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
        }, 1000);
      } else {
        setSuccess(false);
        setTimeout(() => {
          setSuccess(null);
        }, 1000);
      }
    } catch (e) {
      setSuccess(false);
      setTimeout(() => {
        setSuccess(null);
      }, 1000);
    }
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #ccc",
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderBottom: "1px solid #aaa",
          }}
        >
          <ClockPreview
            clocks={clocks}
            clockStyle={clockStyle}
            clockFormat={clockFormat}
            theme={theme}
            useCustomBgColor={useCustomBgColor}
            bgColor={bgColor}
            showDate={showDate}
            showLocation={showLocation}
          />
        </Box>
        <Box
          sx={{
            padding: 3,
            overflowY: "scroll",
            height: "calc(100vh - 60px - 190px - 80px)",
            maxHeight: "calc(100vh - 60px - 190px - 80px)",
          }}
          className="hide-scrollbar"
        >
          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>Nom</Typography>
          <TextField
            variant="standard"
            sx={{ width: "100%", mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              mb: 2,
            }}
            onClick={() => {
              setIsPanelShown((old) => !old);
            }}
          >
            <ListSVG />
            <Box sx={{ height: "100%", flex: 1 }}>
              <Typography sx={{ fontSize: 12, color: "#84898a" }}>
                Liste des horloges
              </Typography>
              <Typography sx={{ fontSize: 14 }}>Éditer l'horloge</Typography>
            </Box>
            <Tooltip
              title="Vous pouvez ajouter jusqu'à 3 horloges"
              arrow
              placement="bottom-start"
            >
              <HelpOutlineIcon
                sx={{ color: "#84898a", height: 18, width: 18 }}
              />
            </Tooltip>
          </Box>
          <ClockStylePicker
            clockStyle={clockStyle}
            setClockStyle={setClockStyle}
          />
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
              Thème
            </Typography>

            <RadioGroup
              row
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              sx={{ mb: 2 }}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label={
                  <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                    Clair
                  </Typography>
                }
              />
              <FormControlLabel
                value="dark"
                control={<Radio />}
                label={
                  <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                    Sombre
                  </Typography>
                }
              />
            </RadioGroup>
            <CustomBgColor
              color={bgColor}
              setColor={setBgColor}
              active={useCustomBgColor}
              setActive={setUseCustomBgColor}
            />
            <ClockFormatPicker
              clockFormat={clockFormat}
              setClockFormat={setClockFormat}
            />

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <IOSSwitch
                checked={showDate}
                onChange={(e) => {
                  setShowDate(e.target.checked);
                }}
              />
              <Typography
                sx={{
                  fontSize: 16,
                  color: showDate? "#000":"#b2b7b8",
                  cursor: "pointer",
                  pl: 2,
                }}
                onClick={() => {
                  setShowDate((old) => !old);
                }}
              >
                Afficher la date
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <IOSSwitch
                checked={showLocation}
                onChange={(e) => {
                  setShowLocation(e.target.checked);
                }}
              />
              <Typography
                sx={{
                  fontSize: 16,
                  color: showLocation? "#000":"#b2b7b8",
                  cursor: "pointer",
                  pl: 2,
                }}
                onClick={() => {
                  setShowLocation((old) => !old);
                }}
              >
                Afficher la localisation
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : success !== null ? (
          <Box
            sx={{
              width: "100%",
              borderRadius: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
              backgroundColor: "#F00020",
            }}
          >
            {success ? (
              <CheckCircleIcon sx={{ color: "white" }} />
            ) : (
              <CancelIcon sx={{ color: "white" }} />
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            sx={{ width: "100%", py: 1 }}
            onClick={save}
          >
            Ajouter Contenu
          </Button>
        )}
      </Box>
      {isPanelShown && (
        <AddClocksPanel
          onClose={() => {
            setIsPanelShown(false);
          }}
          clocks={clocks}
          setClocks={setClocks}
        />
      )}
    </Box>
  );
}
