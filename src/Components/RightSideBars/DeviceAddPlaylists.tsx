import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
// @ts-ignore
import { ReactComponent as AddSvg } from "../../assets/svg/add-active.svg";
import dayjs from "dayjs";

import { IPlaylistInfo } from "../../types/api.types";
import EditTimelineDialog from "../Schedule/EditTimelineDialog";
interface props {
  deviceId: number;
  onSuccess: () => void;
}

const DeviceAddPlaylist: React.FC<props> = ({ deviceId, onSuccess }) => {
  var { userInfo } = useAuth();
  const [playlists, setPlaylists] = useState<IPlaylistInfo[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(
    null,
  );
  const fetchPlaylists = (sessionId: string) => {
    fetch(
      `https://www.powersmartscreen.com/get-playlists?sessionId=${sessionId}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          setPlaylists(resJson.result as IPlaylistInfo[]);
        } else {
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (userInfo?.sessionId) {
      fetchPlaylists(userInfo?.sessionId);
    }
  }, [userInfo?.sessionId]);

  const onTimelineSave = async (timeStart: string, timeEnd: string) => {
    var playlistInfo = playlists.find(
      (p) => p.playlistId === selectedPlaylistId,
    );
    if (playlistInfo !== undefined) {
      var payload = {
        sessionId: userInfo?.sessionId,
        deviceIds: [deviceId],
        playlistId: playlistInfo.playlistId,
        timeEnd,
        timeStart,
      };

      try {
        var res = await fetch(
          "https://www.powersmartscreen.com/link-playlist-device",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        var resJson = await res.json();

        if (resJson.success) {
          onSuccess();
        }
      } catch (e) {}
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
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
          Ajouter une Playlist
        </Typography>
      </Box>
      <Box
        sx={{
          height: 41,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid #d9dfe0",
          py: 1,
          px: 2,
        }}
      >
        <input
          type="text"
          style={{
            border: "none",
            outline: "none",
            height: "100%",
            flex: 1,
            maxWidth: "75%",
            fontSize: 16,
            lineHeight: 1,
            color: "#575b5c",
          }}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          placeholder="Rechercher..."
        />
      </Box>
      <Box
        sx={{
          maxHeight: "calc(100% - 41px - 80px)",
          height: "calc(100% - 41px - 80px)",
          width: "100%",
          padding: 3,
          overflowY: "scroll",
        }}
        className="hide-scrollbar"
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={24} />
          </Box>
        ) : (
          playlists.map((p, idx) => {
            if (!p.name.includes(searchValue)) {
              return <div key={idx}></div>;
            }
            return (
              <Box
                sx={{
                  height: 45,
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 1,
                  mb: 1.5,
                  borderBottom: "1px solid #d1d1d1",
                  pb: 0.5,
                }}
                key={idx}
              >
                <Box
                  sx={{
                    height: "100%",
                    flex: 1,
                    maxWidth: "80%",
                  }}
                >
                  <Typography
                    noWrap
                    sx={{
                      height: 22,
                      lineHeight: "22px",
                      color: "#3f4242",
                      fontSize: 16,
                      maxWidth: "100%",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {p.name}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{
                      height: 18,
                      lineHeight: "18px",
                      fontSize: 12,
                      color: "#b2b7b8",
                    }}
                  >
                    Durée totale:{" "}
                    {dayjs((p.totalDuration ?? 0) * 1000 || 0).format(
                      "HH:mm:ss",
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "20%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: 24,
                    }}
                  >
                    <AddSvg
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedPlaylistId(p.playlistId);
                        setOpen(true);
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
      <EditTimelineDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        addscheduleByPlaylistOrDevice={true}
        onSave={onTimelineSave}
        title={""}
        selectedDevices={[deviceId]}
        playlistId={selectedPlaylistId}
        editSchedule={null}
      />
    </Box>
  );
};

export default DeviceAddPlaylist;
