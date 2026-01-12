import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ToolTip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { IDevice } from "../../types/api.types";

interface props {
  deviceInfo: IDevice;
  onDeletePress: ()=> void;
  isInGroup?: boolean;
  onUnlinkPress?: ()=>void;
}

const Device: React.FC<props> = ({ deviceInfo, onDeletePress, isInGroup, onUnlinkPress}) => {
  const navigate = useNavigate();

  const [optionsShown, setOptionsShown] = useState(false);
  // const [selected, setSelected] = useState(false);
  return (
    <Grid item sm={4} lg={3} xl={2} key={deviceInfo.deviceId}>
      <div className="device">
        <div
          className="device-info"
          onClick={() => {
            navigate(`/device/${deviceInfo.hashId}`);
          }}
        >
          <Typography variant="subtitle2" component="p">
            {deviceInfo.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ color: "#aaa", fontSize: 12 }}>
              {dayjs(deviceInfo.timeLastSync).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Box
              sx={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: deviceInfo.online ? "#05cd7d" : "#F00020",
              }}
            ></Box>
          </Box>
        </div>
        <Box
          onMouseEnter={() => {
            setOptionsShown(true);
          }}
          onMouseLeave={() => {
            setOptionsShown(false);
          }}
          sx={{
            pr: 2,
          }}
        >
          {optionsShown ? (
            <Box>
              {!!isInGroup && !!onUnlinkPress && (
                <ToolTip arrow title="Retirer du groupe " placement="top">
                  <LinkOffIcon
                    sx={{ color: "#aaa", fontSize: 26 }}
                    onClick={onUnlinkPress}
                  />
                </ToolTip>
              )}
              <ToolTip arrow title="Supprimer l'écran" placement="top">
                <DeleteOutlineIcon
                  sx={{ color: "#aaa", fontSize: 26 }}
                  onClick={onDeletePress}
                />
              </ToolTip>
            </Box>
          ) : (
            <MoreVertIcon sx={{ color: "#aaa" }} />
          )}
        </Box>
        {/* {selected && <div className="filter-selected"></div>} */}
      </div>
    </Grid>
  );
}

export default Device;