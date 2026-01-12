import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ClockFormatPicker = ({clockFormat, setClockFormat}) => {
  return (
    <Box sx={{mb: 2}}>
      <Typography sx={{ fontSize: 13, color: "#797c7c", mb: 0.6 }}>
        Format 
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
            backgroundColor: clockFormat === "24" ? "#f3f5f5" : "white",
            color: clockFormat === "24" ? "black" : "#84898a",
          }}
          onClick={() => {
            setClockFormat("24");
          }}
        >
          24 heures
        </Box>
        <Box
          sx={{
            py: 0.5,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: clockFormat === "12" ? "#f3f5f5" : "white",
            color: clockFormat === "12" ? "black" : "#84898a",
          }}
          onClick={() => {
            setClockFormat("12");
          }}
        >
          12 heures
        </Box>
      </Box>
    </Box>
  );
};

export default ClockFormatPicker;
