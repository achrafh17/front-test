import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import { useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import useSliderValue from "../../hooks/useSliderValue";
import useRSB from "../../hooks/useRSB";
import "../../styles/Content.css";
import "../../styles/Apps.css";
import AppsList from "./AppsList";
import AppsDefaultRSB from "../RightSideBars/Apps/AppsDefaultRSB";

export default function Main() {
    var {setRsbVariant} = useRSB()
    useEffect(()=>{
      setRsbVariant({
        name: "APPS_DEFAULT",
        renderComponent: () => <AppsDefaultRSB />
      });
    }, [setRsbVariant])

    const [sliderMax, sliderValue, setSliderValue] = useSliderValue();


    return (
      <div className="main-screen">
        <div className="main-screen-top">
          <div className="search">
            <SearchSvg fill="none" stroke="#bec4c4" />
            <input type="text" placeholder="Rechercher" />
          </div>
          <CustomSlider
            sx={{ width: 100, color: "#bec4c4", mx: 1 }}
            step={1}
            min={1}
            max={sliderMax}
            size="small"
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(e.target.value);
            }}
          />
        </div>
        <Box sx={{ p: 3 }}>
          <Typography variant="subtitle1" component="h1">
            Applications
          </Typography>
        </Box>
        <AppsList sliderValue={sliderValue} />
      </div>
    );
  }
  

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
  