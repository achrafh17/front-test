import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../../hooks/useAuth";
import useStore from "../../../store/store";
import useRSB from "../../../hooks/useRSB";
import AppsDefaultRSB from "../../RightSideBars/Apps/AppsDefaultRSB";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IRingoverGroup } from "../../../types/ringover.types";
import { getRingoverGroups } from "../../../utils/ringover.utils";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Alert from "@mui/material/Alert";
// @ts-ignore
import RingoverIMG from "../../../assets/svg/ringover.svg";
import dayjs from "dayjs";
import CustomSetting from "../../Common/CustomSetting";
import InputAdornment from "@mui/material/InputAdornment";
import { Select } from "@mantine/core";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { IconButton } from "@mui/material";

type StatEnum = "leaderboard_calls" | "leaderboard_duration" | "activity";
const STAT_TYPES = [
  {
    label: "Leaderboard / Nombre d'appels",
    value: "leaderboard_calls",
  },
  {
    label: "Leaderboard / Durée",
    value: "leaderboard_duration",
  },
  {
    label: "Standards Vocaux & Lignes Directes",
    value: "activity",
  },
] as { label: string; value: StatEnum }[];

const RingoverRSB: React.FC<{}> = () => {
  const { userInfo } = useAuth();
  const { setRsbVariant } = useRSB();

  const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [name, setName] = useState("Statistiques Ringover");
  const [apiKey, setApiKey] = useState("");
  const [apiKeyHidden, setApiKeyHidden] = useState(true);
  const [isApiKeyValid, setIsApiKeyValid] = useState(true);
  const [groups, setGroups] = useState<IRingoverGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<{
    label: string;
    value: number;
    total_users_count: number;
  } | null>(null);

  const [filters, setFilters] = useState<{
    exclude_short_value: number | null;
    exclude_long_value: number | null;
    stat_type: StatEnum;
    period_in_days: number | undefined;
  }>({
    exclude_short_value: null,
    exclude_long_value: null,
    stat_type: "leaderboard_calls",
    period_in_days: 1,
  });

  useEffect(() => {
    setGroups([]);
    setSelectedGroup(null);
    var t = setTimeout(() => {
      setIsApiKeyValid(true);
      if (apiKey.length === 0) return;
      getRingoverGroups(apiKey)
        .then((groups) => {
          setGroups(
            groups.sort((a, b) =>
              a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            )
          );
        })
        .catch((e) => {
          if (e.message === "Error: Unauthorized") {
            setIsApiKeyValid(false);
          }
        });
    }, 1000);

    return () => {
      clearTimeout(t);
    };
  }, [apiKey]);

  const save = async () => {
    if (userInfo?.privileges.contents !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    setIsLoading(true);
    try {
      var payload = {
        title: name,
        type: "Stats Ringover",
        info: {
          apiKey,
          groupId: selectedGroup?.value,
          ...filters,
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
            renderComponent: () => <AppsDefaultRSB />,
          });
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
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          <img
            src={RingoverIMG}
            alt="Ringover"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        <Box
          sx={{
            padding: 3,
            overflowY: "scroll",
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
            Clé d'API Ringover
          </Typography>
          <TextField
            InputProps={{
              endAdornment: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    width: 40,
                    height: 40,
                    borderRadius: 1.2,
                    color: "#797c7c",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                  onClick={() => setApiKeyHidden(!apiKeyHidden)}
                >
                  {apiKeyHidden ? (
                    <Visibility sx={{ fontSize: 20 }} />
                  ) : (
                    <VisibilityOff sx={{ fontSize: 20 }} />
                  )}
                </Box>
              ),
            }}
            variant="standard"
            type={apiKeyHidden ? "password" : "text"}
            sx={{ width: "100%", mb: 2 }}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />

          {!isApiKeyValid && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Clé d'API invalide
            </Alert>
          )}

          {/* ----------------------------------------------------- */}
          <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.5 }}>
            Groupe
          </Typography>
          <Autocomplete
            size="small"
            sx={{ mb: 2 }}
            // @ts-ignore
            value={selectedGroup}
            onChange={(_e, newValue) => {
              setSelectedGroup(newValue ?? null);
            }}
            options={groups.map((group) => ({
              label: group.name,
              value: group.group_id,
              total_users_count: group.total_users_count,
            }))}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(op1, op2) => op1.value === op2.value}
            renderInput={(params) => <TextField {...params} />}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  "& > img": { mr: 2, flexShrink: 0 },
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
                {...props}
              >
                <Typography sx={{ flex: 1, maxWidth: "85%" }}>
                  {option.label}
                </Typography>
                <Box
                  sx={{
                    p: 0.5,
                    backgroundColor: "green",
                    borderRadius: 1.2,
                    ml: 1,
                    width: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GroupOutlinedIcon sx={{ color: "white", fontSize: 14 }} />
                  <Typography sx={{ fontSize: 11, color: "white" }}>
                    {option.total_users_count}
                  </Typography>
                </Box>
              </Box>
            )}
            disableClearable
            noOptionsText="Aucun groupe trouvé"
          />

          {/* ----------------------------------------------------- */}
          <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.5 }}>
            Type de statistiques
          </Typography>
          <Select
            sx={{ marginBottom: 16 }}
            autoComplete="off"
            value={filters.stat_type}
            onChange={(e) => {
              if (!e) return;
              setFilters((prev) => ({
                ...prev,
                stat_type: e as StatEnum,
              }));
            }}
            data={STAT_TYPES}
          />

          {/* ----------------------------------------------------- */}
          <CustomSetting
            title="Exclure les appels de moins de "
            active={filters.exclude_short_value !== null}
            renderBody={() => (
              <TextField
                variant="standard"
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">S:</InputAdornment>
                  ),
                  inputProps: {
                    min: 1,
                  },
                }}
                type="phone"
                sx={{ width: "100%", mb: 2 }}
                value={filters.exclude_short_value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) {
                    setFilters((prev) => ({
                      ...prev,
                      exclude_short_value: null,
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      exclude_short_value: value,
                    }));
                  }
                }}
              />
            )}
            setActive={() => {
              setFilters((prev) => ({
                ...prev,
                exclude_short_value:
                  prev.exclude_short_value !== null ? null : 10,
              }));
            }}
            initiallyOpen={true}
          />
          <CustomSetting
            title="Exclure les appels de plus de "
            active={filters.exclude_long_value !== null}
            renderBody={() => (
              <TextField
                variant="standard"
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">S:</InputAdornment>
                  ),
                  inputProps: {
                    min: 1,
                  },
                }}
                type="phone"
                sx={{ width: "100%", mb: 2 }}
                value={filters.exclude_long_value ?? ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) {
                    setFilters((prev) => ({
                      ...prev,
                      exclude_long_value: null,
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      exclude_long_value: value,
                    }));
                  }
                }}
              />
            )}
            setActive={() => {
              setFilters((prev) => ({
                ...prev,
                exclude_long_value:
                  prev.exclude_long_value !== null ? null : 3600,
              }));
            }}
            initiallyOpen={true}
          />

          {/* ----------------------------------------------------- */}
            <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>

          <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.5 }}>
            Afficher les statistiques pour
          </Typography>

          <Tooltip title={`Afficher les statistiques pour les ${filters.period_in_days} derniers jours`} arrow >
            <HelpOutlineOutlinedIcon  sx={{fontSize: 16, color:"#797c7c"}}/>
            </Tooltip>
            </Box>

          <TextField
            variant="standard"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">Jour(s)</InputAdornment>
              ),
              inputProps: {
                min: 0,
                max: 14,
              },
            }}
            type="number"
            sx={{ width: "100%", mb: 2 }}
            value={filters.period_in_days}
            onChange={(e) => {
              let parsed = parseInt(e.target.value);
              let newValue = isNaN(parsed)
                ? undefined
                : parsed > 14
                ? 14
                : parsed < 0
                ? 0
                : parsed;

              setFilters((prev) => ({
                ...prev,
                period_in_days: newValue,
              }));
            }}
          />
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
            >
              Ajouter Contenu
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RingoverRSB;
