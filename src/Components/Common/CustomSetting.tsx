import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Switch from "@mui/material/Switch";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import React, { ReactElement, useState } from "react";
import { SxProps } from "@mui/material";

interface props {
    title: string,
    active: boolean;
    setActive: (activeState: boolean) => void;
    renderBody: () => ReactElement<any>;
    initiallyOpen?: boolean;
    sx?: SxProps;
}

const CustomSetting : React.FC<props> = ({title, active, setActive, renderBody, initiallyOpen, sx}) => {
    const [open, setOpen] = useState(!!initiallyOpen);

    var body = renderBody();
    console.log(title + " " + active)
    return (
      <Box
        sx={{
          borderTop: "1px solid #f5f3f5",
          mx: -3,
          px: 3,
          py: 1,
          mb: 1,
          ...sx
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ flex: 1, fontSize: 14 }}>{title}</Typography>
          <Switch
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            size="small"
          />
          <Box
            sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            onClick={() => {
              setOpen((old) => !old);
            }}
          >
            {open ? (
              <ArrowDropUpIcon sx={{ color: "#aaa" }} />
            ) : (
              <ArrowDropDownIcon sx={{ color: "#aaa" }} />
            )}
          </Box>
        </Box>
        {open && <>{body}</>}
      </Box>
    );
}

export default CustomSetting;