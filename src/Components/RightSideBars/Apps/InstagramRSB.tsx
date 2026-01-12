import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Alert from "@mui/material/Alert"
import useStore from "../../../store/store";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Select } from "@mantine/core";
import TagInput from "../../Common/TagInput";


export default function InstagramRSB() {
  const SEARCH_BY_ITEMS = [
    {
      label: "Utilisateur",
      value: "user",
    },
    {
      label: "Hashtag",
      value: "hashtag",
    },
    {
      label: "Partout",
      value: "all",
    },
  ];
  const THEME_ITEMS = [
    {
      label: "Clair",
      value: "light",
    },
    {
      label: "Foncé",
      value: "dark",
    },
  ];
  const { userInfo } = useAuth();
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("Instagram");
  const [duration, setDuration] = useState("15");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleBlocks, setVisibleBlocks] = useState({
    author: true,
    description: true,
  });
  const [theme, setTheme] = useState(THEME_ITEMS[0].value);
  const [fontSize, setFontSize] = useState("medium");
  const [success, setSuccess] = useState<boolean|null>(null);



  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Instagram",
        info: {
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
        setName("Instagram");
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
            borderBottom: "1px solid #888",
          }}
        >
          
        </Box>
        <Box
          sx={{
            padding: 3,
            "& input:focus": {
              borderColor: "black",
            },
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
          {/* ---------------------------------------------------------------- */}
          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>Durée</Typography>
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
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {/* ---------------------------------------------------------------- */}

          <Typography sx={{ fontSize: 15, color: "#3f4242" }}>Thème</Typography>

          <FormControl>
            <RadioGroup
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              name="theme"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                mb: 2,
              }}
            >
              {THEME_ITEMS.map(({ label, value }, idx) => (
                <FormControlLabel
                  key={idx}
                  value={value}
                  control={<Radio size="small" sx={{ margin: 0 }} />}
                  label={
                    <Typography sx={{ fontSize: 13, color: "#3f4242" }}>
                      {label}
                    </Typography>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          {/* ---------------------------------------------------------------- */}

          <Box
            sx={{
              mb: 2,
              "& input:focus, & input:focus-within": {
                borderColor: "black",
              },
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
              Taille de la police
            </Typography>
            <Select
              data={[
                { value: "small", label: "Petite" },
                { value: "medium", label: "Moyenne" },
                { value: "large", label: "Grande" },
              ]}
              value={fontSize}
              onChange={(v) => {
                if (v) setFontSize(v);
              }}
            />
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
    </Box>
  );
}
