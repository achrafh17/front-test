import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import MoreHorizontalFilters from "../MoreHorizontalFilters";
import Playlist from "./Playlist";
import PlaylistAddContentRSB from "../RightSideBars/PlaylistAddContentRSB";
import PlaylistAddScreenRSB from "../RightSideBars/PlaylistAddScreenRSB";
import PlaylistDefaultRSB from "../RightSideBars/PlaylistDefaultRSB";
import useRSB from "../../hooks/useRSB";
import Skeleton from "@mui/material/Skeleton";
import {
  IPlaylistInfo,
  IContent,
  PlaylistDevice,
  PlaylistContent,
} from "../../types/api.types";
import useAuth from "../../hooks/useAuth";
import useStore from "../../store/store";

interface props {
  searchTerm: string;
  isLoading: boolean;
  showAllPlaylistContents: boolean;
  sliderValue: number;
  playlists: IPlaylistInfo[];
  updatePlaylistName: (newName: string, playlistIndex: number) => void;
  updateContentDuration: (
    newDuration: number,
    contentIdx: number,
    playlistIndex: number,
  ) => void;
  setNewSortedContents: (
    sortedContents: PlaylistContent[],
    playlistIndex: number,
  ) => void;
  addContentsToPlaylist: (
    newContents: (IContent & { linkDuration: number })[],
    playlistIndex: number,
  ) => void;
  removeContentFromPlaylist: (
    contentIdx: number,
    playlistIndex: number,
  ) => void;
  addDevicesToPlaylist: (
    newDevices: PlaylistDevice[],
    playlistIndex: number,
  ) => void;
  handleDeletePlaylist: (playlistId: number) => void;
  handleDuplicatePlaylist: (playlistId: number) => void;
  addPlaylist: () => void;
}

const PlaylistList: React.FC<props> = ({
  searchTerm,
  isLoading,
  showAllPlaylistContents,
  sliderValue,
  playlists,
  updatePlaylistName,
  updateContentDuration,
  setNewSortedContents,
  addContentsToPlaylist,
  removeContentFromPlaylist,
  addDevicesToPlaylist,
  handleDeletePlaylist,
  handleDuplicatePlaylist,
  addPlaylist,
}) => {
  const { setRsbVariant } = useRSB();
  const { userInfo } = useAuth();

  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [selectedIndexForScreenRSB, setSelectedIndexForScreenRSB] = useState<
    number | null
  >(null);
  const [selectedIndexForContentRSB, setSelectedIndexForContentRSB] = useState<
    number | null
  >(null);

  const handleAddContentPress = (playlistIndex: number) => {
    if (userInfo?.privileges.playlists !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedIndexForScreenRSB(null);
    setSelectedIndexForContentRSB(playlistIndex);
    setRsbVariant({
      name: "PLAYLIST_ADD_CONTENT",
      renderComponent: () => (
        <PlaylistAddContentRSB
          onNewContents={(
            newContents: (IContent & { linkDuration: number })[],
          ) => {
            addContentsToPlaylist(newContents, playlistIndex);
          }}
        />
      ),
    });
  };

  const handleAddScreenPress = (playlistIndex: number) => {
    if (userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedIndexForContentRSB(null);
    setSelectedIndexForScreenRSB(playlistIndex);
    setRsbVariant({
      name: "PLAYLIST_ADD_SCREEN",
      renderComponent: () => (
        <PlaylistAddScreenRSB
          playlistName={playlists[playlistIndex].name}
          playlist={playlists[playlistIndex]}
          playlistDevices={playlists[playlistIndex].devices}
          onAddedDevices={(newDevices) => {
            addDevicesToPlaylist(newDevices, playlistIndex);
          }}
        />
      ),
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "calc(100vh - 60px - 80px - 16px)",
      }}
    >
      <Grid
        container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        columnSpacing={1}
        sx={{ height: 32, my: 2, px: 3 }}
      >
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="h1">
            Playlists
          </Typography>
        </Grid>
        <MoreHorizontalFilters />
      </Grid>
      <Grid
        container
        // flexDirection="column"
        sx={{
          ml: 0,
          maxHeight: "calc(100vh - 60px - 80px - 32px - 28px)",
          overflowY: "scroll",
          pt: 1,
          pb: "68px", //height of slide-top|slide-bottom that shows onchange
        }}
        className="hide-scrollbar"
      >
        {isLoading ? (
          <>
            <Skeleton
              sx={{ width: "100%", height: 80, mx: 3, mb: 2 }}
              animation="wave"
              variant="rectangular"
            />
            <Skeleton
              sx={{ width: "100%", height: 80, mx: 3 }}
              animation="wave"
              variant="rectangular"
            />
          </>
        ) : (
          playlists.map((playlistInfo, idx) => {
            if (
              !playlistInfo.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return <div key={idx}></div>;
            }
            return (
              <Playlist
                key={idx}
                playlistInfo={playlistInfo}
                showContents={showAllPlaylistContents}
                sliderValue={sliderValue}
                openRSB={
                  selectedIndexForContentRSB === idx
                    ? "content"
                    : selectedIndexForScreenRSB === idx
                      ? "screen"
                      : null
                }
                onPlaylistNameChange={(newName: string) => {
                  updatePlaylistName(newName, idx);
                }}
                onAddContentPress={() => {
                  handleAddContentPress(idx);
                }}
                onAddScreenPress={() => {
                  handleAddScreenPress(idx);
                }}
                onSortContents={(sortedContents: PlaylistContent[]) => {
                  setNewSortedContents(sortedContents, idx);
                }}
                onContentDurationChange={(newDuration, contentIdx) => {
                  updateContentDuration(newDuration, contentIdx, idx);
                }}
                onDeleteContentPress={(contentIdx) => {
                  removeContentFromPlaylist(contentIdx, idx);
                }}
                onDeletePlaylist={() => {
                  setSelectedIndexForContentRSB(null);
                  setSelectedIndexForScreenRSB(null);
                  setRsbVariant({
                    name: "PLAYLIST_DEFAULT",
                    renderComponent: () => (
                      <PlaylistDefaultRSB addPlaylist={addPlaylist} />
                    ),
                  });
                  handleDeletePlaylist(playlistInfo.playlistId);
                }}
                onDuplicatePlaylist={() => {
                  handleDuplicatePlaylist(playlistInfo.playlistId);
                }}
              />
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default PlaylistList;
