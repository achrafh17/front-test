import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import IOSSwitch from "../../Common/IOSSwitch";
import { useEffect, useState } from "react";
// @ts-ignore
import { ReactComponent as YoutubeInvalidSVG } from "../../../assets/svg/youtube_invalid.svg";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useStore from "../../../store/store";
import React from "react"
import CustomTimestampInput from "../../Common/CustomTimestampInput";
import CustomSetting from "../../Common/CustomSetting";
import useRSB from "../../../hooks/useRSB";
import AppsDefaultRSB from "./AppsDefaultRSB"

const YoutubeRSB: React.FC<{}> = () => {
  const { userInfo } = useAuth();
  const {setRsbVariant} = useRSB();
  const [isLoading, setIsLoading] = useState(false);
  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [isValid, setIsValid] = useState(false);

  const [name, setName] = useState("Youtube");
  const [link, setLink] = useState("");
  const [isMute, setIsMute] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [startAt, setStartAt] = useState({
    h: 0,
    m: 0,
    s: 0,
  });
  const [endAt, setEndAt] = useState({
    h: 0,
    m: 0,
    s: 0,
  });
  const [computedStartAt, setComputedStartAt] = useState(0);
  const [computedEndAt, setComputedEndAt] = useState(0);
  const [isEndAtActive, setIsEndAtActive] = useState(false)

  const extractVideoId = async (
    link: string
  ): Promise<
    { success: true; vId: string } | { success: false; reason: string }
  > => {
    try {
      var res = await fetch(`https://www.youtube.com/oembed?url=${link}`);
      if (res.status === 400) {
        // bad request
        return {
          success: false,
          reason: "Bad Request",
        };
      }
      var resJson = await res.json();
      if (resJson.html) {
        // '<iframe width="200" height="113" src="https://www.youtube.com/embed/yZv2daTWRZU?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen title="Somos informação | Nerdologia"></iframe>'
        let html = `${resJson.html}`;
        let srcAttribute = html
          .split(" ")
          .filter((part) => part.startsWith("src"))[0];
        let embedLink = srcAttribute.split("=")[1];
        const regex = /\/embed\/([^\?]+)/;
        const match = embedLink.match(regex);
        if (match && match[1]) {
          return {
            success: true,
            vId: match[1],
          };
        } else {
          return {
            success: false,
            reason: "Bad Request",
          };
        }
      } else {
        return {
          success: false,
          reason: "Bad Request",
        };
      }
    } catch (e) {
      return {
        success: false,
        reason: "Error",
      };
    }
  };

/*   const processLink = async (l: string) => {
    // extract video id

    let result = await extractVideoId(l);
    if (result.success === true) {
      let vId = result.vId;
      setVideoId(vId);
      setIsValid(true);
    } else {
      setIsValid(false);
      setVideoId("");
    }
  }; */

  useEffect(() => {
    const processLink = async (l: string) => {
      // extract video id
  
      let result = await extractVideoId(l);
      if (result.success === true) {
        let vId = result.vId;
        setVideoId(vId);
        setIsValid(true);
      } else {
        setIsValid(false);
        setVideoId("");
      }
    };
    var t = setTimeout(() => {
      if (link) processLink(link);
    }, 700);
    return () => {
      clearTimeout(t);
    };
  }, [link]);

  useEffect(() => {
    var t = setTimeout(() => {
      setComputedStartAt(startAt.h * 3600 + startAt.m * 60 + startAt.s);
    }, 700);
    return () => {
      clearTimeout(t);
    };
  }, [startAt]);

  useEffect(() => {
    var t = setTimeout(() => {
      setComputedEndAt(endAt.h * 3600 + endAt.m * 60 + endAt.s);
    }, 700);
    return () => {
      clearTimeout(t);
    };
  }, [endAt]);

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
        type: "Youtube",
        info: {
          videoId: videoId,
          startAt: computedStartAt,
          endAt: computedEndAt
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
        setName("Youtube");
        setLink("");
        setIsMute(false);
        setVideoId("");
        setStartAt({
          h: 0,
          m: 0,
          s: 0,
        });
        setEndAt({
          h: 0,
          m: 0,
          s: 0,
        });
        
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
          }}
        >
          {isValid && !!videoId ? (
            <iframe
              title="youtube_preview"
              width="100%"
              height="190"
              src={`https://www.youtube.com/embed/${videoId}?&autoplay=1&frameborder=0&controls=0&rel=0&mute=${
                isMute ? 1 : 0
              }&start=${computedStartAt}&end=${
                isEndAtActive ? computedEndAt : 0
              }`}
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              style={{ border: "none" }}
            ></iframe>
          ) : (
            <YoutubeInvalidSVG width="100%" />
          )}
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
          <TextField
            variant="standard"
            sx={{ width: "100%", mb: 2 }}
            label="lien de la vidéo youtube"
            value={link}
            placeholder="https://"
            onChange={(e) => setLink(e.target.value)}
          />

          {isValid && !!videoId ? (
            <>
              <Box sx={{ width: "100%" }}>
                <Typography sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 12 }}>
                  Commencer à
                </Typography>
                <CustomTimestampInput
                  timestamp={startAt}
                  setTimestamp={setStartAt}
                />
              </Box>

              <CustomSetting
                renderBody={() => (
                  <Box sx={{ width: "100%", paddingTop: 2 }}>
                    <Typography
                      sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: 12 }}
                    >
                      Arrêter à
                    </Typography>
                    <CustomTimestampInput
                      timestamp={endAt}
                      setTimestamp={setEndAt}
                    />
                  </Box>
                )}
                title="Arrêter la vidéo "
                active={isEndAtActive}
                setActive={(activeState) => {
                  if (activeState === false) {
                    setEndAt({ h: 0, m: 0, s: 0 });
                  }
                  setIsEndAtActive(activeState);
                }}
                initiallyOpen={true}
              />
            </>
          ) : (
            <p style={{ fontSize: 12, color: "#F00020", marginBottom: 16 }}>
              Entrez un lien youtube valide
            </p>
          )}

          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <IOSSwitch
              checked={isMute}
              onChange={(e) => {
                setIsMute(e.target.checked);
              }}
            />
            <Typography
              sx={{ fontSize: 18, color: "#b2b7b8", cursor: "pointer", pl: 2 }}
              onClick={() => {
                setIsMute((old) => !old);
              }}
            >
              Assoudir
            </Typography>
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
            disabled={!isValid || !videoId}
            onClick={save}
          >
            Ajouter Contenu
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default YoutubeRSB;
