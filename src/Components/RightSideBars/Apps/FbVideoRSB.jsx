import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import { ReactComponent as InvalidFbVideoSVG } from "../../../assets/svg/fb_video_invalid.svg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useStore from "../../../store/store";

export default function FbVideoRSB() {
  const { userInfo } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore(state => state.setErrorMsg)
  const [name, setName] = useState("Facebook Video");
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(null);

  const save = async () => {
    if(userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Facebook Video",
        info: {
          link: link,
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
        setName("Facebook Video");
        setLink("");
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
          {!!link ? (
            <iframe
              id="fb_video"
              title="fb_video_preview"
              width="100%"
              height="190"
              src={`https://www.facebook.com/plugins/video.php?href=${link}&width=340&height=190&show_text=false&appId=115391488481724&autoplay=1`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <InvalidFbVideoSVG />
          )}
        </Box>
        <Box
          sx={{
            padding: 3,
            overflowY:"scroll",
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
          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>Lien</Typography>
          <TextField
            variant="standard"
            sx={{ width: "100%", mb: 2 }}
            placeholder="https://"
            value={link}
            onChange={(e) => setLink(e.target.value)}
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
            disabled={!link}
          >
            Ajouter Contenu
          </Button>
        )}
      </Box>
    </Box>
  );
}
