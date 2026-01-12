//  tbd
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IDevice } from "../../types/api.types";
//@ts-ignore
import { ReactComponent as DeviceAvatarSvg } from "../../assets/svg/device-avatar.svg";
import useAuth from "../../hooks/useAuth";

interface props {
  singleDevices: IDevice[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (deviceIds: number[]) => void;
  persist?: boolean;
  groupId?: number;
}

const SelectDevicesDialog: React.FC<props> = ({
  isOpen,
  onClose,
  singleDevices,
  onSave,
  persist,
  groupId,
}) => {
  const { userInfo } = useAuth();
  const [selectedScreenIds, setSelectedScreenIds] = React.useState<number[]>(
    []
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!persist || !groupId) {
      onSave(selectedScreenIds);
      return;
    }

    setIsLoading(true);
    try {
      var payload = {
        groupId: groupId,
        deviceIds: selectedScreenIds,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/add-devices-to-group", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      var resJson = await res.json();

      setIsLoading(false);
      if (resJson.success) {
        onSave(selectedScreenIds);
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      scroll="paper"
      id="select-device-dialog"
    >
      <div className="add-dialog-top">
        <DialogTitle>Sélectionner les écrans</DialogTitle>
        <CloseIcon
          onClick={onClose}
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
            <Typography>
              Sélectionner les écrans à ajouter dans le groupe
            </Typography>
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
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress
              sx={{
                width: 24,
                height: 24,
              }}
            />
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
              disabled={selectedScreenIds.length === 0}
            >
              Ajouter
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SelectDevicesDialog;
