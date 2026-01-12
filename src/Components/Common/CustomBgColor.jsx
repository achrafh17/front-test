import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import CustomSetting from "./CustomSetting";

export default function CustomBgColor({ color, setColor, active, setActive }) {

  return (
    <CustomSetting
      title="Arrière-plan personnalisé"
      active={active}
      setActive={setActive}
      renderBody={() => (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: 13, color: "#797c7c" }}>
            Couleur de fond
          </Typography>
          <TextField
            variant="standard"
            fullWidth
            InputProps={{
              startAdornment: (
                <Box
                  sx={{
                    width: 27,
                    height: 24,
                    border: "1px solid #ccc",
                    borderRadius: 1.1,
                    position: "relative",
                    mr: 1,
                  }}
                >
                  <input
                    type="color"
                    style={{
                      width: 20,
                      height: 24,
                      backgroundColor: "transparent",
                      border: "none",
                      position: "absolute",
                      top: -1,
                      left: 1,
                    }}
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                    }}
                  />
                </Box>
              ),
            }}
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
            }}
          />
        </Box>
      )}
    />
  );
}
