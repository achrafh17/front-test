import React from "react";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

// always give the value to this component in bits
// for example:
// 1B => 8
// 1KB => 8000
// 1MB => 8000000

interface props {
  value: number;
  onValueChange: (newValue: number) => void;
}

const UNITS_TO_DECIMALS = {
    "o":1,
    "ko":1_000,
    "mo":1_000_000,
    "go":1_000_000_000
}

const UploadSizeInput: React.FC<props> = ({ value, onValueChange }) => {
  const [inputValue, setInputValue] = React.useState(0);
  const [unit, setUnit] = React.useState<"o" | "ko" | "mo" | "go">("o");

  React.useEffect(() => {
    // size is in bits
    // make it in bytes
    let temp = value / 8;
    if (temp < 1_000) {
      setInputValue(temp);
      setUnit("o");
    } else if (temp < 1_000_000) {
      setInputValue(temp / 1_000);
      setUnit("ko");
    } else if (temp < 1_000_000_000) {
      setInputValue(temp / 1_000_000);
      setUnit("mo");
    } else {
      setInputValue(temp / 1_000_000_000);
      setUnit("go");
    }
  }, [value]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: .75}}>
      <TextField
      variant="standard"
        size="small"
        sx={{ width: 60, height:40, px: 0.5, py: 1 }}
        type="number"
        value={inputValue}
        onChange={(e) => {
            let newValue = parseInt(e.target.value);
            if(!isNaN(newValue) && newValue >=0 && newValue <=999){
                onValueChange(newValue * UNITS_TO_DECIMALS[unit])
            } 
        }}
        InputProps={{
          inputProps: {
            min: 0,
            max: 999,
            step: 1,
          },
        }}
      />
      <Select size="small" 
      variant="outlined"
      value={unit} onChange={(e) => {
        onValueChange(inputValue * UNITS_TO_DECIMALS[e.target.value]);
        
      }}>
        <MenuItem value="o">octets</MenuItem>
        <MenuItem value="ko">Ko</MenuItem>
        <MenuItem value="mo">Mo</MenuItem>
        <MenuItem value="go">Go</MenuItem>
      </Select>
    </Box>
  );
};

export default UploadSizeInput;
