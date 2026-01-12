import React from "react"
//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
//@ts-ignore
import { ReactComponent as HideTileActiveSVG } from "../../assets/svg/hide-tile-active.svg";
//@ts-ignore
import { ReactComponent as ShowTileActiveSVG } from "../../assets/svg/show-tile-active.svg";
//@ts-ignore
import { ReactComponent as BoxesSvg } from "../../assets/svg/4-boxes.svg";
//@ts-ignore
import { ReactComponent as ScheduleSVG } from "../../assets/svg/schedule.svg";
import { Slider, Tooltip, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";



interface props {
  sliderMax: number;
  sliderValue: number;
  setSliderValue: React.Dispatch<React.SetStateAction<number>>;
  showTimeline: boolean;
  setShowTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  showContents: boolean;
  setShowContents: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onAddPlaylistBtnPress: () => void
}

const Topbar: React.FC<props> = ({
  sliderMax,
  sliderValue,
  setSliderValue,
  showContents,
  setShowContents,
  showTimeline,
  setShowTimeline,
  searchTerm, setSearchTerm,
  onAddPlaylistBtnPress
}) => {
  return (
    <div className="main-screen-top">
      <div className="search">
        <SearchSvg fill="none" stroke="#bec4c4" />
        <input
          type="text"
          placeholder="Commencez à taper pour chercher des playlists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <CustomSlider
        sx={{ width: 100, color: "#bec4c4", mx: 1 }}
        step={1}
        min={1}
        max={sliderMax}
        size="small"
        value={sliderValue}
        onChange={(e) => {
          if (e?.target) {
            //@ts-ignore
            setSliderValue(parseInt(e.target.value));
          }
        }}
      />
      <Tooltip
        title={
          <Typography fontSize={12} sx={{ textAlign: "center", maxWidth: 200 }}>
            Masquer ou afficher le contenu de toutes les playlists
          </Typography>
        }
        placement="top"
        arrow
        onClick={() => {
          if (showTimeline) {
            setShowTimeline(false);
          } else {
            setShowContents((old) => !old);
          }
        }}
      >
        {showTimeline ? (
          <BoxesSvg cursor="pointer" fill="#bec4c4" />
        ) : showContents ? (
          <HideTileActiveSVG fill="#3f4242" stroke="#3f4242" cursor="pointer" />
        ) : (
          <ShowTileActiveSVG fill="#3f4242" stroke="#3f4242" cursor="pointer" />
        )}
      </Tooltip>
      <Tooltip
        title={
          <Typography fontSize={12} sx={{ textAlign: "center", maxWidth: 200 }}>
            Vue sur la chronologie
          </Typography>
        }
        placement="top"
        arrow
        onClick={() => {
          if (!showTimeline) {
            setShowTimeline(true);
          }
        }}
      >
        <ScheduleSVG
          width={24}
          height={24}
          cursor="pointer"
          fill={showTimeline ? "#3f4242" : "#bec4c4"}
        />
      </Tooltip>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={onAddPlaylistBtnPress}
      >
        Ajouter une playlist
      </Button>
    </div>
  );
};


const CustomSlider = styled(Slider)({
    height: 3,
    "& .MuiSlider-track": {
      border: "none",
      height: 3,
    },
    "& .MuiSlider-thumb": {
      height: 16,
      width: 16,
      backgroundColor: "white",
      border: "2px solid currentColor",
      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
        boxShadow: "inherit",
      },
      "&:before": {
        display: "none",
      },
    },
  });

export default Topbar;