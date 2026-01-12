import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ClockStylePicker = ({clockStyle, setClockStyle}) => {
  return (
    <Box sx={{mb: 2}}>
      <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.6 }}>
        Style des horloges
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          borderRadius: 1.1,
          border: "1px solid #d9dfe0",
          fontSize: 14,
        }}
      >
        <Box
          sx={{
            py: 0.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            borderRight: "1px solid #d9dfe0",
            backgroundColor: clockStyle === "analog" ? "#f3f5f5" : "white",
            color: clockStyle === "analog" ? "black" : "#84898a",
          }}
          onClick={() => {
            setClockStyle("analog");
          }}
        >
          Analogue
        </Box>
        <Box
          sx={{
            py: 0.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: clockStyle === "digital" ? "#f3f5f5" : "white",
            color: clockStyle === "digital" ? "black" : "#84898a",
          }}
          onClick={() => {
            setClockStyle("digital");
          }}
        >
          Digitale
        </Box>
      </Box>
    </Box>
  );
};

export default ClockStylePicker;
