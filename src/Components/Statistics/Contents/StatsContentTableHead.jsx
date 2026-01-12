import Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { ReactComponent as UpDownArrowSVG } from "../../../assets/svg/up-down-arrow.svg";
import Select from '@mui/material/Select';
import MenuItem  from "@mui/material/MenuItem";
import { useState, useEffect } from "react";



export default function TableHead({ sorting, setSorting }) {

  const [type, setType] = useState("Tous");


  useEffect(()=>{
    setSorting(["type", type]);
  }, [type, setSorting])

    const heads = [
      {
        id: "title",
        LabelComponent: () => <Typography>Nom</Typography>,
      },
      {
        id: "showTotal",
        LabelComponent: () => <Typography>Visualisations</Typography>,
      },
      {
        id: "showTime",
        LabelComponent: () => (
          <Typography>
            Durée totale
            <Typography sx={{ fontSize: 12, display: "block" }} as="span">
              (hh:mm:ss)
            </Typography>
          </Typography>
        ),
      },
      {
        id: "numberOfScreens",
        LabelComponent: () => <Typography>Écrans</Typography>,
      },
      {
        id: "type",
        LabelComponent: () => <Typography>Tous</Typography>,
      },
    ];
  return (
    <Box
      sx={{
        backgroundColor: "#e6ebf0",
        p: 2,
        display: "flex",
        alignItems: "center",
        borderRadius: 1.3,
        width: "100%",
        color: "#575b5c",
      }}
    >
      {heads.map(({ id, LabelComponent }, idx) => {
        if (id === "type") {
          return (
            <Box key={idx} sx={{ flex: 2 }}>
              <Select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
                variant="standard"
                sx={{ px: 1 }}
              >
                <MenuItem value="Tous">Tous</MenuItem>
                <MenuItem value="Image">Image</MenuItem>
                <MenuItem value="Video">Vidéo</MenuItem>
                <MenuItem value="Audio">Audio</MenuItem>
                <MenuItem value="App">Application</MenuItem>
                <MenuItem value="Jeu">Jeux</MenuItem>
              </Select>
            </Box>
          );
        }
        return (
          <Box
            key={idx}
            sx={{
              flex: idx === 0 ? 3 : 2,
            }}
          >
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                color: "#5F5F64",
                gap: 1.25,
              }}
              onClick={() => {
                setSorting((oldSorting) => {
                  if (oldSorting[0] === id) {
                    if (oldSorting[1] === "asc") {
                      return [id, "desc"];
                    }
                    return [id, "asc"];
                  }
                  return [id, "asc"];
                });
              }}
            >
              <LabelComponent />
              {sorting[0] === id ? (
                sorting[1] === "asc" ? (
                  <ArrowDropUpIcon color="#5F5F64" />
                ) : (
                  <ArrowDropDownIcon color="#5F5F64" />
                )
              ) : (
                <UpDownArrowSVG width={14} fill="#5F5F64" />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}