import { Alert, Snackbar } from "@mui/material";
interface Props {
  open: boolean;
  onClose: () => void;
  message: string;
  type: "error" | "success";
}
export function SnackBar({ open, onClose, message, type }: Props) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert severity={type} onClose={onClose} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
