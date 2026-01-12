import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import dayjs from "dayjs"
import { TimeInput } from '@mantine/dates';

interface props {
    isEditable?: boolean,
    linkDuration: number,
    onLinkDurationChange?: (newDuration: Date) => void 
}

const LinkDurationView : React.FC<props> = ({
    isEditable = false, linkDuration, onLinkDurationChange
}) => {
    return (
      <Box>
        {isEditable ? (
          <TimeInput
            variant="unstyled"
            withSeconds
            style={{
              color: "#b2b7b8",
            }}
            className="time-input-duration"
            value={dayjs(linkDuration * 1000).toDate()}
            onChange={(newDuration) => {
              if (onLinkDurationChange !== undefined) {
                onLinkDurationChange(newDuration);
              }
            }}
          />
        ) : (
          <Typography sx={{ fontSize: 12, lineHeight: 1.2, color: "#666" }}>
            {dayjs(linkDuration * 1000).format("HH:mm:ss")}
          </Typography>
        )}
      </Box>
    );
}

export default LinkDurationView;