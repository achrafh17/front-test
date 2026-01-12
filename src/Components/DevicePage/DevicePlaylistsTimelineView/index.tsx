import React from "react"
import {IDevicePlaylist} from "../../../types/api.types"
import Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DevicePlaylistTimelineRow from "./DevicePlaylistTimelineRow"

const TIME = [
  "2:00",
  "4:00",
  "6:00",
  "8:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "",
];

interface props {
  playlists: IDevicePlaylist[];
  updatePlaylistTimeStart: (newTimeStart: string, playlistIdx: number) => void;
  updatePlaylistTimeEnd: (newTimeEnd: string, playlistIdx: number) => void;
  isEditable: boolean;
  searchTerm: string;
}

  const DevicePlaylistsTimelineView: React.FC<props> = ({
    playlists,
    updatePlaylistTimeEnd,
    updatePlaylistTimeStart,
    isEditable,
    searchTerm
  }) => {

    return (
      <>
        <Typography variant="h6" sx={{ color: "#575b5c", mb: 1 }}>
          CHRONOLOGIE
        </Typography>
        <Box
          sx={{
            maxWidth: "100%",
            minWidth: 1100,
            border: "2px solid #F3F3F3",
            borderRadius: 2,
          }}
        >
          {/* header row */}
          <Box
            sx={{
              borderBottom: "2px solid #f3f3f3",
              display: "flex",
              alignItems: "center",
              height: 68,
            }}
          >
            <Box
              sx={{
                px: 2,
                width: 200,
                borderRight: "2px solid #f3f3f3",
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography>Playlists</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                flex: 1,
              }}
            >
              {TIME.map((time, idx) => {
                return (
                  <Box
                    key={idx}
                    sx={{
                      height: 68,
                      width: "8.33333333%",
                      borderLeft: idx === 0 ? undefined : "2px solid #f3f3f3",
                      position: "relative",
                    }}
                  >
                    {time !== "" && (
                      <Box
                        sx={{
                          position: "absolute",
                          backgroundColor: "white",
                          top: "50%",
                          left: "100%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 10,
                          padding: 1,
                        }}
                      >
                        {time}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* playlists rows */}
          {playlists.map((playlist, idx) => {
            if(!playlist.name.includes(searchTerm)){
              return <div key={idx}></div>
            }
            return (
              <DevicePlaylistTimelineRow
                key={idx}
                name={playlist.name}
                timeStart={playlist.timeStart}
                timeEnd={playlist.timeEnd}
                borderTop={idx !== 0}
                updatePlaylistTimeStart={(newTimeStart: string) => {
                  updatePlaylistTimeStart(newTimeStart, idx);
                }}
                updatePlaylistTimeEnd={(newTimeEnd: string) => {
                  updatePlaylistTimeEnd(newTimeEnd, idx);
                }}
                isEditable={isEditable}
              />
            );
          })}
        </Box>
      </>
    );
  };

  export default DevicePlaylistsTimelineView;