import React from "react";
import Box from "@mui/material/Box";
import { IContentLite } from "../../RightSideBars/Apps/SliderRSB";
import {
  DisplayMode,
  ISliderArrows,
  ISliderCounter,
  ISliderAutoloop,
  IColorAlpha,
  } from "../../../types/index"
import { buildHexCode } from "../../../utils/utils";

interface props {
  contents: IContentLite[];
  arrows: ISliderArrows;
  counters: ISliderCounter;
  autoloop: ISliderAutoloop;
  iconColor: IColorAlpha;
  iconBackground: IColorAlpha;
  backgroundColor: IColorAlpha;
  displayMode: DisplayMode;
}

const SliderPreview : React.FC<props> = ({
    contents,
    backgroundColor,
    displayMode,
    autoloop,
    arrows,
    counters
}) => { 


    React.useEffect(() => {
        var t: any = null;
        var sliderContainer = document.getElementById("slider-preview");
        if(sliderContainer !== null){
          var SliderContainerWidth = sliderContainer.scrollWidth;
          sliderContainer.scrollTo(0, 0);
          if (contents.length && autoloop.exists) {
            t = setInterval(() => {
              if (sliderContainer!.scrollLeft + 340 !== SliderContainerWidth) {
                sliderContainer!.scrollTo(sliderContainer!.scrollLeft + 340, 0);
              } else {
                sliderContainer!.scrollTo(0, 0);
              }
            }, parseInt(autoloop.interval) * 1000);
          }

          return () => {
            clearInterval(t);
          };
        }
      }, [contents, autoloop]);

    return (
      <Box
        sx={{
          backgroundColor: buildHexCode(backgroundColor),
          height: "100%",
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          position: "relative",
        }}
        className="hide-scrollbar"
        id="slider-preview"
      >
        {contents.map((content, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                width: 340,
                minWidth: 340,
                maxWidth: 340,
                height: "100%",
                scrollSnapAlign: "start",
                display: "grid",
                placeItems: "center",
              }}
            >
              <img
                alt=""
                src={`https://www.powersmartscreen.com/storage/${content.path!}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit:
                    displayMode === "ORIGINAL"
                      ? "contain"
                      : displayMode === "CROP"
                      ? "cover"
                      : "fill",
                }}
              />
            </Box>
          );
        })}

        {/* TO BE DONE: 
        - add counters
        - add arrows  
        */}
      </Box>
    );
}

export default SliderPreview;