import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IDevice } from "../../../types/api.types";
import DeviceRow from "./DeviceRow";
import UnlinkDeviceDialog from "./UnlinkDeviceDialog";
import SelectDevicesDialog from "../../Devices/SelectDevicesDialog";
import useAuth from "../../../hooks/useAuth";


interface props {
  groupId: number;
  groupChildren: IDevice[];
  onUnlinkChild: (deviceId: number) => void;
  onAddChildren: (deviceInfos: IDevice[]) => void;
}

const GroupChildrenRSB: React.FC<props> = ({
  groupId,
  groupChildren,
  onAddChildren,
  onUnlinkChild,
}) => {
  const {userInfo } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [deviceIdtoUnlink, setDeviceIdToUnlink] = useState<number | null>(null);
  const [isSelectDevicesDialogOpen, setIsSelectDevicesDialogOpen] =
    useState(false);

  const [singleDevices, setSingleDevices] = useState<IDevice[]>([]);

  useEffect(() => {
    fetch(`https://www.powersmartscreen.com/get-devices?sessionId=${userInfo?.sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson?.success) {
          var result = resJson.result as IDevice[];
          setSingleDevices(
            result.filter(
              (device) => device.parentId === null && device.isGroup === false
            )
          );
        }
      })
      .catch((e) => {
      });

  }, [userInfo?.sessionId]);

  const handleAddDevicePress = () => {
    setIsSelectDevicesDialogOpen(true);
  };

  const handleUnlinkDevicePress = async (deviceId: number) => {
    setDeviceIdToUnlink(deviceId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "#575b5c",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: 18 }}>
          Groupe d'écrans
        </Typography>
      </Box>
      <input
        className="stripped-input"
        style={{
          borderBottom: "1px solid #d9dfe0",
          height: 41,
          padding: "0 24px",
          width: "100%",
        }}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
        placeholder="Rechercher..."
      />
      <Box sx={{ px: 3, py: 1 }}>
        <Box
          sx={{
            height: "calc(100vh - 60px - 81px - 42px - 80px)",
            maxHeight: "calc(100vh - 60px - 81px - 42px - 80px)",
            overflowY: "scroll",
          }}
          className="hide-scrollbar"
        >
          {groupChildren.map((device, idx) => {
            if (!device.name.includes(searchValue)) {
              return <Box key={idx}></Box>;
            }
            return (
              <DeviceRow
                key={idx}
                handleUnlinkDevicePress={handleUnlinkDevicePress}
                device={device}
              />
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          padding: 2,
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" fullWidth onClick={handleAddDevicePress}>
          Ajouter un écran
        </Button>
      </Box>
      {deviceIdtoUnlink !== null && (
        <UnlinkDeviceDialog
          deviceId={deviceIdtoUnlink}
          open={deviceIdtoUnlink !== null}
          onClose={() => {
            setDeviceIdToUnlink(null);
          }}
          onDeviceUnlinked={() => {
            onUnlinkChild(deviceIdtoUnlink);
            setDeviceIdToUnlink(null);
          }}
        />
      )}
      <SelectDevicesDialog
        isOpen={isSelectDevicesDialogOpen}
        onClose={() => {
          setIsSelectDevicesDialogOpen(false);
        }}
        onSave={(newDeviceIds) => {
          onAddChildren(
            singleDevices.filter((d) => newDeviceIds.includes(d.deviceId))
          );
        }}
        singleDevices={singleDevices}
        groupId={groupId}
        persist={true}
      />
    </Box>
  );
};

export default GroupChildrenRSB;
