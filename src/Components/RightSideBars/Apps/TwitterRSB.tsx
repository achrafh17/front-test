import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Alert from "@mui/material/Alert";
import useStore from "../../../store/store";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { Select } from "@mantine/core";
import TagInput from "../../Common/TagInput";
import TwitterPreview from "../../Common/twitter-preview";
import { ITwitterApiResponse } from "../../../types/api.types";
import useRSB from "../../../hooks/useRSB";
import AppsDefaultRSB from "../../RightSideBars/Apps/AppsDefaultRSB";

const TwitterRSB: React.FC<{}> = () => {
  const { setRsbVariant } = useRSB();

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
  const [name, setName] = useState("Twitter");
  const [duration, setDuration] = useState("10");
  const [searchBy, setSearchBy] = useState(SEARCH_BY_ITEMS[0].value);
  const [theme, setTheme] = useState(THEME_ITEMS[0].value);
  const [fontSize, setFontSize] = useState("medium");
  const [searchText, setSearchText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [tweets, setTweets] = useState<ITwitterApiResponse>({
    data: [],
    includes: {
      users: [],
    },
  });

  React.useEffect(() => {
    setSearchText(tags.join(","));
  }, [tags]);

  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Twitter",
        info: {
          searchBy,
          searchText,
          theme,
          duration,
          fontSize,
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
        setName("Twitter");
        setSuccess(true);

        setTimeout(() => {
          setRsbVariant({
            name: "APPS_DEFAULT",
            renderComponent: () => <AppsDefaultRSB />,
          });
        }, 700);
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
          <TwitterPreview
            duration={parseInt(duration)}
            searchBy={searchBy}
            searchText={searchText}
            theme={theme}
            fontSize={fontSize}
            onTweets={(newTweets) => {
              setTweets(newTweets);
            }}
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
          <Alert severity="info" sx={{ mb: 2 }}>
            Seuls les tweets postés au cours des 7 derniers jours seront
            affichés.
          </Alert>
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
          <Typography sx={{ fontSize: 15, color: "#3f4242" }}>
            Chercher par
          </Typography>

          <FormControl>
            <RadioGroup
              value={searchBy}
              onChange={(e) => {
                setSearchText("");
                setSearchBy(e.target.value);
              }}
              name="search-by"
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                mb: 2,
              }}
            >
              {SEARCH_BY_ITEMS.map(({ label, value }, idx) => (
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

          <Alert severity="info" sx={{ mb: 2 }}>
            {searchBy === "user"
              ? 'Le nom d\'utilisateur ne doit pas contenir @'
              : searchBy === "hashtag"
              ? 'les tags ne doivent pas contenir #'
              : "Pour rechercher par mot clé, non par utilisateur ou par tags"}
          </Alert>

          {/* ---------------------------------------------------------------- */}

          <Box sx={{ mb: 2, width: "100%" }}>
            {searchBy === "user" || searchBy === "all" ? (
              <>
                <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
                  {searchBy === "user" ? "Utilisateur" : "Rechercher"}
                </Typography>
                <TextField
                  variant="standard"
                  sx={{ width: "100%" }}
                  value={searchText}
                  placeholder={
                    searchBy === "user" ? "twitter handle" : "digital signage"
                  }
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </>
            ) : (
              <TagInput
                tags={tags}
                onAddTag={(newTag) => {
                  setTags((old) => [...old, newTag]);
                }}
                onDeleteTagByIdx={(idx) => {
                  setTags((old) => old.filter((t, index) => index !== idx));
                }}
              />
            )}
          </Box>

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
              onChange={(newFontSize) => {
                if (newFontSize) {
                  setFontSize(newFontSize);
                }
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
            disabled={tweets.data.length === 0}
            onClick={save}
          >
            Ajouter Contenu
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default TwitterRSB;
