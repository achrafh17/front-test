import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { PlaylistDevice, IDevice } from "../../types/api.types";
import EditTimelineDialog from "../EditTimelineDialog";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { InputLabel, FormControl, Select, MenuItem } from "@mui/material";

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
  const [singleDevicesExpanded, setSingleDevicesExpanded] = useState(true);
  const [groupDevicesExpanded, setGroupDevicesExpanded] = useState(true);
  const [searchedDevices, setSearchedDevices] = useState<{
    singles: IDevice[];
    groups: IDevice[];
  }>({
    singles: [],
    groups: [],
  });
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
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

  const onSave = async (timeStart: string, timeEnd: string) => {
    if (!selectedDevice) return;
    setIsLoading(true);
    var payload = {
      sessionId: userInfo?.sessionId,
      deviceId: selectedDevice,
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
          setSelectedDevice(null);
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
      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            height: "calc(100vh - 60px - 81px - 42px - 80px)",
            maxHeight: "calc(100vh - 60px - 81px - 42px - 80px)",
            overflowY: "scroll",
          }}
          className="hide-scrollbar"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: 16 }}>Écrans </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e8eded",
                color: "#84898a",
                width: 24,
                height: 24,
                borderRadius: "50%",
                padding: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {searchedDevices.singles.length}
              </Typography>
            </Box>
            <Box
              sx={{ ml: "auto", cursor: "pointer" }}
              onClick={() => setSingleDevicesExpanded((old) => !old)}
            >
              {singleDevicesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box>
          {singleDevicesExpanded && (
            <Box
              sx={{
                mt: 1,
              }}
            >
              {/* {searchedDevices.singles.map((device) => {
                return <DeviceRow key={device.deviceId} device={device} />;
              })} */}
              <FormControl fullWidth>
                <InputLabel id="device-label">Écrans</InputLabel>
                <Select
                  labelId="device-label"
                  value={selectedDevice ?? ""}
                  label="Écrans"
                  onChange={(e) => setSelectedDevice(Number(e.target.value))}
                >
                  {searchedDevices.singles.map((d) => (
                    <MenuItem key={d.deviceId} value={d.deviceId}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
            <Typography sx={{ fontSize: 16 }}>Groupes </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#e8eded",
                color: "#84898a",
                width: 24,
                height: 24,
                borderRadius: "50%",
                padding: 1,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                {searchedDevices.groups.length}
              </Typography>
            </Box>
            <Box
              sx={{ ml: "auto", cursor: "pointer" }}
              onClick={() => setGroupDevicesExpanded((old) => !old)}
            >
              {groupDevicesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
          </Box> */}
          {/* {groupDevicesExpanded && (
            <Box>
              {searchedDevices.groups.map((device) => {
                return <DeviceRow key={device.deviceId} device={device} />;
              })}
            </Box>
          )} */}
        </Box>

        <Box
          className={` ${
            selectedDevice !== null && selectedDevice !== undefined
              ? "slide-top"
              : "slide-bottom"
          }`}
          sx={{
            width: "100%",
            padding: 2,
            backgroundColor: "white",
            boxShadow: "0px 3px 15px 6px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
              onClick={() => {
                setOpen(true);
              }}
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
        }}
        onSave={onSave}
        addscheduleByPlaylistOrDevice={true}
        title={""}
        selectedDevice={selectedDevice}
        playlistId={playlistId}
        editSchedule={null}
      />
    </Box>
  );
};

export default PlaylistAddScreen;
