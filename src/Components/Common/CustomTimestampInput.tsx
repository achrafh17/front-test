import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React from "react";

interface props {
  timestamp: { h: number; m: number; s: number };
  setTimestamp: React.Dispatch<
    React.SetStateAction<{
      h: number;
      m: number;
      s: number;
    }>
  >;
}

const CustomTimestampInput: React.FC<props> = ({ timestamp, setTimestamp }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        gap: 2,
      }}
    >
      <TextField
        type="number"
        variant="standard"
        InputProps={{
          startAdornment: <InputAdornment position="start">H:</InputAdornment>,
          inputProps: {
            min: 0,
          },
        }}
        sx={{ flex: 1, mb: 2 }}
        value={timestamp.h}
        onChange={(e) =>
          setTimestamp((old) => {
            if (isNaN(parseInt(e.target.value))) {
              return { ...old, h: 0 };
            }
            return { ...old, h: parseInt(e.target.value) };
          })
        }
      />
      <TextField
        type="number"
        variant="standard"
        InputProps={{
          startAdornment: <InputAdornment position="start">M:</InputAdornment>,
          inputProps: {
            min: 0,
          },
        }}
        sx={{ flex: 1, mb: 2 }}
        value={timestamp.m}
        onChange={(e) =>
          setTimestamp((old) => {
            if (isNaN(parseInt(e.target.value))) {
              return { ...old, m: 0 };
            }
            return { ...old, m: parseInt(e.target.value) };
          })
        }
      />
      <TextField
        type="number"
        variant="standard"
        InputProps={{
          startAdornment: <InputAdornment position="start">S:</InputAdornment>,
          inputProps: {
            min: 0,
          },
        }}
        sx={{ flex: 1, mb: 2 }}
        value={timestamp.s}
        onChange={(e) =>
          setTimestamp((old) => {
            if (isNaN(parseInt(e.target.value))) {
              return { ...old, s: 0 };
            }
            return { ...old, s: parseInt(e.target.value) };
          })
        }
      />
    </Box>
  );
};

export default CustomTimestampInput;
