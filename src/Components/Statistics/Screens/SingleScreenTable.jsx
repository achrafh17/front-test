import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { ReactComponent as UpDownArrowSVG } from "../../../assets/svg/up-down-arrow.svg";
import dayjs from "dayjs";

const sort = (arr, sortKey, sortOrder) => {
  var arr_copy = arr.concat();
  
  if (sortOrder === "asc") {
    arr_copy.sort((c1, c2) => {
      var k1 = c1[`${sortKey}`],
        k2 = c2[`${sortKey}`];
      if (k1 > k2) {
        return 1;
      } else if (k1 === k2) {
        return 0;
      } else {
        return -1;
      }
    });
  } else {
    arr_copy.sort((c1, c2) => {
      var k1 = c1[`${sortKey}`],
        k2 = c2[`${sortKey}`];
      if (k1 > k2) {
        return -1;
      } else if (k1 === k2) {
        return 0;
      } else {
        return 1;
      }
    });
  }
  return arr_copy;
};

const StatRow = ({ d, isLast }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 3,
          px: 1.4,
        }}
      >
        <Box sx={{ flex: 2 }}>
          <Typography>
            {!!d.connectedAt &&
              dayjs(d.connectedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>
            {!!d.disconnectedAt &&
              dayjs(d.disconnectedAt).format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>
            {!!d.duration && dayjs(d.duration).format("HH[h] mm[m] ss[s]")}
          </Typography>
        </Box>
      </Box>
      {!isLast && (
        <Box
          sx={{
            height: "1px",
            width: "98%",
            backgroundColor: "#aaa",
            mx: "auto",
          }}
        ></Box>
      )}
    </>
  );
};

export default function SingleScreenTable(props) {
  const [data, setData] = useState([]);

  const heads = [
    {
      id: "connectedAt",
      LabelComponent: () => (
        <Typography>Date / Heure de début de connexion</Typography>
      ),
    },
    {
      id: "disconnectedAt",
      LabelComponent: () => (
        <Typography>Date / Heure de fin de connexion</Typography>
      ),
    },
    {
      id: "duration",
      LabelComponent: () => <Typography>Durée en ligne</Typography>,
    },
  ];

  const [sorting, setSorting] = useState(["connectedAt", "asc"]);

  useEffect(() => {
    setData(
      sort(
        props.data.map((d) => {
          var duration = "";
          if (!!d?.connectedAt && !!d?.disconnectedAt) {
            var start = dayjs(d?.connectedAt);
            var finish = dayjs(d?.disconnectedAt);
            duration = dayjs(finish.diff(start, "millisecond")).toISOString();
          }
          d["duration"] = duration;
          return d;
        }),
        sorting[0],
        sorting[1]
      )
    );
  }, [sorting, props.data]);

  return (
    <Box sx={{ pl: 10, pt: 2, width: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#e6ebf0",
          p: 2,
          display: "flex",
          alignItems: "center",
          borderRadius: 1.3,
          width: "100%",
          color: "#575b5c",
        }}
      >
        {heads.map(({ id, LabelComponent }, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                flex: 1,
              }}
            >
              <Box
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                  color: "#5F5F64",
                  gap: 1.25,
                }}
                onClick={() => {
                  setSorting((oldSorting) => {
                    if (oldSorting[0] === id) {
                      if (oldSorting[1] === "asc") {
                        return [id, "desc"];
                      }
                      return [id, "asc"];
                    }
                    return [id, "asc"];
                  });
                }}
              >
                <LabelComponent />
                {sorting[0] === id ? (
                  sorting[1] === "asc" ? (
                    <ArrowDropUpIcon color="#5F5F64" />
                  ) : (
                    <ArrowDropDownIcon color="#5F5F64" />
                  )
                ) : (
                  <UpDownArrowSVG width={14} fill="#5F5F64" />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      {data.map((d, idx) => {
        return <StatRow d={d} key={idx} isLast={idx === data.length - 1} />;
      })}
    </Box>
  );
}
