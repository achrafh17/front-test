import React from "react"
import useAuth from "../../../hooks/useAuth";
import { IDeviceSingle } from "../../../types/api.types"
import DeviceEditableSettings from "./DeviceEditableSettings"
import DeviceReadOnlySettings from "./DeviceReadOnlySettings"


interface props {
  deviceInfo: IDeviceSingle;
  onNewDeviceInfo?: (newDeviceInfo: IDeviceSingle) => void;
}

const DeviceSettings: React.FC<props> = ({deviceInfo, onNewDeviceInfo}) => {

  const {userInfo}= useAuth();

  if (deviceInfo.parentId === null && onNewDeviceInfo !== undefined && userInfo?.privileges.devices === true)
    return (
      <DeviceEditableSettings
        deviceInfo={deviceInfo}
        onNewDeviceInfo={onNewDeviceInfo}
      />
    );

  return (
    <DeviceReadOnlySettings
      deviceInfo={deviceInfo}
      onNewDeviceInfo={onNewDeviceInfo}
    />
  );
}

export default DeviceSettings;