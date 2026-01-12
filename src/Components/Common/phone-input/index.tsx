import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Select } from "@mantine/core";
import TextField from "@mui/material/TextField";

import countries_dial_codes from "../../../assets/data/countries_dial_codes.json"

interface props {
  value: string;
  onChange: (newVal: string) => void;
}

const PhoneInput: React.FC<props> = ({ value, onChange }) => {

  const [dialCode, setDialCode]  = React.useState(()=>{
    let country = countries_dial_codes.find(c => c.dial_code === value.split(" ")[0])
    if(country) return `(${country.code}) ${country.dial_code}`;
    
    return "(MA) +212";
  });

  const [phoneNumber, setPhoneNumber] = React.useState(value.split(" ")[1]);

  React.useEffect(()=>{
    let newVal = `${dialCode.split(" ")[1]} ${phoneNumber}`
    onChange(newVal)
  }, [dialCode, phoneNumber])

  const [isSelectFocused, setIsSelectFocused] = React.useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          height: 56,
          paddingLeft: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderStyle: "solid",
          borderRightWidth: 0,
          borderColor: isSelectFocused ? "#339af0" : "#ced4da",
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4,
        }}
      >
        <Typography sx={{ fontSize: 22 }}>
          {
            countries_dial_codes.find(
              (c) => `(${c.code}) ${c.dial_code}` === dialCode
            )?.flag
          }
        </Typography>
      </Box>
      <Select
        sx={{
          maxWidth: 140,
          height: 56,
          "& .mantine-Select-input": {
            height: 56,
            fontSize: 16,
            color: "#373737",
            borderLeftWidth: 0,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          },
          //margin righ 8px
          marginRight: 8,
        }}
        autoComplete="off"
        value={dialCode}
        onFocus={() => {
          setIsSelectFocused(true);
        }}
        onBlur={() => {
          setIsSelectFocused(false);
        }}
        searchable
        nothingFound={"Aucune Option"}
        onChange={(e) => {
          if (e) setDialCode(e);
        }}
        data={countries_dial_codes.map((c) => `(${c.code}) ${c.dial_code}`)}
        error={!/\+\d{1,4}/.test(dialCode)}
      />
      <TextField
        sx={{ flex: 1 }}
        InputProps={{
          style: {
            letterSpacing: 1,
          },
        }}
        label="Numéro de téléphone*"
        value={phoneNumber}
        onChange={(e) => {
          let newVal = e.target.value;
          if (/^\d{0,12}$/.test(newVal) === true) {
            setPhoneNumber(newVal);
          }
        }}
      />
    </Box>
  );
};

export default PhoneInput;
