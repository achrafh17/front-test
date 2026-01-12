import React, {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../hooks/useAuth";
//@ts-ignore
import {ReactComponent as LayoutPreviewSVG} from "../../assets/svg/no_preview_layout.svg"
import { ILayout } from "../../types/api.types";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface props {
  onAddLayout: (layoutId: number | null) => void;
  playlistLayoutId: number | null;
  playlistLinkId: number;
}

const DevicePlaylistAddLayout: React.FC<props> = ({
  playlistLinkId,
  playlistLayoutId,
  onAddLayout,
}) => {
  const {userInfo} = useAuth();

  const [initialLayoutId, setInitialLayoutId] = useState<number | null>(playlistLayoutId)

  const [selectedLayoutId, setSelectedLayoutId] = useState<number | null>(
    playlistLayoutId
  ); 

  useEffect(()=>{
    setSelectedLayoutId(playlistLayoutId)
  }, [playlistLayoutId])

  const [layouts, setLayouts] = useState<ILayout[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false)

  const save = async () => {
    //tbd - api call
    setIsLoadingSave(true)
      try {
        let savedLayoutId = selectedLayoutId;
        var payload = {
          sessionId: userInfo?.sessionId,
          linkId: playlistLinkId,
          layoutId: savedLayoutId,
        };

        var res = await fetch(`https://www.powersmartscreen.com/link-device-playlist-layout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        var resJson = await res.json();

        if (resJson.success) {
          onAddLayout(savedLayoutId);
          setInitialLayoutId(savedLayoutId)
        }
      } catch (e) {}
      setIsLoadingSave(false)
  }


  useEffect(() => {
    setIsLoading(true);
    fetch("https://www.powersmartscreen.com/get-layouts?sessionId=" + userInfo?.sessionId)
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          setLayouts(resJson.result as ILayout[]);
        } else {
          //handle error
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [userInfo?.sessionId]);



  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, fontSize: 18 }}>
          Ajouter un Calque
        </Typography>
      </Box>
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            padding: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            py: 2,
            height: "calc(100vh - 60px - 81px - 68px)",
            maxHeight: "calc(100vh - 60px - 81px - 68px)",
            overflowY: "scroll",
          }}
          className="hide-scrollbar"
        >
          {layouts.map((layoutInfo, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  height: 54,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor:
                    selectedLayoutId === layoutInfo.layoutId
                      ? "#f0002052"
                      : "transparent",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor:
                      selectedLayoutId === layoutInfo.layoutId
                        ? "#f0002052"
                        : "#f5f5f5",
                  },
                  px: 3,
                }}
                onClick={() => {
                  if (selectedLayoutId === layoutInfo.layoutId) {
                    setSelectedLayoutId(null);
                  } else {
                    setSelectedLayoutId(layoutInfo.layoutId);
                  }
                }}
              >
                <Box
                  sx={{
                    height: 42,
                    width: 42,
                    borderRadius: 0.4,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ddd",
                    p: 1,
                  }}
                >
                  <LayoutPreviewSVG />
                </Box>
                <Box sx={{ flex: 1, maxWidth: "65%" }}>
                  <Typography sx={{ fontSize: 14 }} noWrap>
                    {layoutInfo.name}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 12, color: "#b2b7b8" }}
                  ></Typography>
                </Box>
                <Box
                  sx={{
                    ml: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selectedLayoutId === layoutInfo.layoutId ? (
                    <CheckCircleIcon
                      sx={{ cursor: "pointer", color: "#ff0020", fontSize: 18 }}
                      onClick={() => {
                        setSelectedLayoutId(null);
                      }}
                    />
                  ) : (
                    <RadioButtonUncheckedIcon
                      sx={{ cursor: "pointer", fontSize: 18 }}
                      onClick={() => {
                        setSelectedLayoutId(layoutInfo.layoutId);
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
      <Box sx={{ px: 3, py: 2 }}>
        {isLoadingSave ? (
           <Box
           sx={{
             width: "100%",
             display: "flex",
             alignItems: "center",
             justifyContent: "center",
           }}
         >
           <CircularProgress />
         </Box>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={save}
            disabled={selectedLayoutId === initialLayoutId}
          >
            Enregistrer
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default DevicePlaylistAddLayout;
