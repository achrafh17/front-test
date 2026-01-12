import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import { Select } from "@mantine/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import RSSPreview from "../../Common/news-preview/RSSPreview"
import useStore from "../../../store/store";

const RSS_LINKS = [
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=theme&name=news",
    label: "Monde",
    value: "monde",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=vertical&name=my-europe",
    label: "Europe",
    value: "europe",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=vertical&name=culture",
    label: "Culture",
    value: "culture",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=vertical&name=travel",
    label: "Voyage",
    value: "voyage",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=theme&name=sport",
    label: "Sport",
    value: "sport",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=vertical&name=green",
    label: "Green",
    value: "green",
  },
  {
    link: "https://fr.euronews.com/rss?format=mrss&level=vertical&name=next",
    label: "Next",
    value: "next",
  },
];

export default function EuronewsRSB() {
  const { userInfo } = useAuth();
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [isLoading, setIsLoading] = useState(false);
  const [genre, setGenre] = useState(RSS_LINKS[0].value);
  const [name, setName] = useState("Euronews");
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
        type: "Euronews",
        info: {
          version: 2,
          link: RSS_LINKS.find(e => e.value === genre)?.link,
          duration,
          fontSize,
          theme
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
        setName("Euronews");
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
          }}
        >
          <RSSPreview 
            link={RSS_LINKS.find(e => e.value === genre)?.link}
            fontSize={fontSize}
            theme={theme}
            duration={duration}
          />
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

          <Box sx={{  }}>
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

          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
            Actualités
          </Typography>
          <Select data={RSS_LINKS} value={genre} onChange={setGenre}  sx={{marginBottom: 16}}/>

          <Box sx={{mb: 1 }}>
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
