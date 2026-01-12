import { Box } from "@mui/material";
import React from "react";
import { IDevicePlaylist, IDeviceSingle } from "../../types/api.types";
import useAuth from "../../hooks/useAuth";
import DevicePlaylistsListView from "./DevicePlaylistsListView";
import DevicePlaylistsTimelineView from "./DevicePlaylistsTimelineView";
import ChangesTrackerBar from "../Playlists/ChangesTrackerBar"

interface props {
  deviceInfo: IDeviceSingle;
  showContents: boolean;
  showTimeline: boolean;
  sliderValue: number;
  refresh: boolean;
  searchTerm: string;
}

const DevicePlaylistsView: React.FC<props> = ({
  deviceInfo,
  showContents,
  showTimeline,
  sliderValue,
  refresh,
  searchTerm
}) => {
  const { userInfo } = useAuth();
  const [playlists, setPlaylists] = React.useState<IDevicePlaylist[]>([]);
  const [originalPlaylists, setOriginalPlaylists] = React.useState("[]");
  const [changedIdxs, setChangedIdxs] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditable, setIsEditable] = React.useState(true);

  const fetchPlaylists = async (deviceId: number, sessionId: string) => {
    try {
      var res = await fetch(
        `https://www.powersmartscreen.com/get-device-playlists?sessionId=${sessionId}&deviceId=${deviceId}`
      );
      var resJson = await res.json();

      if (resJson.success) {
        var result = resJson.result as IDevicePlaylist[]
        setPlaylists(result);
        setOriginalPlaylists(JSON.stringify(result));
      }
    } catch (e) {}
  };

  const removePlaylist = (linkId: number) => {
    setPlaylists(old => old.filter(p => p.linkId !== linkId));
  }

  const updatePlaylistTimeStart = (
    newTimeStart: string,
    playlistIdx: number
  ) => {
    if(isEditable){
      setPlaylists((old) => {
        var newPlaylists = [...old];
        newPlaylists[playlistIdx].timeStart = newTimeStart;
        return newPlaylists;
      });
      setChangedIdxs((old) => {
        if (old.includes(playlistIdx)) {
          return old;
        }
        return [...old, playlistIdx];
      });
    }
  };

  const updatePlaylistTimeEnd = (newTimeEnd: string, playlistIdx: number) => {
    if(isEditable){

      setPlaylists((old) => {
        var newPlaylists = [...old];
        newPlaylists[playlistIdx].timeEnd = newTimeEnd;
        return newPlaylists;
      });
      setChangedIdxs(old=>{
        if(old.includes(playlistIdx)){
          return old;
        }
        return [...old, playlistIdx]
      })
    }
  };

  const updatePlaylistLayout=(newLayoutId: number | null, playlistIdx: number) => {
    setPlaylists(old => {
      let newPlaylists = [...old];
      newPlaylists[playlistIdx].layoutId = newLayoutId;
      return newPlaylists;
    })
  }

  const cancelChanges = () => {
    setPlaylists(JSON.parse(originalPlaylists) as IDevicePlaylist[]);
    setChangedIdxs([])
  }

  const saveChanges = async () => {
    setIsLoading(true)
    for(let i=0; i<changedIdxs.length; ++i){
      let playlistInfo = playlists[changedIdxs[i]];
      let payload = {
        sessionId: userInfo?.sessionId,
        linkId: playlistInfo.linkId,
        timeStart: playlistInfo.timeStart,
        timeEnd: playlistInfo.timeEnd
      }
      try {
        await fetch("https://www.powersmartscreen.com/update-device-playlist", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {}
      
    }
    setIsLoading(false)
    setChangedIdxs([]);
  }

  React.useEffect(() => {
    var id: number;
    if (deviceInfo.parent) {
      setIsEditable(false);
      id = deviceInfo.parent.deviceId;
    } else {
      setIsEditable(true)
      id = deviceInfo.deviceId;
    }

    if (userInfo?.sessionId) {
      fetchPlaylists(id, userInfo.sessionId);
    }
  }, [deviceInfo, userInfo, refresh]);

  return (
    <Box
      sx={{
        width: "100%",
        px: 3,
        pb: 3,
        overflowX: "scroll",
        maxHeight: "calc(100vh - 60px - 180px - 32px - 28px - 10px)",
        height: "calc(100vh - 60px - 180px - 32px - 28px - 10px)",
        overflowY: "scroll",
      }}
      className="hide-scrollbar"
    >
      {showTimeline ? (
        <DevicePlaylistsTimelineView
        searchTerm={searchTerm}
          playlists={playlists}
          updatePlaylistTimeStart={updatePlaylistTimeStart}
          updatePlaylistTimeEnd={updatePlaylistTimeEnd}
          isEditable={isEditable}
        />
      ) : (
        <DevicePlaylistsListView
        searchTerm={searchTerm}

          playlists={playlists}
          sliderValue={sliderValue}
          showContents={showContents}
          updatePlaylistTimeEnd={updatePlaylistTimeEnd}
          updatePlaylistTimeStart={updatePlaylistTimeStart}
          updatePlaylistLayout={updatePlaylistLayout}
          removePlaylist={removePlaylist}
          isEditable={isEditable}
        />
      )}
      <ChangesTrackerBar 
        isLoading={isLoading}
        numberOfChanges={changedIdxs.length}
        onCancel={cancelChanges}
        onSave={saveChanges}
      />  
    </Box>
  );
};

export default DevicePlaylistsView;
