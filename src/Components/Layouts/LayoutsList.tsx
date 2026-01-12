import React from "react"
import LayoutItem from "./LayoutItem"
import Grid from "@mui/material/Grid"
import {ILayoutInfo} from "../../types/api.types"

interface props {
    layouts: ILayoutInfo[];
    sliderValue: number
}

const LayoutsList: React.FC<props>= ({layouts, sliderValue}) => {
    return (
      <Grid
        container
        flexDirection="row"
        spacing={2}
        sx={{
          ml: 0,
          px: 3,
          pt: 2,
          overflowY: "scroll",
          maxHeight: "calc(100vh - 80px - 60px - (24px * 2) - 32px)",
        }}
        className="hide-scrollbar"
      >
        {layouts.map((layoutInfo, idx) => {
          return (
            <LayoutItem
              key={idx}
              sliderValue={sliderValue}
              layoutId={layoutInfo.layoutId}
              layoutName={layoutInfo.name}
              layoutHashId={layoutInfo.hashId}
              slideHashId={layoutInfo.slides[0].hashId}
              mainSlideState={layoutInfo.slides[0].state}
            />
          );
        })}
      </Grid>
    );
}

export default LayoutsList;