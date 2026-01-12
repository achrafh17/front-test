import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import useStore from "../../../../store/store";
import Tooltip from "@mui/material/Tooltip";
import CustomSetting from "../../../Common/CustomSetting";
import ColorInput from "../../../Common/ColorInput";
//@ts-ignore
import { ReactComponent as ListSVG } from "../../../../assets/svg/list.svg";
//@ts-ignore
import { ReactComponent as CropDisplayModeSvg } from "../../../../assets/svg/crop-display-mode.svg";
//@ts-ignore
import { ReactComponent as OriginalDisplayModeSvg } from "../../../../assets/svg/original-display-mode.svg";
//@ts-ignore
import { ReactComponent as StretchDisplayModeSvg } from "../../../../assets/svg/stretch-display-mode.svg";
import ManageContentPanel from "./ManageContentPanel";
import { IContent } from "../../../../types/api.types";
import {
  ArrowPlacement,
  CounterType,
  DisplayMode,
  ISliderArrows,
  ISliderCounter,
  ISliderAutoloop,
  IColorAlpha,
} from "../../../../types/index";
import SliderPreview from "../../../Common/slider-preview/Main";



export type IContentLite = Pick<IContent, "contentId" | "path" | "title">

const Slider: React.FC<{}> = () => {
  const { userInfo } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [name, setName] = useState("Slider");
  const [contents, setContents] = useState<IContentLite[]>([]);
  const [arrows, setArrows] = useState<ISliderArrows>({
    exists: true,
    placement: "SIDES",
  });
  const [counters, setCounters] = useState<ISliderCounter>({
    exists: true,
    type: "DIGITS",
  });
  const [iconColor, setIconColor] = useState<IColorAlpha>({
    color: "#ffffff",
    opacity: 100,
  });
  const [iconBackground, setIconBackground] = useState<IColorAlpha>({
    color: "#000000",
    opacity: 20,
  });
  const [backgroundColor, setBackgroundColor] = useState<IColorAlpha>({
    color: "#000000",
    opacity: 100,
  });
  const [autoloop, setAutoloop] = useState<ISliderAutoloop>({
    exists: true,
    interval: "3",
  });
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    "ORIGINAL"
  );
  const [success, setSuccess] = useState<boolean | null>(null);

  console.log(contents)


  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }

    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Slider",
        info: {
          arrows,
          counters,
          iconColor,
          iconBackground,
          backgroundColor,
          displayMode,
          autoloop,
          contents: contents.map(c => c.contentId)
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
        setName("Slider");
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
        position: "relative",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            width: "100%",
            height: 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderBottom: "1px solid #ccc",
          }}
        >
          <SliderPreview
            contents={contents}
            arrows={arrows}
            autoloop={autoloop}
            backgroundColor={backgroundColor}
            iconColor={iconColor}
            iconBackground={iconBackground}
            counters={counters}
            displayMode={displayMode}
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
          <Typography sx={{ fontSize: 11, color: "#797c7c" }}>Nom</Typography>
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
              setIsPanelOpen((old) => !old);
            }}
          >
            <ListSVG />
            <Box
              sx={{
                height: "100%",
                flex: 1,
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#84898a" }}>
                Contenu
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                {contents.length === 0
                  ? "Ajouter Contenu"
                  : `Slides: ${contents.length}`}
              </Typography>
            </Box>
          </Box>

          <CustomSetting
            initiallyOpen={true}
            title="Flèches"
            active={arrows.exists}
            setActive={(activeState) => {
              setArrows((old) => ({ ...old, exists: activeState }));
            }}
            renderBody={() => (
              <Box>
                <RadioGroup
                  row
                  value={arrows.placement}
                  onChange={(e) =>
                    setArrows((old) => ({
                      ...old,
                      placement: e.target.value as unknown as ArrowPlacement,
                    }))
                  }
                >
                  <FormControlLabel
                    value={"SIDES"}
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                        Côtés
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value={"BOTTOM"}
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                        Dessous
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>
            )}
          />

          <CustomSetting
            sx={{
              mb: 2,
            }}
            initiallyOpen={true}
            title="Compteur"
            active={counters.exists }
            setActive={(activeState) => {
              setCounters((old) => ({ ...old, exists: activeState }));
            }}
            renderBody={() => (
              <Box>
                <RadioGroup
                  row
                  value={counters.type}
                  onChange={(e) =>
                    setCounters((old) => ({
                      ...old,
                      type: e.target.value as unknown as CounterType,
                    }))
                  }
                >
                  <FormControlLabel
                    value={"DIGITS"}
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                        Chiffres
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value={"DOTS"}
                    control={<Radio />}
                    label={
                      <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                        Points
                      </Typography>
                    }
                  />
                </RadioGroup>
              </Box>
            )}
          />

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 11, color: "#84898a" }}>
              Couleur de l'icône
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ColorInput
                sx={{ flex: 2 }}
                label=""
                value={iconColor.color}
                onValueChange={(v) => {
                  setIconColor((old) => ({ ...old, color: v }));
                }}
              />
              <TextField
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">O:</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
                variant="standard"
                sx={{ flex: 1 }}
                value={iconColor.opacity}
                onChange={(e) =>
                  setIconColor((old) => ({
                    ...old,
                    opacity: parseInt(e.target.value),
                  }))
                }
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 11, color: "#84898a" }}>
              Couleur de fond de l'icône
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ColorInput
                sx={{ flex: 2 }}
                label=""
                value={iconBackground.color}
                onValueChange={(v) => {
                  setIconBackground((old) => ({ ...old, color: v }));
                }}
              />
              <TextField
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">O:</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
                variant="standard"
                sx={{ flex: 1 }}
                value={iconBackground.opacity}
                onChange={(e) =>
                  setIconBackground((old) => ({
                    ...old,
                    opacity: parseInt(e.target.value),
                  }))
                }
              />
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
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
                      displayMode === "ORIGINAL" ? "#f00020" : "#fff",
                    cursor: "pointer",
                    borderRight: "1px solid #9ca0a1",
                  }}
                  onClick={() => {
                    setDisplayMode("ORIGINAL");
                  }}
                >
                  <OriginalDisplayModeSvg
                    width={26}
                    height={26}
                    fill={
                      displayMode === "ORIGINAL" ? "#fff" : "#9ca0a1"
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
                      displayMode === "STRETCH" ? "#f00020" : "#fff",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDisplayMode("STRETCH");
                  }}
                >
                  <StretchDisplayModeSvg
                    width={26}
                    height={26}
                    fill={
                      displayMode === "STRETCH" ? "#fff" : "#9ca0a1"
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
                      displayMode === "CROP" ? "#f00020" : "#fff",
                    cursor: "pointer",
                    borderLeft: "1px solid #9ca0a1",
                  }}
                  onClick={() => {
                    setDisplayMode("CROP");
                  }}
                >
                  <CropDisplayModeSvg
                    width={26}
                    height={26}
                    fill={displayMode === "CROP" ? "#fff" : "#9ca0a1"}
                  />
                </Box>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: 11, color: "#84898a" }}>
              Couleur de fond
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ColorInput
                sx={{ flex: 2 }}
                label=""
                value={backgroundColor.color}
                onValueChange={(v) => {
                  setBackgroundColor((old) => ({ ...old, color: v }));
                }}
              />
              <TextField
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">O:</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    max: 100,
                  },
                }}
                variant="standard"
                sx={{ flex: 1 }}
                value={backgroundColor.opacity}
                onChange={(e) =>
                  setBackgroundColor((old) => ({
                    ...old,
                    opacity: parseInt(e.target.value),
                  }))
                }
              />
            </Box>
          </Box>

          <CustomSetting
            initiallyOpen={true}
            title="Autoreproduction"
            active={autoloop.exists}
            setActive={(activeState) => {
              setAutoloop((old) => ({ ...old, exists: activeState }));
            }}
            renderBody={() => (
              <Box>
                <Typography sx={{ fontSize: 11, color: "#797c7c" }}>
                  Durée
                </Typography>
                <TextField
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">S:</InputAdornment>
                    ),
                    inputProps: {
                      min: 1,
                    },
                  }}
                  variant="standard"
                  sx={{ width: "100%", mb: 2 }}
                  value={autoloop.interval}
                  onChange={(e) =>
                    setAutoloop((old) => ({ ...old, interval: e.target.value }))
                  }
                />
              </Box>
            )}
          />
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
      {isPanelOpen && (
        <ManageContentPanel
          contents={contents}
          onClose={() => {
            setIsPanelOpen(false);
          }}
          onAddContents={(newContents) => {
            setContents((old) => {
              if(old.length + newContents.length <=50){
                return [...old, ...newContents]
              }else{
                let leftToFifty = 50 - old.length;
                return [...old, ...newContents.slice(0, leftToFifty)]
              }
            });
          }}
          onDeleteContent={(contentIdx) => {
            setContents((old) => {
              return old.concat().filter((_content, idx) => idx !== contentIdx);
            });
          }}
          setContents={setContents}
        />
      )}
    </Box>
  );
};

export default Slider;
