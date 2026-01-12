//@ts-ignore
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import React, { useCallback, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import useSliderValue from "../../hooks/useSliderValue";
import useRSB from "../../hooks/useRSB";
import LayoutNameDialog from "./LayoutNameDialog"
import useAuth from "../../hooks/useAuth";
import LayoutsList from "./LayoutsList";
import LayoutsDefaultRSB from "../RightSideBars/LayoutsDefaultRSB"

export default function Main() {
  const { userInfo } = useAuth();
  const [sliderMax, sliderValue, setSliderValue] = useSliderValue();
  const [open, setOpen] = React.useState(false);

  const addNewLayout = useCallback(()=>{
    setOpen(true);
  }, []);

  var { setRsbVariant } = useRSB();
  useEffect(() => {
    setRsbVariant({
      name: "LAYOUTS_DEFAULT",
      renderComponent: () => <LayoutsDefaultRSB addLayout={addNewLayout} />,
    });
  }, [setRsbVariant, addNewLayout]);

  const [layouts, setLayouts] = React.useState([]);

  useEffect(() => {
    fetch(`https://www.powersmartscreen.com/get-layouts?sessionId=${userInfo?.sessionId}`).then(res => res.json()).then(resJson => {
      if (resJson?.success) {
        var result = resJson.result;
        setLayouts(result);
      }
    }).catch(err => {
      console.log(err);
    })
  }, [userInfo?.sessionId]);



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
            // @ts-ignore
            if (e?.target?.value) setSliderValue(parseInt(e?.target?.value));
          }}
        />
      </div>
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" component="h1">
          Calques
        </Typography>
      </Box>
          <LayoutsList layouts={layouts} sliderValue={sliderValue}/>
      {open && (
        <LayoutNameDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
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
