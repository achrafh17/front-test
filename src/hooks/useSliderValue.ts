import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function useSliderValue(): [
  number,
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const [sliderMax, setSliderMax] = useState(5);
  const [sliderValue, setSliderValue] = useState(2);

  const show_3_steps = useMediaQuery(
    "(max-width:1299px), (min-width: 1400px) and (max-width: 1459px), (min-width: 1600px) and (max-width: 1719px)"
  );

  const show_4_steps = useMediaQuery(
    "(min-width: 1300px) and (max-width: 1399px), (min-width: 1460px) and (max-width: 1599px), (min-width: 1720px) and (max-width: 1829px), (min-width: 1921px) and (max-width: 2199px)"
  );

  const show_5_steps = useMediaQuery(
    "(min-width: 1830px) and (max-width: 1920px), (min-width: 2200px)"
  );

  useEffect(() => {
    if (show_3_steps) {
      setSliderMax(3);
    }
  }, [show_3_steps]);

  useEffect(() => {
    if (show_4_steps) {
      setSliderMax(4);
    }
  }, [show_4_steps]);

  useEffect(() => {
    if (show_5_steps) {
      setSliderMax(5);
    }
  }, [show_5_steps]);

  useEffect(() => {
    if (sliderValue > sliderMax) {
      setSliderMax(sliderMax);
    }
  }, [sliderMax, sliderValue]);

  return [sliderMax, sliderValue, setSliderValue];
}
