import { useNavigate, useParams } from "react-router-dom";
import "../../styles/SingleDevice.css";
import useAuth from "../../hooks/useAuth";
import React, { useCallback, useEffect, useState } from "react";
import useRSB from "../../hooks/useRSB";
import useSliderValue from "../../hooks/useSliderValue";
import { IDeviceSingle, IDevice } from "../../types/api.types";
import Topbar from "./Topbar";
import DeviceAddPlaylist from "../RightSideBars/DeviceAddPlaylists";
import TitleBar from "./TitleBar";
import DevicePlaylistsView from "./DevicePlaylistsView";
import DeviceSettings from "../RightSideBars/DeviceSettings";
import GroupChildrenRSB from "../RightSideBars/GroupChildrenRSB";
import useStore from "../../store/store";

const Main: React.FC<{}> = () => {
  const { setRsbVariant } = useRSB();

  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const params = useParams();

  const deviceHashId = params.deviceHashId ?? "";
  if (!deviceHashId) {
    navigate("/devices");
  }

const setErrorMsg = useStore((state) => state.setErrorMsg);
  const [deviceInfo, setDeviceInfo] = useState<IDeviceSingle | null>(null);
  const [showContents, setShowContents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTimeline, setShowTimeline] = useState(false);
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [refresh, setRefresh] = useState(false); //whenever we change this state, we request the playlists again


  const fetchDeviceInfo = useCallback((hashId: string, sessionId: string) => {
    fetch(
      `https://www.powersmartscreen.com/get-device-info?sessionId=${sessionId}&hashId=${hashId}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          var result = resJson.result as IDeviceSingle;
          setDeviceInfo(result);
        } else {
          navigate("/devices");
        }
      })
      .catch((e) => {});
  }, [navigate])

  function onAddPlaylistBtnPress() {
    if(userInfo?.privileges.devices !== true) {
      setErrorMsg("Vous n'avez pas les droits nécessaires");
      return;
    }
    if (deviceInfo && deviceInfo.parent === null) {
      setRsbVariant({
        name: "DEVICE_ADD_PLAYLIST",
        renderComponent: () => (
          <DeviceAddPlaylist
            deviceId={deviceInfo.deviceId}
            onSuccess={() => {
              setRefresh((old) => !old);
            }}
          />
        ),
      });
    }
  }

  const onShowSettingsPress = useCallback(() => {
    if (deviceInfo) {
      setRsbVariant({
        name: "SINGLE_DEVICE",
        renderComponent: () => (
          <DeviceSettings
            deviceInfo={deviceInfo}
            onNewDeviceInfo={(newDeviceInfo) => setDeviceInfo(newDeviceInfo)}
          />
        ),
      });
    }
  }, [deviceInfo, setRsbVariant]);

  const handleUnlinkChild = (deviceId: Number) => {
    setDeviceInfo((old) => {
      if (old !== null) {
        return {
          ...old,
          children: old.children.filter((d) => d.deviceId !== deviceId),
        };
      }
      return old;
    });
  };

  const handleAddChildren = (newDevices: IDevice[]) => {
    setDeviceInfo((old) => {
      if (old !== null) {
        return {
          ...old,
          children: old.children.concat(newDevices),
        };
      }
      return old;
    });
  };

  const onShowChildrenRSBPress = useCallback(() => {
    if (deviceInfo && deviceInfo.isGroup) {
      setRsbVariant({
        name: "GROUP_ADD_DEVICE",
        renderComponent: () => (
          <GroupChildrenRSB
            groupId={deviceInfo.deviceId}
            groupChildren={deviceInfo.children}
            onUnlinkChild={handleUnlinkChild}
            onAddChildren={handleAddChildren}
          />
        ),
      });
    }
  }, [deviceInfo, setRsbVariant]);

  useEffect(() => {
    onShowSettingsPress();
  }, [onShowSettingsPress]);

  useEffect(() => {
    //fetch device info based on deviceId
    if (deviceHashId && userInfo?.sessionId) {
      fetchDeviceInfo(deviceHashId, userInfo?.sessionId);
    }
  }, [deviceHashId, userInfo?.sessionId, fetchDeviceInfo]);

  return (
    <div className="main-screen">
      <Topbar
        sliderMax={sliderMax}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        showTimeline={showTimeline}
        setShowTimeline={setShowTimeline}
        showContents={showContents}
        setShowContents={setShowContents}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAddPlaylistBtnPress={onAddPlaylistBtnPress}
      />
      {deviceInfo !== null && (
        <>
          <TitleBar
            deviceInfo={deviceInfo}
            onShowSettingsPress={onShowSettingsPress}
            onShowChildrenRSBPress={onShowChildrenRSBPress}
          />
          <DevicePlaylistsView
            deviceInfo={deviceInfo}
            showContents={showContents}
            showTimeline={showTimeline}
            sliderValue={sliderValue}
            refresh={refresh}
            searchTerm={searchTerm}
          />
        </>
      )}
       
    </div>
  );
};

export default Main;
