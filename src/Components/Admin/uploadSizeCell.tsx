import React, { useEffect } from "react";
import Box from "@mui/material/Box"
import { formatBits } from "../../utils/admin.utils";
import Button from "@mui/material/Button";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UploadSizeInput from "../Common/upload-size-input";

interface props {
    value: number;
    onSave: (newValue: number) => void;
}

const UploadSizeCell : React.FC<props> = ({value, onSave})=> {

    const [isEditing, setIsEditing] = React.useState(false);
    // localValue is in bits
    const [localValue, setLocalValue] = React.useState(value);

    useEffect(()=>{
        setLocalValue(value)
    }, [value])

    return (
      <>
        {isEditing ? (
          <Box>
            <UploadSizeInput value={localValue} onValueChange={(newValue) => {
                // new Value is in bits => convert it to bytes
                console.log(newValue * 8)
                setLocalValue(newValue * 8);
            }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: .5,
                width: "100%",
                mt: 1
              }}
            >
              <Button
                color="success"
                variant="contained"
                sx={{ minWidth: 0, p: 0.5, flex:1 }}
                onClick={() => {
                  onSave(localValue);
                  setIsEditing(false);
                }}
              >
                <CheckIcon sx={{ fontSize: 16 }} />
              </Button>
              <Button
                color="error"
                variant="contained"
                sx={{ minWidth: 0, p: 0.5, flex:1 }}
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <p>{formatBits(value)}</p>
            <Button
              color="info"
              variant="outlined"
              sx={{ minWidth: 0, p: 0.5 }}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <ModeEditIcon sx={{ fontSize: 16 }} />
            </Button>
          </Box>
        )}
      </>
    );
}

export default UploadSizeCell;


