import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import { IDevice } from "../../types/api.types";
//@ts-ignore
import { ReactComponent as GroupIconSVG } from "../../assets/svg/group-device-icon.svg";
//@ts-ignore
import { ReactComponent as AddIconSVG } from "../../assets/svg/add-screen-to-group.svg";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import Device from "./Device";
import { useNavigate } from "react-router-dom";
interface props {
  groupInfo: IDevice;
  children: IDevice[];
  onRemove: () => void;
  onAddDeviceToGroupPress: () => void;
  onDeleteDevicePress: (deviceId: number) => void;
  onUnlinkDevicePress: (deviceId: number) => void;
}

const DeviceGroup: React.FC<props> = ({
  groupInfo,
  children,
  onRemove,
  onAddDeviceToGroupPress,
  onDeleteDevicePress,
  onUnlinkDevicePress,
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleUnlink = () => {
    onRemove();
  };

  const handleAddDevice = () => {
    onAddDeviceToGroupPress();
  };

  const handleUnlinkDeviceFromGroup = (deviceId: number) => {
    onUnlinkDevicePress(deviceId);
  };

  return (
    <Box
      sx={{
        mb: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f3f5f5",
          borderRadius: "5px",
          height: 80,
          borderLeft: "7px solid #d9dfe0",
          p: 1,
          display: "flex",
          gap: 2,
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/device/" + groupInfo.hashId);
        }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#D1D1D1",
          }}
        >
          <GroupIconSVG fill="white" width={28} />
        </Box>
        <Box
          sx={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "#575b5c", mb: 0.5 }}>
            {groupInfo.name}
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, alignItems: "center" }}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((old) => !old);
            }}
          >
            <Typography sx={{ color: "#aaa", fontSize: 12 }}>
              {children.length} écrans dans ce groupe
            </Typography>
            {isOpen ? (
              <ExpandLessIcon sx={{ fontSize: 16, color: "#575b5c" }} />
            ) : (
              <ExpandMoreIcon sx={{ fontSize: 16, color: "#575b5c" }} />
            )}
          </Box>
        </Box>

        <Tooltip title="ajouter un écran" arrow placement="top">
          <AddIconSVG
            fill="#aaa"
            width={22}
            height={22}
            onClick={(e) => {
              e.stopPropagation();
              handleAddDevice();
            }}
          />
        </Tooltip>

        <Tooltip title="dégrouper" arrow placement="top">
          <LinkOffIcon
            sx={{ color: "#aaa", mr: 1, cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              handleUnlink();
            }}
          />
        </Tooltip>
      </Box>
      <Grid container flexDirection="row" spacing={2} sx={{ mt: 0 }}>
        {isOpen &&
          children.map((deviceInfo, idx) => {
            return (
              <Device
                deviceInfo={deviceInfo}
                key={idx}
                onDeletePress={() => {
                  onDeleteDevicePress(deviceInfo.deviceId);
                }}
                isInGroup={true}
                onUnlinkPress={() => {
                  handleUnlinkDeviceFromGroup(deviceInfo.deviceId);
                }}
              />
            );
          })}
      </Grid>
    </Box>
  );
};

export default DeviceGroup;
