import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WeatherPreview from "../../Common/weather/WeatherPreview";
import useStore from "../../../store/store";
import useRSB from "../../../hooks/useRSB"
import AppsDefaultRSB from "./AppsDefaultRSB"
import countries from "../../../assets/data/countries.json";

// make a side panel to choose country and city, display a paginated list with 50 records at a time that handles pagination and search lookup

export default function WeatherRSB() {
  const { userInfo } = useAuth();
  const {setRsbVariant} = useRSB();

  const setErrorMsg = useStore(state => state.setErrorMsg)
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState({
    label: "Maroc",
    value: "MA",
  });
  const [cityInfo, setCityInfo] = useState(null);
  const [cities, setCities] = useState([]);
  const [name, setName] = useState("Météo");
  const [success, setSuccess] = useState(null);
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [throttledSearch, setThrottledSearch] = useState("");

  useEffect(() => {
   var t = null;
   t = setTimeout(() => {
     setThrottledSearch(search);
   }, 700);

   return ()=>{
    clearTimeout(t);
   }
  }, [search]);

  useEffect(() => {
    setCityInfo(null)
    setThrottledSearch("");
    setSearch("");
    setCities([]);
  }, [country]);

  useEffect(() => {
    if (!open) {
      setCities([]);
    } else {
      setLoading(true);
      fetch(
        `https://www.powersmartscreen.com/get-cities?sessionId=${userInfo.sessionId}&countryCode=${country.value}&searchTerm=${throttledSearch}`
      )
        .then((res) => res.json())
        .then((resJson) => {
          if (resJson.success) {
            setCities(resJson.result);
          }
          setLoading(false);
        })
        .catch((e) => {});
    }
  }, [open, country.value, userInfo.sessionId, throttledSearch]);

  const save = async () => {
    if(userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Météo",
        info: {
          countryCode: country.value,
          cityInfo: cityInfo
        },
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/add-app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();

      if (resJson?.success) {
        setSuccess(true);
        setTimeout(() => {
          setRsbVariant({
            name: "APPS_DEFAULT",
            renderComponent: () => <AppsDefaultRSB />
          })
        }, 700);
      } else {
        setSuccess(false);
        setTimeout(() => {
          setSuccess(null);
        }, 1000);
      }
    } catch (e) {
      setSuccess(false);
      setTimeout(() => {
        setSuccess(null);
      }, 1000);
    }
    setIsLoading(false);
  };


  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            width: "100%",
            height: 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <WeatherPreview
            lat={cityInfo?.latitude ?? null}
            lon={cityInfo?.longitude ?? null}
          />
        </Box>
        <Box
          sx={{
            padding: 3,
            overflowY:"scroll",
            height: "calc(100vh - 60px - 190px - 80px)",
            maxHeight: "calc(100vh - 60px - 190px - 80px)",
          }}
          className="hide-scrollbar"
        >
          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>Nom</Typography>
          <TextField
            variant="standard"
            sx={{ width: "100%", mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.5 }}>
            Pays
          </Typography>
          <Autocomplete
            size="small"
            sx={{ mb: 2 }}
            value={country}
            onChange={(_event, newValue) => {
              setCountry(newValue);
            }}
            options={countries}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(op1, op2) => op1.value === op2.value}
            renderInput={(params) => <TextField {...params} />}
            disableClearable
          />
          <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.5 }}>
            Ville
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              height: "fit-content",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Autocomplete
                size="small"
                fullWidth
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                value={cityInfo}
                onChange={(_event, newValue) => {
                  setCityInfo(newValue);
                }}
                options={cities}
                getOptionLabel={(option) => option.cityName}
                isOptionEqualToValue={(op1, op2) =>
                  op1.cityName === op2.cityName
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                    placeholder="rechercher..."
                  />
                )}
                disableClearable
              />
              <Typography sx={{ fontSize: 13, color: "#797c7c", mt: 0.5 }}>
                si une ville n'est pas dans la liste, faites une recherche
              </Typography>
            </Box>
            <Box
              sx={{
                height: 50,
                width: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading && <CircularProgress color="inherit" size={24} />}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 2,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : success !== null ? (
          <Box
            sx={{
              width: "100%",
              borderRadius: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
              backgroundColor: "#F00020",
            }}
          >
            {success ? (
              <CheckCircleIcon sx={{ color: "white" }} />
            ) : (
              <CancelIcon sx={{ color: "white" }} />
            )}
          </Box>
        ) : (
          <Button
            variant="contained"
            sx={{ width: "100%", py: 1 }}
            onClick={save}
            disabled={!cityInfo}
          >
            Ajouter Contenu
          </Button>
        )}
      </Box>
    </Box>
  );
}
