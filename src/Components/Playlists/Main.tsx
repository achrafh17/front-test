import React, { useCallback, useEffect, useState } from "react";
import AddPlaylistDialog from "./AddPlaylistDialog";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import useSliderValue from "../../hooks/useSliderValue";
import { styled } from "@mui/material/styles";
//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
//@ts-ignore
import { ReactComponent as HideTileActiveSVG } from "../../assets/svg/hide-tile-active.svg";
//@ts-ignore
import { ReactComponent as ShowTileActiveSVG } from "../../assets/svg/show-tile-active.svg";
import useAuth from "../../hooks/useAuth";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ChangesTrackerBar from "./ChangesTrackerBar";
import PlaylistList from "./PlaylistList";
import "../../styles/Playlists.css";
import useRSB from "../../hooks/useRSB";
import { IContent, IPlaylistInfo, PlaylistContent, PlaylistDevice } from "../../types/api.types";
import PlaylistDefaultRSB from "../RightSideBars/PlaylistDefaultRSB";
import DeletePlaylistDialog from "./DeletePlaylistDialog";
import useStore from "../../store/store";

export default function Main() {
  const { userInfo } = useAuth();

  const setErrorMsg = useStore(state => state.setErrorMsg)

  const [open, setOpen] = useState(false);
  const [showAllPlaylistContents, setShowAllPlaylistContents] = useState(false);

  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [playlists, setPlaylists] = useState<IPlaylistInfo[]>([]);
  const [changedIdxs, setChangedIdxs] = useState<number[]>([]);
  const [selectedPlaylistIdToDelete, setSelectedPlaylistIdToDelete] = useState<
    number | null
  >(null);

  const handleAddPlaylistPress = useCallback(() => {
    if (userInfo?.privileges.playlists !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setOpen(true);
  }, [userInfo, setErrorMsg]);

  const fetchPlaylists = (sessionId: string) => {
    fetch(`https://www.powersmartscreen.com/get-playlists?sessionId=${sessionId}`)
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

  const removePlaylist = (playlistId: number) => {
    setPlaylists((old) => {
      return [...old].filter((p) => p.playlistId !== playlistId);
    });
  };

  // trigger changedIds
  const updatePlaylistName = (newName: string, playlistIndex: number) => {
    setPlaylists((old) => {
      var newPlaylists = [...old];
      newPlaylists[playlistIndex].name = newName;
      return newPlaylists;
    });
    setChangedIdxs((old) => {
      if (old.includes(playlistIndex)) return old;
      return [...old, playlistIndex];
    });
  };

  // trigger changedIds
  const updateContentDuration = (
    newDuration: number,
    contentIdx: number,
    playlistIndex: number
  ) => {
    setPlaylists((old) => {
      var newPlaylists = [...old];
      newPlaylists[playlistIndex].contents.forEach((content, idx) => {
        if (idx === contentIdx) {
          content.linkDuration = newDuration;
        }
      });
      return newPlaylists;
    });
    setChangedIdxs((old) => {
      if (old.includes(playlistIndex)) return old;
      return [...old, playlistIndex];
    });
  };

  const setNewSortedContents = (
    sortedContents: PlaylistContent[],
    playlistIndex: number
  ) => {
    setPlaylists((old) => {
      var newPlaylists = [...old];
      newPlaylists[playlistIndex].contents = sortedContents.map((c, idx) => ({...c, sequence: idx+1}))
      return newPlaylists;
    });
    setChangedIdxs((old) => {
      if (old.includes(playlistIndex)) return old;
      return [...old, playlistIndex];
    });
  }

  // trigger changedIds
  const addContentsToPlaylist = (
    newContents: (IContent & { linkDuration: number })[],
    playlistIndex: number
  ) => {
    setPlaylists((old) => {
      var newPlaylists = [...old];
      let len = newPlaylists[playlistIndex].contents.length;
      newPlaylists[playlistIndex].contents = newPlaylists[
        playlistIndex
      ].contents.concat(
        newContents.map((contentObject, idx) => {
          return {
            ...contentObject,
            sequence: len + idx + 1,
            linkId: Number.MAX_SAFE_INTEGER - idx - 1,
          };
        })
      );
      return newPlaylists;
    });
    setChangedIdxs((old) => {
      if (old.includes(playlistIndex)) return old;
      return [...old, playlistIndex];
    });
  };

  // trigger changedIds
  const removeContentFromPlaylist = (
    contentIdx: number,
    playlistIndex: number
  ) => {
    if(userInfo?.privileges.playlists !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setPlaylists((old) => {
      var newPlaylists = [...old];
          newPlaylists[playlistIndex].contents = newPlaylists[playlistIndex].contents.filter(
            (_c, idx) => idx !== contentIdx
          );
      return newPlaylists;
    });
    setChangedIdxs((old) => {
      if (old.includes(playlistIndex)) return old;
      return [...old, playlistIndex];
    });
  };

  // doesn't trigger changedIds - persist
  const addDevicesToPlaylist = (
    newDevices: PlaylistDevice[],
    playlistIndex: number
  ) => {
    setPlaylists((old) => {
      var newPlaylists = [...old];
      newPlaylists[playlistIndex].devices =
            newPlaylists[playlistIndex].devices.concat(newDevices);
      var len = newPlaylists[playlistIndex].devices.length;
      newPlaylists[playlistIndex].numberOfScreens = len;
      return newPlaylists;
    });
  };

  const handleDeletePlaylist = (playlistId: number) => {
    if(userInfo?.privileges.playlists !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setSelectedPlaylistIdToDelete(playlistId);
  };

  const handleDuplicatePlaylist = async (playlistId: number) => {
    if(userInfo?.privileges.playlists !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    if (userInfo?.sessionId) {
      try {
        var res = await fetch("https://www.powersmartscreen.com/duplicate-playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sessionId: userInfo?.sessionId,
            playlistId: playlistId,
          }),
        });

        var resJson = await res.json();

        if (resJson.success) {
          var duplicatePlaylist = resJson.result as IPlaylistInfo;
          setPlaylists((old) => [...old, duplicatePlaylist]);
        }
      } catch (e) {}
    }
  };

  const cancelChanges = () => {
    if (userInfo?.sessionId) {
      setChangedIdxs([]);
      fetchPlaylists(userInfo?.sessionId);
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    for (let i = 0; i < changedIdxs.length; i++) {
      let playlistInfo = playlists[changedIdxs[i]]
      let payload = {
        sessionId: userInfo?.sessionId,
        playlistInfo: playlistInfo,
      };
      try {
        await fetch("https://www.powersmartscreen.com/update-playlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (e) {}
    }
    setIsLoading(false);
    setChangedIdxs([]);
  };

  useEffect(() => {
    if (userInfo?.sessionId) {
      setIsLoading(true);
      fetchPlaylists(userInfo?.sessionId);
    }
  }, [userInfo?.sessionId]);


  const { setRsbVariant } = useRSB();
  useEffect(() => {
    setRsbVariant({
      name: "PLAYLIST_DEFAULT",
      renderComponent: () => (
        <PlaylistDefaultRSB
          addPlaylist={handleAddPlaylistPress}
        />
      ),
    });
  }, [setRsbVariant, handleAddPlaylistPress]);

  return (
    <div className="main-screen">
      <div className="main-screen-top">
        <div className="search">
          <SearchSvg fill="none" stroke="#bec4c4" />
          <input
            type="text"
            placeholder="Commencer à taper pour chercher des playlists..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
            }} 
          />
        </div>
        <CustomSlider
          sx={{ width: 100, color: "#bec4c4", mx: 1 }}
          step={1}
          min={2}
          max={sliderMax}
          size="small"
          value={sliderValue}
          onChange={(e) => {
            if (e?.target) {
              //@ts-ignore
              setSliderValue(e.target.value);
            }
          }}
        />
        <Tooltip
          title={
            <Typography
              fontSize={12}
              sx={{ textAlign: "center", maxWidth: 200 }}
            >
              Masquer ou afficher le contenu de toutes les playlists
            </Typography>
          }
          placement="top"
          arrow
          className="hover-dark fill"
          onClick={() => {
            setShowAllPlaylistContents((old) => !old);
          }}
        >
          {showAllPlaylistContents ? (
            <HideTileActiveSVG
              fill="#3f4242"
              stroke="#3f4242"
              cursor="pointer"
            />
          ) : (
            <ShowTileActiveSVG
              fill="#3f4242"
              stroke="#3f4242"
              cursor="pointer"
            />
          )}
        </Tooltip>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddPlaylistPress}
        >
          Ajouter une playlist
        </Button>
      </div>
      <PlaylistList
        searchTerm={searchTerm}
        isLoading={isLoading}
        showAllPlaylistContents={showAllPlaylistContents}
        sliderValue={sliderValue}
        playlists={playlists}
        addPlaylist={handleAddPlaylistPress}
        updatePlaylistName={updatePlaylistName}
        updateContentDuration={updateContentDuration}
        setNewSortedContents={setNewSortedContents}
        addContentsToPlaylist={addContentsToPlaylist}
        removeContentFromPlaylist={removeContentFromPlaylist}
        addDevicesToPlaylist={addDevicesToPlaylist}
        handleDeletePlaylist={handleDeletePlaylist}
        handleDuplicatePlaylist={handleDuplicatePlaylist}
      />
      <ChangesTrackerBar
        numberOfChanges={changedIdxs.length}
        isLoading={isLoading}
        onSave={saveChanges}
        onCancel={cancelChanges}
      />
      <AddPlaylistDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onSave={(addedPlaylist) => {
          setPlaylists((old) => [...old, addedPlaylist]);
        }}
      />
      {selectedPlaylistIdToDelete !== null && (
        <DeletePlaylistDialog
          open={selectedPlaylistIdToDelete !== null}
          onClose={() => {
            setSelectedPlaylistIdToDelete(null);
          }}
          playlistId={selectedPlaylistIdToDelete}
          onDelete={(deletedId: number) => {
            removePlaylist(deletedId);
            setSelectedPlaylistIdToDelete(null);
          }}
        />
      )}
    </div>
  );
}

const CustomSlider = styled(Slider)({
  height: 3,
  "& .MuiSlider-track": {
    border: "none",
    height: 3,
  },
  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "white",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
});
