import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PlaylistDevice, IDevice } from "../../types/api.types";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
} from "@mui/material";
import EditTimelineDialog from "../Schedule/EditTimelineDialog";
import DeviceList from "./DeviceList";
import Collapse from "@mui/material/Collapse";

interface props {
  playlistName: string;
  playlistId: number;
  playlistDevices: PlaylistDevice[];
  onAddedDevices: (addedDevices: PlaylistDevice[]) => void;
}

const PlaylistAddScreen: React.FC<props> = ({
  playlistName,
  playlistId,
  playlistDevices,
  onAddedDevices,
}) => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [singleDevicesExpanded, setSingleDevicesExpanded] = useState(false);
  const [groupDevicesExpanded, setGroupDevicesExpanded] = useState(false);
  const [searchedDevices, setSearchedDevices] = useState<{
    singles: IDevice[];
    groups: IDevice[];
  }>({
    singles: [],
    groups: [],
  });
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([]);
  const [devices, setDevices] = useState<{
    singles: IDevice[];
    groups: IDevice[];
  }>({
    singles: [],
    groups: [],
  });
  const [open, setOpen] = useState(false);
  const [numberOfDevicesPerPlaylist, setNumberOfDevicesPerPlaylist] = useState<
    Record<number, number>
  >({});
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    var tmp: Record<number, number> = {};
    playlistDevices.forEach((device) => {
      if (tmp.hasOwnProperty(device.deviceId)) {
        tmp[device.deviceId] = tmp[device.deviceId] + 1;
      } else {
        tmp[device.deviceId] = 1;
      }
    });
    setNumberOfDevicesPerPlaylist(tmp);
  }, [playlistDevices]);

  useEffect(() => {
    fetch(
      `https://www.powersmartscreen.com/get-devices?sessionId=${userInfo?.sessionId}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson?.success) {
          var result = resJson.result as IDevice[];

          setDevices({
            singles: result.filter(
              (device) => device.parentId === null && !device.isGroup,
            ),
            groups: result.filter(
              (device) => device.parentId === null && device.isGroup,
            ),
          });
        } else {
        }
      })
      .catch((e) => {});
  }, [userInfo?.sessionId]);

  useEffect(() => {
    setSearchedDevices({
      singles: devices.singles.filter((d) =>
        d.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
      groups: devices.groups.filter((d) =>
        d.name.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    });
  }, [searchValue, devices]);

  const handleToggleDevice = (id: number) => {
    setSelectedDeviceIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const onSave = async (timeStart: string, timeEnd: string) => {
    if (selectedDeviceIds?.length === 0) return;
    setIsLoading(true);
    var payload = {
      sessionId: userInfo?.sessionId,
      deviceId: selectedDeviceIds,
      playlistId,
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
      if (!resJson.success) {
        setIsLoading(false);
        setSuccess(false);
        setTimeout(() => {
          setSuccess(null);
        }, 700);
      } else {
        var newDevices = resJson.result as PlaylistDevice[];
        onAddedDevices(newDevices);
        setNumberOfDevicesPerPlaylist((old) => {
          var newData = { ...old };
          newDevices.forEach((device) => {
            if (newData.hasOwnProperty(device.deviceId)) {
              newData[device.deviceId] = newData[device.deviceId] + 1;
            } else {
              newData[device.deviceId] = 1;
            }
          });
          return newData;
        });
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(null);
          setSelectedDeviceIds([]);
        }, 700);
      }
    } catch (e) {
      setIsLoading(false);
      setSuccess(false);
      setTimeout(() => {
        setSuccess(null);
      }, 700);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "#575b5c",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: 18 }}>
          Ajouter aux écrans
        </Typography>
        <Typography
          sx={{ fontWeight: 400, fontSize: 12, color: "#aaa" }}
          noWrap
          textOverflow="ellipsis"
        >
          {playlistName}
        </Typography>
      </Box>
      <input
        className="stripped-input"
        style={{
          borderBottom: "1px solid #d9dfe0",
          height: 41,
          padding: "0 24px",
          width: "100%",
        }}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        placeholder="Rechercher..."
      />
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            height: "calc(100vh - 60px - 81px - 42px - 80px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          className="hide-scrollbar"
        >
          {/* ===== ECRANS ===== */}
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Box
              onClick={() => {
                if (searchedDevices.singles.length !== 0)
                  setSingleDevicesExpanded((old) => !old);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                cursor: "pointer",
                backgroundColor: "#f9fafb",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                  Écrans
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                    fontSize: 12,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "999px",
                    fontWeight: 500,
                  }}
                >
                  {searchedDevices.singles.length}
                </Box>
              </Box>
              <ExpandMoreIcon
                sx={{
                  transform: singleDevicesExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />{" "}
            </Box>

            <Collapse
              in={singleDevicesExpanded && searchedDevices.singles.length !== 0}
              timeout={300}
              unmountOnExit
            >
              <Box sx={{ p: 2 }}>
                <DeviceList
                  title="Ecrans"
                  devices={searchedDevices.singles}
                  selectedDeviceIds={selectedDeviceIds}
                  handleToggleDevice={handleToggleDevice}
                />
              </Box>
            </Collapse>
          </Box>

          {/* ===== GROUPES ===== */}
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Box
              onClick={() => {
                if (searchedDevices.groups.length !== 0)
                  setGroupDevicesExpanded((old) => !old);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                cursor: "pointer",
                backgroundColor: "#f8fafc",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "#eef2f7",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                  Groupes
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#e2e8f0",
                    color: "#334155",
                    fontSize: 12,
                    px: 1.2,
                    py: 0.3,
                    borderRadius: "999px",
                    fontWeight: 500,
                  }}
                >
                  {searchedDevices.groups.length}
                </Box>
              </Box>
              <ExpandMoreIcon
                sx={{
                  transform: groupDevicesExpanded
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />{" "}
            </Box>

            <Collapse
              in={groupDevicesExpanded && searchedDevices.groups.length !== 0}
              timeout={300}
              unmountOnExit
            >
              <Box sx={{ p: 2 }}>
                <DeviceList
                  title="Groupes"
                  devices={searchedDevices.groups}
                  selectedDeviceIds={selectedDeviceIds}
                  handleToggleDevice={handleToggleDevice}
                />
              </Box>
            </Collapse>
          </Box>
        </Box>

        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            width: "100%",
            mt: 2,
            p: 2,
            backgroundColor: "white",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {success === true ? (
            <CheckCircleOutlinedIcon sx={{ color: "#05cd7d" }} />
          ) : success === false ? (
            <CancelOutlinedIcon sx={{ color: "#f00020" }} />
          ) : isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpen(true)}
              disabled={selectedDeviceIds.length === 0}
            >
              Ajouter
            </Button>
          )}
        </Box>
      </Box>
      <EditTimelineDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setSingleDevicesExpanded(false);
          setSelectedDeviceIds([]);
        }}
        onSave={onSave}
        addscheduleByPlaylistOrDevice={true}
        title={""}
        selectedDevices={selectedDeviceIds}
        playlistId={playlistId}
        editSchedule={null}
      />
    </Box>
  );
};

export default PlaylistAddScreen;
