import React from "react";
import { IDeviceSingle } from "../../types/api.types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//@ts-ignore
import { ReactComponent as MapMarkerSvg } from "../../assets/svg/map-marker.svg";
//@ts-ignore
import { ReactComponent as DeviceAvatarSvg } from "../../assets/svg/device-avatar.svg";
//@ts-ignore
import { ReactComponent as ViewGroupDevicesSVG } from "../../assets/svg/view-group-devices.svg";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import useRSB from "../../hooks/useRSB";
import TitleBarName from "./TitleBarName";
import DeviceMapView from "./DeviceMapView"
interface props {
  deviceInfo: IDeviceSingle;
  onShowSettingsPress: () => void;
  onShowChildrenRSBPress: () => void;
}

const TitleBar: React.FC<props> = ({
  deviceInfo,
  onShowSettingsPress,
  onShowChildrenRSBPress,
}) => {
  const { rsbVariant } = useRSB();

  const [isMapExpanded, setIsMapExpanded] = React.useState(false);

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          height: isMapExpanded ? 380 : 80,
          backgroundColor: "#ccc",
          transition: ".3s all ease",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <DeviceMapView deviceInfo={deviceInfo} />
        <Box
          sx={{
            transition:".3s all ease",
            width: "100%",
            height: 80,
            minHeight: 80,
            maxHeight: 80,
            background: isMapExpanded
              ? "linear-gradient(to bottom,rgba(0,0,0,.01) 0,rgba(0,0,0,.01) 10%,rgba(0,0,0,.35) 100%)"
              : "rgba(0,0,0,.35)",
            position: "absolute",
            bottom: 0,
            pointerEvents: "none",
          }}
        ></Box>
      </Box>
      <Box sx={{ padding: 3, maxHeight: 80 }}>
        <Box
          sx={{
            display: "flex",
            height: 102,
            width: "100%",
            position: "relative",
            bottom: 70,
          }}
        >
          <Box
            className={`device-img ${
              deviceInfo.isGroup
                ? "no-status"
                : deviceInfo.online
                ? "online"
                : ""
            }`}
          >
            <DeviceAvatarSvg width={50} height={50} />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              ml: 1,
              height: "100%",
              flex: 1,
              px: 1,
              pt: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                setIsMapExpanded((old) => !old);
              }}
            >
              <MapMarkerSvg height={18} width={18} fill={"white"} />
              <Typography variant="body1" sx={{ color: "white", fontSize: 14 }}>
                Voir sur le plan
              </Typography>
              {isMapExpanded ? (
                <ExpandLessIcon sx={{ color: "white" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "white" }} />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <TitleBarName deviceInfo={deviceInfo} />
              </Box>
              {deviceInfo.isGroup && (
                <ViewGroupDevicesSVG
                  style={{
                    fill:
                      rsbVariant.name === "GROUP_ADD_DEVICE"
                        ? "#F00020"
                        : "#d9dfe0",
                    width: 26,
                    height: 26,
                    cursor: "pointer",
                  }}
                  onClick={onShowChildrenRSBPress}
                />
              )}

              <SettingsIcon
                sx={{
                  color:
                    rsbVariant.name === "SINGLE_DEVICE"
                      ? "#F00020"
                      : "#bec4c4",
                  fontSize: 26,
                  cursor: "pointer",
                  ml: 2,
                }}
                onClick={onShowSettingsPress}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleBar;
