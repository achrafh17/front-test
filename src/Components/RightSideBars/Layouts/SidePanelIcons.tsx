// @ts-ignore
import { ReactComponent as LayerSVG } from "../../../assets/svg/editor-layout-icon.svg";
// @ts-ignore
import { ReactComponent as WeatherSVG } from "../../../assets/svg/editor-weather-icon.svg";
// @ts-ignore
import { ReactComponent as ClockSVG } from "../../../assets/svg/editor-clock-icon.svg";
// @ts-ignore
import { ReactComponent as PlaylistSVG } from "../../../assets/svg/editor-playlist-icon.svg";
import { canvasObjectType } from "../../../types";
import React from "react";

const SidePanelIcons: React.FC<{ id: canvasObjectType }> = ({ id }) => {
  if (id === "layer") {
    return <LayerSVG />;
  }

  if (id === "weather") {
    return <WeatherSVG />;
  }

  if (id === "clock") {
    return <ClockSVG />;
  }

  if (id === "playlist") {
    return <PlaylistSVG />;
  }

  return null;
};

export default SidePanelIcons;
