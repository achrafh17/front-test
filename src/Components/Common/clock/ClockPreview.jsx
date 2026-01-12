import Box from "@mui/material/Box";
import AnalogClock from "./AnalogClock";
import DigitalClock from "./DigitalClock";

const SIZES = {
  digital: {
    time: {
      1: "2.5em",
      2: "2.5em",
      3: "1.5em",
    },
    info: {
      1: ".8em",
      2: ".6em",
      3: ".5em",
    },
  },
};

export default function ClockPreview({
  clocks,
  clockStyle,
  clockFormat,
  theme,
  useCustomBgColor,
  bgColor,
  showDate,
  showLocation,
  ...props
}) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: useCustomBgColor
          ? bgColor
          : theme === "light"
          ? "#F3F5F5"
          : "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: 2,
      }}
    >
      {clockStyle === "analog" ? (
        <>
        {clocks.map((timezone) => {
          return (
            <AnalogClock
              theme={theme}
              timezone={timezone}
              timeFontSize={SIZES["digital"]["time"][clocks.length]}
              infoFontSize={SIZES["digital"]["info"][clocks.length]}
              showDate={showDate}
              showLocation={showLocation}
              clockFormat={clockFormat}
            />
          );
        })}
      </>
      ) : (
        <>
          {clocks.map((timezone) => {
            return (
              <DigitalClock
                theme={theme}
                timezone={timezone}
                timeFontSize={SIZES["digital"]["time"][clocks.length]}
                infoFontSize={SIZES["digital"]["info"][clocks.length]}
                showDate={showDate}
                showLocation={showLocation}
                clockFormat={clockFormat}
              />
            );
          })}
        </>
      )}
    </Box>
  );
}
