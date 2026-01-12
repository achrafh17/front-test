import React from "react";
import { IContent, IDevice, IPlaylist } from "./api.types";

type VariantName =
  | "NULL"
  | "DEVICES_DEFAULT"
  | "SINGLE_DEVICE"
  | "DEVICE_ADD_PLAYLIST"
  | "GROUP_ADD_DEVICE"
  | "CONTENT_DEFAULT"
  | "SINGLE_CONTENT"
  | "PLAYLIST_DEFAULT"
  | "PLAYLIST_ADD_CONTENT"
  | "PLAYLIST_ADD_SCREEN"
  | "APPS_DEFAULT"
  | "APPS_YOUTUBE"
  | "APPS_EURONEWS"
  | "APPS_ODJ"
  | "APPS_RSS"
  | "APPS_SLIDER"
  | "APPS_FB_VIDEO"
  | "APPS_TV5"
  | "APPS_CLOCK"
  | "APPS_FRANCE24"
  | "APPS_METEO"
  | "APPS_EMBED"
  | "APPS_TWITTER"
  | "APPS_INSTAGRAM"
  | "APPS_RINGOVER"
  | "APPS_GAMES"
  | "LAYOUTS_DEFAULT"
  | "LAYOUTS_EDITOR"
  | "ADD_LAYOUT"
  | "USERS_DEFAULT"
  | "USER_SETTINGS";

interface NullRSBProps {}
interface EmptyRSBProps {}
interface DevicesDefaultRSBProps {}
interface SingleDeviceRSBProps {
  deviceInfo: IDevice;
}
interface DeviceAddPlaylistRSBProps {
  onSave: (newPlaylist: IPlaylist) => void;
}
interface ContentDefaultRSBProps {
  addContent: () => void;
}
interface SingleContentRSBProps {
  contentInfo: IContent;
}
interface PlaylistDefaultRSBProps {
  addPlaylist: () => void;
}
interface PlaylistAddContentRSBProps {
  playlistId: number;
  handleAddContent: (newContents: IContent[], playlistId: number) => void;
}
interface PlaylistAddScreenRSBProps {
  playlistName: string;
  playlistId: number;
  playlistDevices: IDevice[];
  handleAddScreens: (newDevices: IDevice[], playlistId: number) => void;
}
interface AppsDefaultRSBProps {}
interface LayoutsDefaultRSBProps {
  addLayout: () => void;
}

interface RSBProps {
  name: VariantName;
  renderComponent: () => JSX.Element | null;
}

export {
  VariantName,
  NullRSBProps,
  EmptyRSBProps,
  DevicesDefaultRSBProps,
  SingleDeviceRSBProps,
  DeviceAddPlaylistRSBProps,
  ContentDefaultRSBProps,
  SingleContentRSBProps,
  PlaylistDefaultRSBProps,
  PlaylistAddContentRSBProps,
  PlaylistAddScreenRSBProps,
  AppsDefaultRSBProps,
  LayoutsDefaultRSBProps,
  RSBProps,
};
