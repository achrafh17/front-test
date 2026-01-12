import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Tooltip from "@mui/material/Tooltip";
//@ts-ignore
// import { ReactComponent as WidgetSVG } from "../../assets/svg/widgets.svg";
//@ts-ignore
import { ReactComponent as AddSVG } from "../../assets/svg/add-current-color.svg";
//@ts-ignore
import { ReactComponent as ShareToDeviceSVG } from "../../assets/svg/share-to-device.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVert from "@mui/icons-material/MoreVert";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import PlaylistContentList from "./PlaylistContentList";
import ContentIcon from "../Common/ContentIcon";
import { IPlaylistInfo, PlaylistContent } from "../../types/api.types";
import useAuth from "../../hooks/useAuth";
import useStore from "../../store/store"

interface props {
  playlistInfo: IPlaylistInfo;
  showContents: boolean;
  openRSB: "screen" | "content" | null;
  sliderValue: number;
  onSortContents: (sortedContents: PlaylistContent[]) => void;
  onAddContentPress: () => void;
  onDeleteContentPress: (contentIdx: number) => void;
  onAddScreenPress: () => void;
  onPlaylistNameChange: (newName: string) => void;
  onContentDurationChange: (newDuration: number, contentIdx: number) => void;
  onDeletePlaylist: () => void;
  onDuplicatePlaylist: () => void;
}

