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
import { IDevice } from "../../types/api.types";
import SelectDevicesDialog from "./SelectDevicesDialog";

interface props {
  singleDevices: IDevice[];
  open: boolean;
  onClose: () => void;
  onSave: (
    groupInfo: { name: string; children: number[] },
    callback: () => void
  ) => void;
}

const AddGroupDialog: React.FC<props> = ({
  open,
  singleDevices,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState("");
  const [selectedScreenIds, setSelectedScreenIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGroupNameDialogOpen, setIsGroupNameDialogOpen] =
    useState(false);

  const clearForm = () => {
    setGroupName("");
    setSelectedScreenIds([]);
  };

  const handleSubmit = useCallback(() => {
    var newGroupInfo = {
      name: groupName,
      children: selectedScreenIds,
    };
    console.log(newGroupInfo)
    setIsLoading(true);
    onSave(newGroupInfo, () => {
      setIsLoading(false);
      clearForm();
      onClose();
    });
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
    <>
      <SelectDevicesDialog
        isOpen={true}
        onClose={onClose}
        singleDevices={singleDevices}
        onSave={(deviceIds) => {
          setSelectedScreenIds(deviceIds);
          setIsGroupNameDialogOpen(true);
        }}
      />
      <Dialog
        open={isGroupNameDialogOpen}
        onClose={() => {
          setIsGroupNameDialogOpen(false)
        }}
        fullWidth
      >
        <div className="add-dialog-top">
          <DialogTitle>Ajouter un groupe</DialogTitle>
          <CloseIcon
            onClick={()=>{
              setIsGroupNameDialogOpen(false)
            }}
            sx={{ marginRight: 2, cursor: "pointer", color: "#ccc" }}
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
                  setGroupName(e.target.value);
                }}
              />
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
              <Button onClick={()=>{
                setIsGroupNameDialogOpen(false)
              }} variant="outlined" sx={{ paddingX: 5 }}>
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
    </>
  );
};

export default AddGroupDialog;
