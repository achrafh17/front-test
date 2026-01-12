import Box from "@mui/material/Box";
import ClockLightIMG from "../../../assets/images/clock-light.png";
import ClockDarkIMG from "../../../assets/images/clock-dark.png";

const ClockHourArrow = ({ theme, rotateBy }) => {
  return (
    <div
      style={{
        width: 2,
        height: "100%",
        backgroundColor: "transparent",
        position: "absolute",
        transform: `rotateZ(${rotateBy}deg)`,
      }}
    >
      <div
        style={{
          height: "25%",
          width: "100%",
          backgroundColor: theme === "dark" ? "white" : "#222",
          top: "50%",
          position: "relative",
          transform: "translateY(-100%)",
          borderRadius: "25px",
        }}
      ></div>
    </div>
  );
};
const ClockMinArrow = ({ theme, rotateBy }) => {
  return (
    <div
      style={{
        width: 1,
        height: "100%",
        backgroundColor: "transparent",
        position: "absolute",
        transform: `rotateZ(${rotateBy}deg)`,
      }}
    >
      <div
        style={{
          height: "35%",
          width: "100%",
          backgroundColor: theme === "dark" ? "white" : "#222",
          top: "50%",
          position: "relative",
          transform: "translateY(-100%)",
          borderRadius: "25px",
        }}
      ></div>
    </div>
  );
};
const ClockSecArrow = ({ rotateBy }) => {
  return (
    <div
      style={{
        width: 0.5,
        height: "100%",
        backgroundColor: "transparent",
        position: "absolute",
        transform: `rotateZ(${rotateBy}deg)`,
      }}
    >
      <div
        style={{
          height: "45%",
          width: "100%",
          backgroundColor: "#ff5b27",
          top: "50%",
          transform: "translateY(-100%)",
          borderRadius: "25px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 5,
            height: 5,
            borderRadius: "100%",
            backgroundColor: "#ff5b27",
            bottom: 0,
            left:"50%",
            transform: "translate(-40%, 50%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default function AnalogClockComponent({
  theme,
  clockDialStyle,
  hour,
  minute,
  second,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <img
        id="clock_dial"
        src={theme === "dark" ? ClockDarkIMG : ClockLightIMG}
        alt=""
        style={clockDialStyle}
      />
      <ClockHourArrow
        theme={theme}
        rotateBy={hour * (360 / 12) + (minute / 12) * (360 / 60)}
      />
      <ClockMinArrow
        theme={theme}
        rotateBy={minute * (360 / 60) + second / 12}
      />
      <ClockSecArrow rotateBy={second * (360 / 60) + minute * 360} />
    </Box>
  );
}
