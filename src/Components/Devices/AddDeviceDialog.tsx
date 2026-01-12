import React, { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

import timezones from "../../assets/data/timezones.json"

//styles for select input
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      marginTop: 7,
    },
  },
};

interface props {
  open: boolean;
  onClose: () => void;
  onSave: (deviceForm: {
    code: string;
    name: string;
    timezone: string;
  }, callback: ()=>void) => void;
}

const AddDeviceDialog : React.FC<props> = ({ open, onClose, onSave }) => {
  const [deviceForm, setDeviceForm] = useState({
    code: "",
    name: "",
    timezone: "",
  });

  useEffect(() => {
    setDeviceForm((old) => {
      //@ts-ignore
      return { ...old, timezone: dayjs.tz.guess() };
    });
  }, [open]);

  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setDeviceForm({
      code: "",
      name: "",
      timezone: "",
    });
  };

  const handleSubmit = useCallback(() => {
    if (!!deviceForm.code && !!deviceForm.name && !!deviceForm.timezone) {
      setIsLoading(true);
      var newDevice = deviceForm;
      onSave(newDevice, () => {
        setIsLoading(false);
        clearForm();
        onClose();
      });
    }
  }, [deviceForm, onClose, onSave]);

  useEffect(() => {
    var f = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    if (open) {
      window.addEventListener("keypress", f);
    }

    return () => {
      window.removeEventListener("keypress", f);
    };
  }, [open, handleSubmit]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth id="add-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Ajouter un écran</DialogTitle>
        <CloseIcon
          onClick={onClose}
          
          sx={{ marginRight: 2, cursor: "pointer", color:"#ccc" }}
        />
      </div>
      <DialogContent>
        <Grid
          container
          rowSpacing={2}
          flexDirection="column"
          component="form"
          justifyContent="space-between"
          sx={{ height: "100%" }}
        >
          <Grid item>
            <TextField
              margin="dense"
              label="Code de l'écran"
              type="number"
              fullWidth
              autoComplete="off"
              variant="outlined"
              value={deviceForm.code}
              onChange={(e) => {
                setDeviceForm((old) => {
                  return {
                    ...old,
                    code: e.target.value,
                  };
                });
              }}
              onKeyDown={(e) => {
                //to stop user from entering e, E, + or -
                var invalidChars = "eE+-.";
                if (invalidChars.includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              margin="dense"
              label="Nom de l'écran"
              type="text"
              fullWidth
              autoComplete="off"
              variant="outlined"
              value={deviceForm.name}
              onChange={(e) => {
                setDeviceForm((old) => {
                  return {
                    ...old,
                    name: e.target.value,
                  };
                });
              }}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="testid">Fuseau Horaire</InputLabel>
              <Select
                label="Fuseau Horaire"
                labelId="testid"
                fullWidth
                value={deviceForm.timezone}
                onChange={(e) => {
                  setDeviceForm((old) => {
                    return {
                      ...old,
                      timezone: e.target.value,
                    };
                  });
                }}
                MenuProps={MenuProps}
              >
                {timezones.map((timezone, idx) => {
                  return (
                    <MenuItem key={idx} value={timezone.value}>
                      {timezone.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        {isLoading ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Button onClick={onClose} variant="outlined" sx={{ paddingX: 5 }}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              variant="contained"
              sx={{ paddingX: 5 }}
            >
              Ajouter
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default AddDeviceDialog;
