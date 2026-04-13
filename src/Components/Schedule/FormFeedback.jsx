import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Collapse from "@mui/material/Collapse";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function FormFeedback({ error, validation, onClose }) {
  return (
    <>
      <Collapse in={Boolean(error.type || error.message)} timeout={300}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, px: 2 }}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "error.light",
              background: "linear-gradient(180deg, #fff7f7 0%, #ffffff 100%)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              p: 2,
              position: "relative", // ✅ THIS IS THE KEY
            }}
          >
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "error.main",
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "error.main",
                  flexShrink: 0,
                }}
              />
              <Box sx={{ fontWeight: 700, fontSize: 15, color: "error.main" }}>
                {error.type === "CONFLICT" ? "Créneau indisponible" : "Erreur"}
              </Box>
            </Box>

            {error.type === "CONFLICT" ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  Des conflits ont été détectés dans certains écrans ou groupes
                </Box>

                <Box
                  sx={{
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "error.light",
                    backgroundColor: "rgba(255, 245, 245, 0.9)",
                    p: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Box
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          lineHeight: 1.3,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {error.title}
                      </Box>

                      <Box
                        sx={{ fontSize: 12, color: "text.secondary", mt: 0.4 }}
                      >
                        {error.start} — {error.end}
                      </Box>
                    </Box>

                    {error.repeatType === "daily" && (
                      <Box
                        sx={{
                          alignSelf: "flex-start",
                          px: 1,
                          py: 0.4,
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          color: "error.main",
                          backgroundColor: "rgba(211, 47, 47, 0.08)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Quotidien
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ fontSize: 12.5, color: "text.secondary" }}>
                  Choisissez un autre créneau ou un autre écran.
                </Box>
              </Box>
            ) : (
              <Box sx={{ fontSize: 13, color: "text.secondary" }}>
                {error.message}
              </Box>
            )}
          </Box>
        </Box>
      </Collapse>

      <Collapse in={Boolean(validation)} timeout={300}>
        <Box sx={{ px: 2, mt: 1 }}>
          <Alert severity="success">
            <AlertTitle>Succès</AlertTitle>
            {validation}
          </Alert>
        </Box>
      </Collapse>
    </>
  );
}
