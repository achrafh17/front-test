import { Box, Typography, Stack, Checkbox } from "@mui/material";
import { IDevice } from "../../types/api.types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface Props {
  title: string;
  devices: IDevice[];
  selectedDeviceIds: number[];
  handleToggleDevice: (a: number) => void;
}
export default function DeviceList({
  title,
  devices,
  selectedDeviceIds,
  handleToggleDevice,
}: Props) {
  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={1}>
        {devices.map((d) => {
          const selected = selectedDeviceIds.includes(d.deviceId);

          return (
            <Box
              key={d.deviceId}
              onClick={() => handleToggleDevice(d.deviceId)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                border: selected ? "2px solid #1976d2" : "1px solid #e0e0e0",
                backgroundColor: selected ? "#f0f7ff" : "white",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  boxShadow: 2,
                },
              }}
            >
              <Typography fontWeight={500}>{d.name}</Typography>

              <Checkbox
                checked={selected}
                onClick={(e) => e.stopPropagation()}
                onChange={() => {
                  handleToggleDevice(d.deviceId);
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
