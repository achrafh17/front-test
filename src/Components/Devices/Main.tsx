import "../../styles/Devices.css";
import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import DevicesList from "./DevicesList";
import AddDeviceDialog from "./AddDeviceDialog";
import AddGroupDialog from "./AddGroupDialog";
import useAuth from "../../hooks/useAuth";
import { IDevice, IDeviceSingle } from "../../types/api.types";
//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
//@ts-ignore
import { ReactComponent as BoxesSvg } from "../../assets/svg/4-boxes.svg";
//@ts-ignore
import { ReactComponent as MapMarkerSvg } from "../../assets/svg/map-marker.svg";
import useRSB from "../../hooks/useRSB";
import GroupList from "./GroupList";
import DeleteDeviceDialog from "./DeleteDeviceDialog"
import DeviceDefaultRSB from "../RightSideBars/DeviceDefaultRSB"
import useStore from "../../store/store"

interface IdevicesFormatted {
  single: IDevice[];
  groups: Record<
    number,
    {
      groupInfo?: IDevice;
      children: IDevice[];
    }
  >;
}


const Main: React.FC<{}> = () => {
  const { setRsbVariant } = useRSB();
  useEffect(() => {
    setRsbVariant({ name: "DEVICES_DEFAULT", renderComponent: () => <DeviceDefaultRSB /> });
  }, [setRsbVariant]);

  const { userInfo } = useAuth();
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const [devices, setDevices] = useState<IdevicesFormatted>({
    single: [],
    groups: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const setErrorMsg = useStore((state) => state.setErrorMsg);

  // to delete
  const [selectedIdToDelete, setSelectedIdToDelete] = useState<number | null>(
    null
  );
  const [groupIdToDeleteDeviceFrom, setGroupIdToDeleteDeviceFrom] = useState<number|null>(null)

  useEffect(() => {
    var sessionId = userInfo?.sessionId;
    setIsLoading(true);
    fetch(`https://www.powersmartscreen.com/get-devices?sessionId=${sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson?.success) {
          setIsLoading(false);

          var result = resJson.result as IDeviceSingle[];
          var devicesFormatted: IdevicesFormatted = {
            single: [],
            groups: {},
          };
          result.forEach((device) => {
              if (device.isGroup) {
                devicesFormatted.groups[device.deviceId] = {
                  groupInfo: device, 
                  children: device.children
                }
              } else {
                devicesFormatted.single.push(device);
              }
            
          });
          // console.log(result);
          // console.log(devicesFormatted)
          setDevices(devicesFormatted);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setErrorMsg(
          "Une erreur est survenue lors de la récupération des écrans"
        );
      });
  }, [userInfo?.sessionId, setErrorMsg]);

  const openAddScreenModal = () => {
    if(userInfo?.privileges.devices === true){
      setIsDeviceModalOpen(true);
    }else{
      setErrorMsg("Vous n'avez pas les droits nécessaires")
    }
  };

  const openAddGroupModal = () => {
    if(userInfo?.privileges.devices === true){
      setIsGroupModalOpen(true);
    }else{
      setErrorMsg("Vous n'avez pas les droits nécessaires")
    }
  };

  const openDeleteDeviceDialog = (deviceId: number, groupId?: number) => {
    if(userInfo?.privileges.devices){
      setSelectedIdToDelete(deviceId);
      if(groupId !== undefined){
        setGroupIdToDeleteDeviceFrom(groupId)
      }
    }else{
      setErrorMsg("Vous n'avez pas les droits nécessaires")
    }
  }

  const closeDeleteDeviceDialog = () => {
    setSelectedIdToDelete(null)
    setGroupIdToDeleteDeviceFrom(null);
  }

  const addDevice = async (newDevice: Partial<IDevice>, callback: () => void) => {
    try {
      var payload = {
        code: newDevice.code,
        name: newDevice.name,
        timezone: newDevice.timezone,
        sessionId: userInfo?.sessionId,
      };
      var res = await fetch("https://www.powersmartscreen.com/add-device", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      callback();
      if (resJson?.success) {
        var newDeviceInfo = resJson.result as IDevice;
        setDevices((old) => {
          return { ...old, single: [...old.single, newDeviceInfo] };
        });
      } else {
        if (resJson?.reason === "invalid_code") {
          setErrorMsg("Le code fourni est invalide");
        } else if (resJson?.reason === "invalid_session") {
          setErrorMsg(
            "Votre session est expirée. Veuillez vous déconnecter et vous reconnecter"
          );
        }
      }
    } catch (e) {
      callback();
      setErrorMsg("Une erreur est survenue");
    }
  };

  const addGroup = async (
    newGroup: { name: string; children: number[] },
    callback: () => void
  ) => {
    try {
      var payload = {
        name: newGroup.name,
        children: newGroup.children,
        sessionId: userInfo?.sessionId,
      };

      var res = await fetch("https://www.powersmartscreen.com/add-group", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      var resJson = await res.json();
      callback();
      if (resJson?.success) {
        var result = resJson.result as {
          groupInfo: IDevice;
          children: number[];
        };

        setDevices((old) => {
          var newlyAddedDevices = old.single.filter((device) =>
            result.children.includes(device.deviceId)
          );
          return {
            single: old.single.filter(
              (device) => !result.children.includes(device.deviceId)
            ),
            groups: {
              ...old.groups,
              [result.groupInfo.deviceId]: {
                groupInfo: result.groupInfo,
                children: newlyAddedDevices,
              },
            },
          };
        });
      } else {
        if (resJson?.reason === "invalid_code") {
          setErrorMsg("Le code fourni est invalide");
        } else if (resJson?.reason === "invalid_session") {
          setErrorMsg(
            "Votre session est expirée. Veuillez vous déconnecter et vous reconnecter"
          );
        }
      }
    } catch (e) {
      callback();
      setErrorMsg("Une erreur est survenue");
    }
  };

  const removeDevice = (deviceId: number, groupId?: number) => {
    if(groupId === undefined){
      setDevices((old) => {
        return {
          single: old.single.filter((device) => device.deviceId !== deviceId),
          groups: { ...old.groups },
        };
      });
    }else{
      setDevices((old) => {
        return {
          single: old.single,
          groups: {
            ...old.groups,
            [groupId]: {
              groupInfo: old.groups[groupId].groupInfo,
              children: old.groups[groupId].children.filter(
                (device) => device.deviceId !== deviceId
              ),
            },
          },
        };
      })
    }
  };

  const removeGroup = (groupId: number) => {
    setDevices((old) => {
      var newGroups = { ...old.groups };
      var newSingle = [...old.single];
      if (newGroups?.[groupId] !== undefined) {
        newSingle = [...newSingle, ...old.groups[groupId].children];
        delete newGroups[groupId];
      }
      return {
        single: newSingle,
        groups: newGroups,
      };
    });
  };

  const addDevicesToGroup = (groupId: number, deviceIds: number[]) => {
    setDevices((old) => {
      var newlyAddedDevices = old.single.filter((device) =>
        deviceIds.includes(device.deviceId)
      );
      return {
        single: old.single.filter(
          (device) => !deviceIds.includes(device.deviceId)
        ),
        groups: {
          ...old.groups,
          [`${groupId}`]: {
            groupInfo: old.groups[groupId].groupInfo,
            children: old.groups[groupId].children.concat(newlyAddedDevices),
          },
        },
      };
    });
  };

  const removeDeviceFromGroup = (deviceId: number, groupId: number ) => {
    setDevices(old=> {
      var deviceInfo = old.groups[groupId].children.find(d => d.deviceId === deviceId)
      if(deviceInfo){
        return {
          single: old.single.concat(deviceInfo),
          groups: {
            ...old.groups,
            [groupId]: {
              groupInfo: old.groups[groupId].groupInfo,
              children: old.groups[groupId].children.filter(
                (d) => d.deviceId !== deviceId
              ),
            },
          },
        };

      }else{
        return {...old}
      }
    })
  }

  return (
    <div className="main-screen">
      <div className="main-screen-top">
        <div className="search">
          <SearchSvg fill="none" stroke="#bec4c4" />
          <input
            type="text"
            placeholder="Commencez à taper pour chercher des écrans..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
            }}
          />
        </div>
        <Tooltip
          title={<Typography fontSize={15}>Afficher les écrans</Typography>}
          placement="top"
          arrow
          className="hover-dark fill"
        >
          <BoxesSvg />
        </Tooltip>
        <Tooltip
          title={
            <Typography fontSize={15}>
              Afficher les écrans sur le plan
            </Typography>
          }
          placement="top"
          arrow
          className="hover-dark fill"
        >
          <MapMarkerSvg />
        </Tooltip>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={openAddGroupModal}
        >
          Ajouter un groupe
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={openAddScreenModal}
        >
          Ajouter un écran
        </Button>
      </div>
      <DevicesList
        openAddScreenModal={openAddScreenModal}
        devices={devices.single}
        isLoading={isLoading}
        setSelectedIdToDelete={(deviceId)=>{
          openDeleteDeviceDialog(deviceId)
        }}
        searchTerm={searchTerm}
        />
      <GroupList
        groups={devices.groups}
        removeGroup={removeGroup}
        addDevicesToGroup={addDevicesToGroup}
        singleDevices={devices.single}
        setSelectedIdToDelete={(deviceId, groupId)=>{
          openDeleteDeviceDialog(deviceId, groupId)
        }}
        unlinkDeviceFromGroup={removeDeviceFromGroup}
        searchTerm={searchTerm}
      />
      {isDeviceModalOpen && (
        <AddDeviceDialog
          open={isDeviceModalOpen}
          onClose={() => {
            setIsDeviceModalOpen(false);
          }}
          onSave={addDevice}
        />
      )}
      {isGroupModalOpen && (
        <AddGroupDialog
          singleDevices={devices.single}
          open={isGroupModalOpen}
          onClose={() => {
            setIsGroupModalOpen(false);
          }}
          onSave={addGroup}
        />
      )}
      <DeleteDeviceDialog
        deviceId={selectedIdToDelete}
        open={selectedIdToDelete !== null}
        onClose={closeDeleteDeviceDialog}
        groupId={groupIdToDeleteDeviceFrom ?? undefined}
        onDelete={(deletedId: number, groupId?: number) => {
          removeDevice(deletedId, groupId);
          closeDeleteDeviceDialog()
        }}  
      />
    </div>
  );
};

export default Main;
