import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { ReactComponent as DeviceAvatarSvg } from "../../../assets/svg/device-avatar.svg";
import { ReactComponent as ExpandLess } from "../../../assets/svg/expand-less-box.svg";
import { ReactComponent as ExpandMore } from "../../../assets/svg/expand-more-box.svg";
import { useState } from "react";
import SingleScreenTable from "./SingleScreenTable"

export default function SingleScreenStat({ stat }) {
  var [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 60,
            height: 60,
            border: "1px solid white",
            backgroundColor: "#E6EBF0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
          }}
        >
          <DeviceAvatarSvg width="65%" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ fontSize: 21, color: "#575b5c", fontWeight: "400" }}
          >
            {stat.name}
          </Typography>
          <Typography
            sx={{ fontSize: 13, color: "#84898a", fontWeight: "400" }}
          >
            Écran
          </Typography>
        </Box>
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => {
            setExpanded((old) => !old);
          }}
        >
          {expanded ? (
            <ExpandLess fill="#9ea1a4" className="hover-dark fill" />
          ) : (
            <ExpandMore fill="#9ea1a4" className="hover-dark fill" />
          )}
        </Box>
      </Box>
      {expanded && <SingleScreenTable data={stat.OnlineDeviceStats} />}
      <Box
        sx={{ width: "100%",my: 3, height: "1px", backgroundColor: "#b2b2b2" }}
      ></Box>
    </Box>
  );
}
