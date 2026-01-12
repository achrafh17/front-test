import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import timezones from "../../../assets/data/timezones.json";

const ClockConfig = ({ timezone, setTimezone, onDelete, isAlone }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: "1px solid #ccc",
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", cursor: "pointer", mb: 2 }}
      >
        <Typography
          sx={{ flex: 1 }}
          onClick={() => {
            setExpanded((old) => !old);
          }}
        >
          Paramètres de l'horloge
        </Typography>
        {!isAlone && (
          <DeleteIcon onClick={onDelete} sx={{ fontSize: 20, color: "#aaa" }} />
        )}
        {expanded ? (
          <ArrowDropDownIcon
            sx={{ color: "#aaa", fontSize: 24 }}
            onClick={() => {
              setExpanded((old) => !old);
            }}
          />
        ) : (
          <ArrowRightIcon
            sx={{ color: "#aaa", fontSize: 24 }}
            onClick={() => {
              setExpanded((old) => !old);
            }}
          />
        )}
      </Box>
      {expanded && (
        <Box>
          <Typography sx={{ fontSize: 12, color: "#aaa" }}>
            Fuseau Horaire
          </Typography>
          <Autocomplete
            disablePortal
            fullWidth
            value={timezone}
            isOptionEqualToValue={(option, value) => option.value === value}
            onChange={(_event, newOption) => {
              setTimezone(newOption.value);
            }}
            options={[
              {
                label: "Localisation de l'écran",
                value: "Localisation de l'écran",
              },
            ].concat(
              timezones.map((t) => {
                return { label: t.label, value: t.value };
              })
            )}
            renderInput={(params) => (
              <TextField {...params} variant="standard" />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default function AddClocksPanel({
  onClose,
  clocks,
  setClocks,
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        height: "100%",
        width: 340,
        right: 340,
        backgroundColor: "white",
        boxShadow: "-2px 0px 14px 0px rgba(130, 137, 145, 0.3)",
      }}
    >
      <Box
        sx={{
          height: 78,
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography sx={{ flex: 1, fontSize: 18 }}>Horloges</Typography>
        <CloseIcon
          onClick={onClose}
          sx={{ cursor: "pointer", color: "#aaa" }}
        />
      </Box>
      <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
        <Button
          fullWidth
          variant="outlined"
          sx={{ fontSize: 14 }}
          disabled={clocks.length === 3}
          onClick={() => {
            setClocks(old => [...old, "Localisation de l'écran"]);
          }}
        >
          Ajouter une horloge
        </Button>
      </Box>
      {clocks.map((timezone, idx) => {
        return (
          <ClockConfig
            key={idx}
            timezone={timezone}
            setTimezone={(newTimezone) => {
              setClocks((old) => {
                var newClocks = [...old];
                newClocks[idx] = newTimezone;
                return newClocks;
              });
            }}
            isAlone={clocks.length === 1}
            onDelete={() => {
              setClocks((old) => [...old].filter((_t, index) => index !== idx));
            }}
          />
        );
      })}
    </Box>
  );
}
