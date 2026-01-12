import React from "react";
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"

interface props {
    value: number;
    onValueChange: (value: number) => void;
    adornmentText: string;
}

const CanvasObjectDimensionsInput: React.FC<props> = ({
    value, onValueChange, adornmentText,
}) => {
    return (
      <TextField
        variant="standard"
        sx={{ flex: 1 }}
        value={value}
        onChange={(e) => {
          var newValue = parseInt(e.target.value);
          if (!isNaN(newValue)) {
            if (newValue < 0) newValue = 0;
            if (newValue > 100) newValue = 100;
            onValueChange(newValue);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "#84898a" }}>
              {adornmentText}
            </InputAdornment>
          ),
          inputProps: {
            min: 0,
            max: 1,
            step: 0.01,
          },
        }}
        type="number"
        onWheel={(e) => {
          e.preventDefault();
        }}
      />
    );
}

export default CanvasObjectDimensionsInput;