const Playlist: React.FC<props> = ({
  playlistInfo,
  showContents,
  openRSB,
  sliderValue,
  onSortContents,
  onAddContentPress,
  onDeleteContentPress,
  onAddScreenPress,
  onPlaylistNameChange,
  onContentDurationChange,
  onDeletePlaylist,
  onDuplicatePlaylist,
}) => {
  const { userInfo } = useAuth();

  const {setErrorMsg, setSuccessMsg} = useStore((state)=>{
    return {
      setErrorMsg: state.setErrorMsg,
      setSuccessMsg: state.setSuccessMsg,
    };
  })

  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    setExpanded(showContents);
  }, [showContents]);

  const [showOptions, setShowOptions] = useState(false);

  const [anchorElement, setAnchorElement] = useState<EventTarget | null>(null);
  const menuOpen = Boolean(anchorElement);

  const handleOpenMenu = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorElement(e.target);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  const handleContentDurationChange = (
    durationAsDate: Date,
    contentIdx: number
  ) => {
    onContentDurationChange(
      durationAsDate.getHours() * 3600 +
        durationAsDate.getMinutes() * 60 +
        durationAsDate.getSeconds(),
      contentIdx
    );
  };

  const handleDeleteContent = (contentIdx: number) => {
    onDeleteContentPress(contentIdx);
  };

  const handleNotifyScreens = () => {
    fetch(`https://www.powersmartscreen.com/notify-playlist-devices?playlistId=${playlistInfo.playlistId}&sessionId=${userInfo?.sessionId}`).then(res => res.json())
    .then(resJson => {
      if(resJson.success) {
        setSuccessMsg("Les écrans connectés à cette playlists ont été notifiés.")
        setTimeout(() => {
          setSuccessMsg(null);
        }, 1700);
      }else{
        setErrorMsg("Nous n'avons pas pu notifier les écrans. Veuillez réessayer.")
        setTimeout(() => {
          setErrorMsg(null);
        }, 1700);
      }
    }).catch(e => {
      setErrorMsg("Une erreur est survenue. Veuillez réessayer.")
      setTimeout(() => {
        setErrorMsg(null);
      }, 1700);

    })
  };

  useEffect(() => {
    if (expanded) {
      setShowOptions(true);
    }
  }, [expanded]);

  const [thumbnails, setThumbnails] = useState<
    {
      type: string;
      path: string | null;
      title: string;
      appInfo: string | null;
    }[]
  >([]);

  useEffect(() => {
    var paths = playlistInfo.contents.slice(0, 4).map((playlistContent) => {
      return {
        title: playlistContent.title,
        type: playlistContent.type,
        path: playlistContent.previewPath,
        appInfo: playlistContent.appInfo
      };
    });
    setThumbnails(paths);
  }, [playlistInfo.contents]);

  const [name, setName] = useState("");
  useEffect(() => {
    setName(playlistInfo?.name);
  }, [playlistInfo?.name]);

  return (
    <>
      <Grid
        key={playlistInfo.playlistId}
        item
        sx={{ mb: 3, mx: expanded ? 0 : 3 }}
        className={`playlist-entity ${expanded && "expanded"}`}
        onMouseEnter={() => {
          setShowOptions(true);
        }}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
      >
        <Box
          onClick={() => {
            setExpanded((old) => !old);
          }}
          className={`playlist-thumbnail ${expanded ? "fade-out" : "fade-in"}`}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#d9dfe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {thumbnails.length > 0 && (
              <ContentIcon
              
                title={thumbnails[0].title}
                type={thumbnails[0].type}
                path={thumbnails[0].path}
                appInfo={thumbnails[0].appInfo}
              />
            )}
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#d9dfe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {thumbnails.length > 1 && (
              <ContentIcon
                title={thumbnails[1].title}
                type={thumbnails[1].type}
                path={thumbnails[1].path}
                appInfo={thumbnails[1].appInfo}
              />
            )}
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#d9dfe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {thumbnails.length > 2 && (
              <ContentIcon
                title={thumbnails[2].title}
                type={thumbnails[2].type}
                path={thumbnails[2].path}
                appInfo={thumbnails[2].appInfo}
              />
            )}
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "#d9dfe0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {thumbnails.length > 3 && (
              <ContentIcon
                title={thumbnails[3].title}
                type={thumbnails[3].type}
                path={thumbnails[3].path}
                appInfo={thumbnails[3].appInfo}
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            my: "-7px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
          onClick={() => {
            setExpanded((old) => !old);
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Typography variant="body1" as="p">
              {playlistInfo.name}{" "}
            </Typography> */}
            <input
              disabled={userInfo?.privileges.playlists !== true}
              className="stripped-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={() => {
                onPlaylistNameChange(name);
              }}
              style={{ width: "50%" }}
            />
          </Box>
          <Typography sx={{ fontSize: 12, color: "#b2b7b8" }}>
            {`Durée totale: ${dayjs(
              (playlistInfo.totalDuration ?? 0) * 1000
            ).format("HH:mm:ss")} | Écrans: ${
              playlistInfo.numberOfScreens
            } | Widgets: ${playlistInfo.numberOfWidgets}`}
          </Typography>
        </Box>
        {showOptions || expanded ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pr: 1 }}>
            {/* <Tooltip title="Ajouter un widget" arrow placement="top">
              <WidgetSVG
                fill={true ? "#d9dfe0" : "#F00020"}
                width={24}
                height={24}
              />
            </Tooltip> */}
            <Tooltip title="Ajouter du contenu" arrow placement="top">
              <AddSVG
                fill={openRSB === "content" ? "#F00020" : "#d9dfe0"}
                width={24}
                height={24}
                onClick={onAddContentPress}
              />
            </Tooltip>
            <Tooltip title="Ajouter aux écrans" arrow placement="top">
              <ShareToDeviceSVG
                stroke={openRSB === "screen" ? "#F00020" : "#d9dfe0"}
                width={24}
                height={24}
                onClick={onAddScreenPress}
              />
            </Tooltip>
            <MoreHorizIcon
              sx={{ color: "#d9dfe0", fontSize: 30 }}
              onClick={(e) => {
                handleOpenMenu(e);
              }}
            />
            <Menu
              anchorEl={anchorElement as Element}
              open={menuOpen}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={() => {
                  handleNotifyScreens();
                  handleCloseMenu();
                }}
                sx={{ py: 0.3, px: 1 }}
              >
                Rafraîchir la playlist
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDuplicatePlaylist();
                  handleCloseMenu();
                }}
                sx={{ py: 0.3, px: 1 }}
              >
                Dupliquer
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeletePlaylist();
                  handleCloseMenu();
                }}
                sx={{ py: 0.3, px: 1 }}
              >
                Supprimer
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <MoreVert sx={{ color: "#d9dfe0", fontSize: 30 }} />
        )}
      </Grid>
      {expanded && (
        <PlaylistContentList
          contents={playlistInfo.contents}
          isEditable={userInfo?.privileges.playlists === true}
          sliderValue={sliderValue}
          onSortContents={onSortContents}
          onContentDeletePress={handleDeleteContent}
          onContentDurationChange={handleContentDurationChange}
          handleAddContent={onAddContentPress}
        />
      )}
    </>
  );
};

export default Playlist;
