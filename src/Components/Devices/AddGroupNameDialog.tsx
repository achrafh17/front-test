import React, { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography, Checkbox } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
//@ts-ignore
import { ReactComponent as DeviceAvatarSvg } from "../../assets/svg/device-avatar.svg";
import { IDevice } from "../../types/api.types";

interface props {
  singleDevices: IDevice[];
  open: boolean;
  onClose: () => void;
  onSave: (
    groupInfo: { name: string; children: number[] },
    callback: () => void
  ) => void;
}

const AddGroupDialog: React.FC<props> = ({ open, singleDevices, onClose, onSave }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedScreenIds, setSelectedScreenIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setGroupName("")
    setSelectedScreenIds([])
  };

  const handleSubmit = useCallback(() => {
    var newGroupInfo = {
      name: groupName,
      children: selectedScreenIds
    }
    setIsLoading(true);
    onSave(newGroupInfo, ()=>{
      setIsLoading(false);
      clearForm();
      onClose();
    })
    
  }, [groupName, selectedScreenIds, onClose, onSave]);


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
    <Dialog open={open} onClose={onClose} fullWidth scroll="paper" id="add-screen-dialog">
      <div className="add-dialog-top">
        <DialogTitle>Ajouter un groupe</DialogTitle>
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
              label="Nom du groupe"
              fullWidth
              autoComplete="off"
              variant="outlined"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value)
              }}
            />
          </Grid>
          <Grid item>
            <Typography>Selectionner les écrans à ajouter dans le groupe</Typography>
            {singleDevices.map((device, idx) => {
              return (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                    pl: 1,
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#d9dfe0",
                      border: "2px solid white",
                      borderRadius: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DeviceAvatarSvg width={24} height={24} />
                  </Box>
                  <Typography sx={{ flex: 1 }}>{device.name}</Typography>
                  <Checkbox
                    icon={<RadioButtonUncheckedIcon sx={{ fontSize: 24 }} />}
                    checkedIcon={
                      <CheckCircleIcon
                        sx={{ color: "#F00020", fontSize: 24 }}
                      />
                    }
                    checked={selectedScreenIds.includes(device.deviceId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedScreenIds((old) => [
                          ...old,
                          device.deviceId,
                        ]);
                      } else {
                        setSelectedScreenIds((old) => {
                          return old.filter((id) => id !== device.deviceId);
                        });
                      }
                    }}
                  />
                </Box>
              );
            })}
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

export default AddGroupDialog;