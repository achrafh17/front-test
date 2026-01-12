import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import useAuth from "../../../hooks/useAuth";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const TIME = [
  "2:00",
  "4:00",
  "6:00",
  "8:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
  "",
];

interface props {
  name: string;
  timeStart: string;
  timeEnd: string;
  borderTop: boolean;
  isEditable: boolean;
  updatePlaylistTimeStart: (newTimeStart: string) => void;
  updatePlaylistTimeEnd: (newTimeEnd: string) => void;
}

const DevicePlaylistTimelineRow: React.FC<props> = ({
  name,
  timeStart,
  timeEnd,
  borderTop,
  isEditable,
  updatePlaylistTimeStart,
  updatePlaylistTimeEnd,
}) => {
  
  const {userInfo} = useAuth();

  const [boxCoords1, setBoxCoords1] = useState({
    width: 0,
    left: 0,
  });
  const [boxCoords2, setBoxCoords2] = useState({
    width: 0,
    left: 0,
  });
  const [twoBoxes, setTwoBoxes] = useState(false);

  const compareTime = (
    d1IsoString: string,
    d2IsoString: string
  ): 0 | 1 | -1 => {
    // 0 equal
    // 1 d1 > d2
    //-1 d1 < d2
    let d1 = dayjs(d1IsoString),
      d2 = dayjs(d2IsoString);
    let d1H = d1.hour(),
      d1M = d1.minute(),
      d1S = d1.second(),
      d2H = d2.hour(),
      d2M = d2.minute(),
      d2S = d2.second();

    let d1T = d1H * 10000 + d1M * 100 + d1S;
    let d2T = d2H * 10000 + d2M * 100 + d2S;

    console.log("comparing", d1T, d2T)

    return d1T > d2T ? 1 : d1T < d2T ? -1 : 0;
  };

  const getTimeDifferenceInSeconds = (
    d1IsoString: string,
    d2IsoString: string
  ) => {
    let d1 = dayjs(d1IsoString),
    d2 = dayjs(d2IsoString);
  let d1H = d1.hour(),
    d1M = d1.minute(),
    d1S = d1.second(),
    d2H = d2.hour(),
    d2M = d2.minute(),
    d2S = d2.second();

    let d1T = d1H * 3600 + d1M * 60 + d1S;
    let d2T = d2H * 3600 + d2M * 60 + d2S;

    return Math.abs(d1T - d2T + 1);
  };

  useEffect(() => {
    // to draw the gray bar in the table that represent the timeline
    var dayjsTimeStart = dayjs(timeStart);
    var dayjsTimeEnd = dayjs(timeEnd);

    if (compareTime(timeStart, timeEnd) <= 0) {
      setTwoBoxes(false);
      console.log("here");
      // now calculate diffrence
      let duration = getTimeDifferenceInSeconds(timeStart, timeEnd);
      console.log({duration})
      let percentageOverDay = Math.abs((duration * 100) / 86400);

      let startOffset =
        ((dayjsTimeStart.hour() * 3600 +
          dayjsTimeStart.minute() * 60 +
          dayjsTimeStart.second()) *
          100) /
        86400;

      setBoxCoords1({
        width: percentageOverDay,
        left: startOffset,
      });
    } else {
      // timeend before timestart
      setTwoBoxes(true);
      let duration = getTimeDifferenceInSeconds(timeStart, timeEnd);
      // this percentage represents the void - the blank spot in the "middle" of the bar
      let percentageOverDay = Math.abs((duration * 100) / 86400);
      let differenceToEnd = getTimeDifferenceInSeconds(
        timeStart,
        dayjs(timeStart).hour(23).minute(59).second(59).toISOString()
      );

      setBoxCoords1({
        left: 0,
        width:
          ((dayjsTimeEnd.hour() * 3600 +
            dayjsTimeEnd.minute() * 60 +
            dayjsTimeEnd.second()) *
            100) /
          86400,
      });
      setBoxCoords2({
        left:
          ((dayjsTimeEnd.hour() * 3600 +
            dayjsTimeEnd.minute() * 60 +
            dayjsTimeEnd.second() +
            duration) *
            100) /
          86400,
        width: (Math.abs(differenceToEnd) * 100) / 86400,
      });
    }
  }, [timeStart, timeEnd]);

  return (
    <Box
      sx={{
        display: "flex",
        height: 90,
        borderTop: borderTop ? "2px solid #F3F3F3" : undefined,
      }}
    >
      {/* playlist info */}
      <Box
        sx={{
          padding: 1,
          width: 200,
          borderRight: "2px solid #f3f3f3",
          height: "100%",
        }}
      >
        <Typography
          noWrap
          sx={{ color: "#F00020", fontSize: 14, fontWeight: 300 }}
        >
          {name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#b2b7b8", fontSize: 12 }}
          >
            Début:
          </Typography>
          <TimeInput
            variant="unstyled"
            withSeconds
            placeholder=""
            sx={{
              height: 18,
              borderBottom: "1px solid #84898a",
              "& input": {
                color: "#84898a",
                fontSize: 12,
                height: 18,
              },
              "& .mantine-TimeInput-controls": {
                height: 18,
              },
            }}
            value={dayjs(timeStart).toDate()}
            onChange={(newTimeStart) => {
              if(isEditable){
                updatePlaylistTimeStart(newTimeStart.toISOString());
              }
            }}
            disabled={!isEditable || userInfo?.privileges.devices !== true}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#b2b7b8", fontSize: 12 }}
          >
            Fin:
          </Typography>
          <TimeInput
            variant="unstyled"
            withSeconds
            sx={{
              height: 18,
              borderBottom: "1px solid #84898a",
              "& input": {
                color: "#84898a",
                fontSize: 12,
                height: 18,
              },
              "& .mantine-TimeInput-controls": {
                height: 18,
              },
            }}
            value={dayjs(timeEnd).toDate()}
            onChange={(newTimeEnd) => {
              if(isEditable){
                updatePlaylistTimeEnd(newTimeEnd.toISOString());
              }
            }}
            disabled={!isEditable || userInfo?.privileges.devices !== true}

          />
        </Box>
      </Box>

      {/* timeline rows */}
      <Box
        sx={{
          display: "flex",
          height: "100%",
          width: "100%",
          flex: 1,
          position: "relative",
        }}
      >
        {TIME.map((_time, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                position: "relative",
                height: "100%",
                width: "8.33333333%",
                borderLeft: idx === 0 ? undefined : "2px solid #f3f3f3",
              }}
            ></Box>
          );
        })}
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "#d9dfe0",
            left: `${boxCoords1.left}%`,
            width: `${boxCoords1.width}%`,
            height: "100%",
            zIndex: 20,
            transition: ".3s all ease",
          }}
        ></Box>
        {twoBoxes && <Box
          sx={{
            position: "absolute",
            backgroundColor: "#d9dfe0",
            left: `${boxCoords2.left}%`,
            width: `${boxCoords2.width}%`,
            height: "100%",
            zIndex: 20,
            transition: ".3s all ease",
          }}
        ></Box>}
      </Box>
    </Box>
  );
};

export default DevicePlaylistTimelineRow;
