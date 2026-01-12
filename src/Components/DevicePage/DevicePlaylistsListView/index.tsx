import { Box } from "@mui/material";
import React, { useState } from "react";
import { IDevicePlaylist } from "../../../types/api.types";
import DevicePlaylist from "./DevicePlaylist";
import UnlinkPlaylistDialog from "../UnlinkPlaylistDialog";
import useRSB from "../../../hooks/useRSB";
import DevicePlaylistAddLayout from "../../RightSideBars/DevicePlaylistAddLayout";
import useAuth from "../../../hooks/useAuth";
import useStore from "../../../store/store";

interface props {
  playlists: IDevicePlaylist[];
  showContents: boolean;
  sliderValue: number;
  isEditable: boolean;
  updatePlaylistTimeStart: (newTimeStart: string, playlistIdx: number) => void;
  updatePlaylistTimeEnd: (newTimeEnd: string, playlistIdx: number) => void;
  updatePlaylistLayout: (newLayoutId: number | null, playlistIdx: number) => void;
  removePlaylist: (linkId: number) => void;
  searchTerm: string;
}

const DevicePlaylistsListView: React.FC<props> = ({
  playlists,
  showContents,
  sliderValue,
  isEditable,
  updatePlaylistTimeEnd,
  updatePlaylistTimeStart,
  updatePlaylistLayout,
  removePlaylist,
  searchTerm,
}) => {
  const { setRsbVariant } = useRSB();
  const {userInfo} = useAuth();
  const [selectedLinkIdToDelete, setSelectedLinkIdToDelete] = useState<
    number | null
  >(null);
  const [selectedPlaylistIdxForLayoutRSB, setSelectedPlaylistIdxForLayoutRSB] =
    useState<number | null>(null);

    const setErrorMsg = useStore((state) => state.setErrorMsg);

  const handleAddLayoutPress = (playlistIdx: number) => {
    if(userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedPlaylistIdxForLayoutRSB(playlistIdx);
    setRsbVariant({
      name: "ADD_LAYOUT",
      renderComponent: () => (
        <DevicePlaylistAddLayout
          playlistLinkId={playlists[playlistIdx].linkId}
          playlistLayoutId={playlists[playlistIdx].layoutId}
          onAddLayout={(newLayoutId: number | null) => {
            updatePlaylistLayout(newLayoutId, playlistIdx);
          }}
        />
      ),
    });
  };

  const handleDeletePlaylist = (playlistIdx: number) => {
    if(userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedPlaylistIdxForLayoutRSB(null)
    setSelectedLinkIdToDelete(playlists[playlistIdx].linkId);
  };

  return (
    <>
      <Box>
        {playlists.map((playlist, idx) => {
          if (!playlist.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return <div key={idx}></div>;
          }
          return (
            <DevicePlaylist
              key={idx}
              playlist={playlist}
              isLayoutRsbOpen={selectedPlaylistIdxForLayoutRSB === idx}
              showContents={showContents}
              onAddLayoutPress={() => {
                handleAddLayoutPress(idx);
              }}
              onDeletePlaylist={() => {
                handleDeletePlaylist(idx);
              }}
              sliderValue={sliderValue}
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
      {selectedLinkIdToDelete && (
        <UnlinkPlaylistDialog
          linkId={selectedLinkIdToDelete}
          open={true}
          onClose={() => {
            setSelectedLinkIdToDelete(null);
          }}
          onDelete={(linkId) => {
            removePlaylist(linkId);
            setSelectedLinkIdToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default DevicePlaylistsListView;
