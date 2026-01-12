import { Box } from "@mui/material";
import React from "react";
import { IDevicePlaylist } from "../../../types/api.types";
import { TimeInput } from "@mantine/dates";
import { MoreHoriz } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
//@ts-ignore
import { ReactComponent as LayoutDefaultSVG } from "../../../assets/svg/layout-default.svg";
//@ts-ignore
import { ReactComponent as PlaylistHasLayoutSVG } from "../../../assets/svg/playlist-has-layout.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PlaylistContentList from "../../Playlists/PlaylistContentList";
import useRSB from "../../../hooks/useRSB";
import useAuth from "../../../hooks/useAuth"

interface props {
  playlist: IDevicePlaylist;
  sliderValue: number;
  showContents: boolean;
  isLayoutRsbOpen: boolean;
  isEditable: boolean;
  updatePlaylistTimeStart: (newTimeStart: string) => void;
  updatePlaylistTimeEnd: (newTimeEnd: string) => void;
  onAddLayoutPress: () => void;
  onDeletePlaylist: () => void;
}

const DevicePlaylist: React.FC<props> = ({
  playlist,
  sliderValue,
  showContents,
  isLayoutRsbOpen,
  isEditable,
  updatePlaylistTimeStart,
  updatePlaylistTimeEnd,
  onAddLayoutPress,
  onDeletePlaylist,
}) => {
  const {userInfo} = useAuth();
  const { rsbVariant } = useRSB();

  const [showPlaylistContents, setShowPlaylistContents] = useState(true);

  const [anchorElement, setAnchorElement] = useState<EventTarget | null>(null);
  const menuOpen = Boolean(anchorElement);

  const handleOpenMenu = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorElement(e.target);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
  };

  useEffect(() => {
    setShowPlaylistContents(showContents);
  }, [showContents]);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ borderBottom: "1px solid #d9dfe0" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body1"
            sx={{ maxWidth: 200, color: "#575b5c", fontSize: 20 }}
            noWrap
          >
            {playlist?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#b2b7b8", fontSize: 14, flex: 1 }}
          >
            Durée totale:{" "}
            {dayjs((playlist.totalDuration ?? 0) * 1000).format("HH:mm:ss")}
          </Typography>
          <Tooltip title="Éditer l'heure de début" arrow placement="top">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ color: "#b2b7b8" }}>
                Début:
              </Typography>
              <TimeInput
                variant="unstyled"
                withSeconds
                value={dayjs(playlist.timeStart).toDate()}
                onChange={(newTimeStart) => {
                  if (isEditable) {
                    updatePlaylistTimeStart(newTimeStart.toISOString());
                  }
                }}
                disabled={!isEditable || userInfo?.privileges.devices !== true}
                sx={{
                  "& input": {
                    color: "#575b5c",
                  },
                }}
              />
            </Box>
          </Tooltip>
          <Tooltip title="Éditer l'heure de fin" arrow placement="top">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ color: "#b2b7b8" }}>
                Fin:
              </Typography>
              <TimeInput
                variant="unstyled"
                withSeconds
                value={dayjs(playlist.timeEnd).toDate()}
                onChange={(newTimeEnd) => {
                  if (isEditable) {
                    updatePlaylistTimeEnd(newTimeEnd.toISOString());
                  }
                }}
                disabled={!isEditable || userInfo?.privileges.devices !== true}
                sx={{
                  "& input": {
                    color: "#575b5c",
                  },
                }}
              />
            </Box>
          </Tooltip>
          <Tooltip title="Configurer le calque" arrow placement="top">
            {isLayoutRsbOpen && rsbVariant.name === "ADD_LAYOUT" ? (
              <LayoutDefaultSVG
                fill="#f00020ad"
                cursor="pointer"
                height={24}
                width={24}
                onClick={() => {
                  if (isEditable) {
                    onAddLayoutPress();
                  }
                }}
              />
            ) : playlist.layoutId ? (
              <PlaylistHasLayoutSVG
                cursor="pointer"
                height={24}
                width={24}
                onClick={() => {
                  if (isEditable) {
                    onAddLayoutPress();
                  }
                }}
              />
            ) : (
              <LayoutDefaultSVG
                fill="#d9dfe0"
                cursor="pointer"
                height={24}
                width={24}
                onClick={() => {
                  if (isEditable) {
                    onAddLayoutPress();
                  }
                }}
              />
            )}
          </Tooltip>
          <MoreHoriz
            sx={{ color: "#d9dfe0", cursor: "pointer" }}
            onClick={handleOpenMenu}
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
                setShowPlaylistContents((old) => !old);
                handleCloseMenu();
              }}
              sx={{ py: 0.4, px: 1 }}
            >
              {showPlaylistContents ? "Masquer" : "Afficher"}
            </MenuItem>
            <MenuItem
              onClick={() => {
                if(isEditable)
                {
                  onDeletePlaylist();
                }
                handleCloseMenu();
              }}
              sx={{ py: 0.4, px: 1 }}
            >
              Supprimer
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      {showPlaylistContents && (
        <Box sx={{ mx: -3, pt: 2, pb: 3 }}>
          <PlaylistContentList
            contents={playlist.contents}
            sliderValue={sliderValue}
            isEditable={false}
            onSortContents={()=>{}}
          />
        </Box>
      )}
    </Box>
  );
};

export default DevicePlaylist;
