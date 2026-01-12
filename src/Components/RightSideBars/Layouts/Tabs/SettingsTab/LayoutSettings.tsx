import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import useStore from "../../../../../store/store";
import { FrameRatio } from "../../../../../types";

const DIMENSIONS = {
  horizontal: {
    "16x9": ["1920x1080", "2560x1440", "3840x2160"],
    "4x3": ["1024x768", "1200x900"],
    autre: null,
  },
  vertical: {
    "9x16": ["1080x1920", "1440x2560", "2160x3840"],
    "3x4": ["768x1024", "900x1200"],
    autre: null,
  },
};


// this could be done more cleanly with a universal state from store
// set layoutRatio, frameDimensions and frameOrientation in store
// and update them directly in store

const LayoutSettings: React.FC<{}> = () => {
  const layoutName = useStore((state) => state.layoutName);
  const setLayoutName = useStore((state) => state.setLayoutName);
  const frameOrientation = useStore((state) => state.frameOrientation);
  const frameDimensions = useStore((state) => state.frameDimensions);
  const setFrameDimensions = useStore((state) => state.setFrameDimensions);
  const setFrameHeight = useStore((state) => state.setFrameHeight);
  const setFrameWidth = useStore((state) => state.setFrameWidth);
  const frameRatio = useStore((state) => state.frameRatio);
  const setFrameRatio = useStore((state) => state.setFrameRatio);

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        fullWidth
        size="small"
        variant="standard"
        label="Nom du calque"
        value={layoutName}
        onChange={(e) => {
          setLayoutName(e.target.value);
        }}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1,
        }}
      >
        <FormControl variant="standard" sx={{ flex: 1 }}>
          <InputLabel id="layout-ratio-label">Ratio</InputLabel>
          <Select
            labelId="layout-ratio-label"
            id="layout-ratio"
            value={frameRatio}
            onChange={(e) => {
              if (
                ["16x9", "4x3", "9x16", "3x4", "autre"].includes(e.target.value)
              ) {
                if (e.target.value === "16x9") {
                  setFrameDimensions({
                    width: 1920,
                    height: 1080,
                  });
                } else if (e.target.value === "4x3") {
                  setFrameDimensions({
                    width: 1024,
                    height: 768,
                  });
                } else if (e.target.value === "9x16") {
                  setFrameDimensions({
                    width: 1080,
                    height: 1920,
                  });
                } else if (e.target.value === "3x4") {
                  setFrameDimensions({
                    width: 768,
                    height: 1024,
                  });
                }
                setFrameRatio((prev) => {
                  return e.target.value as FrameRatio;
                });
              }
            }}
          >
            {Object.keys(DIMENSIONS[frameOrientation]).map((ratio) => (
              <MenuItem key={ratio} value={ratio}>
                {ratio}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {frameRatio === "autre" && !!frameDimensions ? (
          <>
            <TextField
              sx={{ flex: 1 }}
              variant="standard"
              label="Largeur"
              value={frameDimensions.width}
              onChange={(e) => {
                setFrameWidth(parseInt(e.target.value));
              }}
              type="number"
            />
            <TextField
              sx={{ flex: 1 }}
              variant="standard"
              label="Hauteur"
              value={frameDimensions.height}
              onChange={(e) => {
                setFrameHeight(parseInt(e.target.value));
              }}
              type="number"
            />
          </>
        ) : (
          frameDimensions && DIMENSIONS?.[frameOrientation]?.[frameRatio]?.includes(
            `${frameDimensions.width}x${frameDimensions.height}`
          ) && (
            <FormControl variant="standard" sx={{ flex: 1 }}>
              <InputLabel id="layout-resolution-label">Résolution</InputLabel>
              <Select
                labelId="layout-resolution-label"
                id="layout-resolution"
                value={`${frameDimensions.width}x${frameDimensions.height}`}
                onChange={(e) => {
                  setFrameDimensions({
                    width: parseInt(e.target.value.split("x")[0]),
                    height: parseInt(e.target.value.split("x")[1]),
                  });
                }}
              >
                {DIMENSIONS?.[frameOrientation]?.[frameRatio]?.map(
                  (resolution: string) => (
                    <MenuItem key={resolution} value={resolution}>
                      {resolution}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          )
        )}
      </Box>
    </Box>
  );
};
export default LayoutSettings;
