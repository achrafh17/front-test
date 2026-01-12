import Typography  from "@mui/material/Typography";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import ContentIcon from "../../Common/ContentIcon";


export default function TableRow({ stat }) {
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
        <Box sx={{ flex: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 50,
              height: 50,
              overflow: "hidden",
              border: "1px solid #ccc",
              borderRadius: 1.2,
            }}
          >
            <ContentIcon 
            title={stat.title}
            path={stat.previewPath}
            type={stat.type}
            appInfo={stat.appInfo}
  />
            {/* <img
              src={"https://www.powersmartscreen.com/storage/" + stat.previewPath}
              alt=""

              style={{objectFit:"cover", height:"100%", width:"100%"}}
            /> */}
          </Box>
          <Typography>{stat.title}</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>{stat.showTotal}</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>{dayjs(stat.showTime * 1000).format("HH:mm:ss")}</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>{stat.numberOfScreens}</Typography>
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography>{stat.type}</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          height: "1px",
          width: "98%",
          backgroundColor: "#aaa",
          mx: "auto",
        }}
      ></Box>
    </>
  );
}