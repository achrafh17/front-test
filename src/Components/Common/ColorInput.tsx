import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { SxProps } from "@mui/material";

interface props {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  sx?: SxProps
}

const ColorInput: React.FC<props> = ({ label, value, onValueChange, sx }) => {
  return (
    <Box sx={{width:"100%", ...sx}}>
      <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
        {label}
      </Typography>
      <TextField
        variant="standard"
        fullWidth
        InputProps={{
          startAdornment: (
            <Box
              sx={{
                width: 27,
                height: 24,
                border: "1px solid #000",
                borderRadius: 1.1,
                position: "relative",
                mr: 1,
                overflow:"hidden",
              }}
            >
              <input
                type="color"
                style={{
                  width: 20,
                  height: 24,
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  position: "absolute",
                  top: -1,
                  left: 0.5,
                }}
                value={value}
                onChange={(e) => {
                  onValueChange(e.target.value);
                }}
              />
            </Box>
          ),
        }}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
        }}
      />
    </Box>
  );
};

export default ColorInput;
