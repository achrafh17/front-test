import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import { Select } from "@mantine/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import France24Preview from "../../Common/news-preview/France24Preview";
import useStore from "../../../store/store";

const GENRES = [
  {
    value: "monde",
    label: "Monde",
    link: "https://www.france24.com/fr/rss",
  },
  {
    value: "europe",
    label: "Europe",
    link: "https://www.france24.com/fr/europe/rss",
  },
  {
    value: "france",
    label: "France",
    link: "https://www.france24.com/fr/france/rss",
  },
  {
    value: "afrique",
    label: "Afrique",
    link: "https://www.france24.com/fr/afrique/rss",
  },
  {
    value: "moyen_orient",
    label: "Moyen Orient",
    link: "https://www.france24.com/fr/moyen-orient/rss",
  },
  {
    value: "america",
    label: "Amériques",
    link: "https://www.france24.com/fr/ameriques/rss",
  },
  {
    value: "asia",
    label: "Asie Pacifique",
    link: "https://www.france24.com/fr/asie-pacifique/rss",
  },
  {
    value: "eco",
    label: "Économie",
    link: "https://www.france24.com/fr/economie/rss",
  },
  {
    value: "sport",
    label: "Sport",
    link: "https://www.france24.com/fr/sports/rss",
  },
  {
    value: "culture",
    label: "Culture",
    link: "https://www.france24.com/fr/culture/rss",
  },
  {
    value: "planete",
    label: "Planète",
    link: "https://www.france24.com/fr/plan%C3%A8te/rss",
  },
];

export default function France24RSB() {
  const { userInfo } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [name, setName] = useState("France24");
  const [genre, setGenre] = useState("monde");
  const [duration, setDuration] = useState(15);
  const [fontSize, setFontSize] = useState("medium");
  const [theme, setTheme] = useState("light");

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
        type: "France24",
        info: {
          genre: genre,
          duration: duration,
          fontSize: fontSize,
          theme: theme,
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
        setName("France24");
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
            borderBottom: "1px solid #ccc",
          }}
        >
          <France24Preview
            genre={genre}
            fontSize={fontSize}
            duration={duration}
            theme={theme}
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
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
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
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Box>

          <Box
            sx={{
              mb: 2,
              "& input:focus, & input:focus-within": {
                borderColor: "black",
              },
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
              Actualités
            </Typography>
            <Select data={GENRES} value={genre} onChange={setGenre} />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
              Thème
            </Typography>

            <RadioGroup
              row
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
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
          </Box>

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
              onChange={setFontSize}
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
