import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {  useState } from "react";
import { Select } from "@mantine/core";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useStore from "../../../store/store";
import React from "react"
import useRSB from "../../../hooks/useRSB";
import AppsDefaultRSB from "./AppsDefaultRSB"
// @ts-ignore
import TicTacToeIMG from "../../../assets/images/tic-tac-toe.png";
// @ts-ignore
import HiddenWordsIMG from "../../../assets/svg/hidden-words.svg";
// @ts-ignore
import WordleIMG from "../../../assets/svg/wordle.svg";

const GAMES = [
  {
    value: "Tic Tac Toe",
    label: "Tic Tac Toe",
    image: TicTacToeIMG
  },
  {
    value: "Wordle",
    label: "Wordle",
    image: WordleIMG
  },
  {
    value: "Mots Cachés",
    label: "Mots Cachés",
    image: HiddenWordsIMG
  },
];

const GamesRSB: React.FC<{}> = () => {
  const { userInfo } = useAuth();
  const {setRsbVariant} = useRSB();
  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);

  const [name, setName] = useState("Jeu");
  const [type, setType] = useState(GAMES[0].value);

  const [success, setSuccess] = useState<boolean | null>(null);

  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Jeu",
        info: {
          type: type
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
        setName("Jeu");
        
        setSuccess(true);
        setTimeout(() => {
          setRsbVariant({
            name: "APPS_DEFAULT",
            renderComponent: () => <AppsDefaultRSB />
          })
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
            borderBottom: "2px solid #ccc",
            backgroundColor:"#eee"
          }}
        >
          <img
            src={GAMES.find((g) => g.value === type)?.image}
            alt=""
            style={{
              objectFit: "contain",
              objectPosition: "center",
              height: "100%",
              width: "100%",
              minWidth: 40,
              aspectRatio: "1",
            }}
          />
        </Box>
        <Box
          sx={{
            p: 3,
            overflowY: "scroll",
            height: "calc(100vh - 60px - 190px - 80px)",
            maxHeight: "calc(100vh - 60px - 190px - 80px)",
          }}
          className="hide-scrollbar"
        >
          <TextField
            variant="standard"
            sx={{ width: "100%", mb: 2 }}
            label="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 12, mb: 1 }}>
            Type
          </Typography>
          <Select
            data={GAMES}
            value={type}
            onChange={(newType: string) => {
              setType(newType);
            }}
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
    </Box>
  );
};

export default GamesRSB;
