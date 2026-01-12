import React, {useState} from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Tooltip from "@mui/material/Tooltip"
import LinkOffIcon from "@mui/icons-material/LinkOff";
import {IDevice} from "../../../types/api.types"
import {useNavigate} from "react-router-dom"

interface props  {handleUnlinkDevicePress: (deviceId:number) => void, device: IDevice}

const DeviceRow: React.FC<props> = ({
    device,
    handleUnlinkDevicePress
}) => {
  const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1,
        mb: 1,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Box
        sx={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: device.online ? "#05cd7d" : "#F00020",
        }}
      ></Box>
      <Box sx={{ flex: 1 }}>
        <Tooltip title="à l'écran" arrow placement="top">
          <Typography sx={{ cursor: "pointer", width: "fit-content" }} noWrap onClick={()=>{
            navigate("/device/" + device.hashId);
          }}>
            {device.name}
          </Typography>
        </Tooltip>
      </Box>
      {isHovered && (
        <Tooltip title="dégrouper" arrow placement="top">
          <LinkOffIcon
            sx={{ color: "#ccc", cursor: "pointer" }}
            onClick={() => {
              handleUnlinkDevicePress(device.deviceId);
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default DeviceRow;