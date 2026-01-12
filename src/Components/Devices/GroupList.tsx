import React from "react";
import Box from "@mui/material/Box";
import { IDevice } from "../../types/api.types";
import DeviceGroup from "./DeviceGroup";
import SelectDevicesDialog from "./SelectDevicesDialog";
import useAuth from "../../hooks/useAuth";
import useStore from "../../store/store";


interface props {
  groups: Record<
    number,
    {
      groupInfo?: IDevice;
      children: IDevice[];
    }
  >;
  removeGroup: (groupId: number) => void;
  singleDevices: IDevice[];
  addDevicesToGroup: (groupId: number, deviceIds: number[]) => void;
  setSelectedIdToDelete: (deviceId: number, groupId: number) => void;
  unlinkDeviceFromGroup: (deviceId: number, groupId: number) => void;
  searchTerm: string;
}

const GroupList: React.FC<props> = ({
  groups,
  singleDevices,
  searchTerm,
  removeGroup,
  addDevicesToGroup,
  setSelectedIdToDelete,
  unlinkDeviceFromGroup,
}) => {
  const { userInfo } = useAuth();
const setErrorMsg = useStore(state => state.setErrorMsg) 
  const [isSelectDevicesOpen, setIsSelectDevicesOpen] = React.useState(false);
  const [selectedGroupId, setSelectedGroupId] = React.useState<number | null>(
    null
  );

  const handleRemoveGroup = async (groupId: number) => {
    if (userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    try {
      var payload = {
        groupId: groupId,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/unlink-group", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      var resJson = await res.json();

      if (resJson.success) {
        removeGroup(groupId);
      }
    } catch (e) {}
  };

  const handleLink = async (groupId: number, deviceIds: number[]) => {
    if (userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    if (deviceIds.length) {
      try {
        var payload = {
          groupId: groupId,
          deviceIds: deviceIds,
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

        if (resJson.success) {
          addDevicesToGroup(groupId, deviceIds);
        }
      } catch (e) {}
    }
  };

  const handleUnlink = async (deviceId: number, groupId: number) => {
    if (userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    try {
      var payload = {
        deviceId: deviceId,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/unlink-device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      var resJson = await res.json();

      if (resJson.success) {
        unlinkDeviceFromGroup(deviceId, groupId);
      }
    } catch (e) {}
  };

  return (
    <>
      <Box sx={{ width: "100%", px: 3 }}>
        {Object.keys(groups).map((groupId) => {
          let { groupInfo, children } = groups[parseInt(groupId)];
          if (!groupInfo) return <div key={groupId}></div>;

          let filteredChildrenBySearchTerm: IDevice[] = [];
          if (
            !groupInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            // group name doesn't match the search
            filteredChildrenBySearchTerm = children.filter((d) =>
              d.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (filteredChildrenBySearchTerm.length === 0) {
              // neither group name or children names match search
              return <div key={groupId}></div>;
            } else {
              // group name doesn't match the search but one or more children do
              // we do nothing
            }
          } else {
            // group name matches the search
            filteredChildrenBySearchTerm = children;
          }
          return (
            <DeviceGroup
              key={groupId}
              groupInfo={groupInfo}
              children={filteredChildrenBySearchTerm}
              onRemove={() => {
                handleRemoveGroup(parseInt(groupId));
              }}
              onAddDeviceToGroupPress={() => {
                if (userInfo?.privileges.devices !== true) {
                  setErrorMsg("Vous n'avez pas les droits nécessaires");
                } else {
                  setSelectedGroupId(parseInt(groupId));
                  setIsSelectDevicesOpen(true);
                }
              }}
              onDeleteDevicePress={(deviceId) => {
                setSelectedIdToDelete(deviceId, parseInt(groupId));
              }}
              onUnlinkDevicePress={(deviceId) => {
                handleUnlink(deviceId, parseInt(groupId));
              }}
            />
          );
        })}
      </Box>
      {isSelectDevicesOpen && selectedGroupId !== null && (
        <SelectDevicesDialog
          isOpen={isSelectDevicesOpen}
          onClose={() => {
            setIsSelectDevicesOpen(false);
          }}
          onSave={(deviceIds: number[]) => {
            handleLink(selectedGroupId, deviceIds);
            setSelectedGroupId(null);
            setIsSelectDevicesOpen(false);
          }}
          singleDevices={singleDevices}
        />
      )}
    </>
  );
};

export default GroupList;
