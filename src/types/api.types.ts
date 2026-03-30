import { ICanvasObject } from "./index";

// ------------------- START OF PRISMA MODEL TYPES -------------------

export interface IUser {
  userId: number;
  userName: string | null;
  company: string | null;
  email: string;
  password: string;
  phone: string | null;
  picture: string | null;
  adminId: number | null;
  admin: IUser | null;
  parentId: number | null;
  isActive: boolean;
  maxUploadSize: string;
}

export interface IUserPrivileges {
  privilegeId: number;
  userId: number;
  devices: boolean;
  playlists: boolean;
  contents: boolean;
  layers: boolean;
  stats: boolean;
}

export interface IDevice {
  deviceId: number;
  code: string;
  active: boolean | null;
  name: string;
  online: boolean | null;
  location: string | null;
  dateAdded: string | null;
  playerVersion: string | null;
  timeLastSync: string | null;
  timezone: string | null;
  operatingSystem: string | null;
  screenResolution: string | null;
  usedOnTotal: string | null;
  screenOrientation: number | null;
  displayMode: string | null;
  volume: number | null;
  brightness: string | null;
  sleepMode: boolean | null;
  silentMode: boolean | null;
  sleepStart: string | null;
  sleepEnd: string | null;
  silentStart: string | null;
  silentEnd: string | null;
  hashId: string;
  isGroup: boolean;
  parentId: number | null;
  token: string;
  userId: number | null;
  children: IDevice[] | null;
}

export interface IPlaylist {
  playlistId: number;
  name: string;
  totalDuration: number | null;
  numberOfScreens: number | null;
  numberOfWidgets: number | null;
  userId: number;
}

export interface IContent {
  contentId: number;
  title: string;
  type: string;
  path: string | null;
  previewPath: string | null;
  originalHeight: number | null;
  originalWidth: number | null;
  duration: number | null;
  filesize: number | null;
  aspectRatio: number | null;
  createdAt: Date | null;
  showTotal: number;
  showTime: number;
  blocked: boolean | null;
  validateTime: boolean | null;
  validFrom: number | null;
  validTill: number | null;
  appInfo: string | null;
  userId: number;
}

export interface IContent2Playlist {
  linkId: number;
  contentId: number;
  playlistId: number;
  sequence: number;
  linkDuration: number;
}

export interface IPlaylist2Device {
  linkId: number;
  playlistId: number;
  deviceId: number;
  sequence: number;
  layoutId: number | null;
  timeStart: string;
  timeEnd: string;
}

export interface ILayout {
  layoutId: number;
  hashId: string;
  name: string;
  userId: number;
}

export interface ISlide {
  slideId: number;
  hashId: string;
  name: string;
  isMainSlide: boolean;
  layoutId: number;
  state: string;
}

// ------------------- END OF PRISMA MODEL TYPES -------------------

// ------------------- START OF BACKEND RESPONSE TYPES -------------------

export type IUserInfo = IUser & {
  sessionId: string;
  parent: IUser | null;
  children: IUser[];
  privileges: userPrivilegesStripped;
};

export type IDeviceSingle = IDevice & {
  parent: IDevice | null;
  children: IDevice[];
};

export type IDevicePlaylist = IPlaylist & {
  contents: PlaylistContent[];
  linkId: number;
  sequence: number;
  timeStart: string;
  timeEnd: string;
  layoutId: number | null;
};

export type PlaylistDevice = IDevice & {
  linkId: number;
  sequence: number;
  timeStart: string;
  timeEnd: string;
};

export type PlaylistContent = IContent & {
  linkId: number;
  linkDuration: number;
  sequence: number;
};

export type IPlaylistInfo = IPlaylist & {
  devices: PlaylistDevice[];
  contents: PlaylistContent[];
};

export interface ILayoutInfo {
  layoutId: number;
  hashId: string;
  name: string;
  userId: number;
  slides: ISlide[];
}

export interface ISlideState {
  frameWidth: number;
  frameHeight: number;
  layers: Omit<ICanvasObject, "object">[];
}

export type userPrivilegesStripped = {
  devices: boolean;
  contents: boolean;
  layers: boolean;
  playlists: boolean;
  stats: boolean;
};

//for the users management page
export type IUserSingle = {
  userId: number;
  email: string;
  userName: string | null;
  privileges: userPrivilegesStripped;
};

export type IaddUserResponseResult = IUserSingle & {
  password: string;
};

type tweetPost = {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  edit_history_tweet_ids: string[];
  attachments?: {
    media_keys?: string[];
  };
};

type twitterUser = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  verified: boolean;
};

type twitterMedia = {
  height: number;
  width: number;
  type: string;
  media_key: string;
  url?: string;
  preview_image_url?: string;
};

export interface ITwitterApiResponse {
  data: tweetPost[];
  includes: {
    users: twitterUser[];
    media?: twitterMedia[];
  };
}

export interface IFormattedTwitterApiResponse {
  data: tweetPost[];
  users: Record<string, twitterUser>;
  media?: Record<string, twitterMedia>;
}
