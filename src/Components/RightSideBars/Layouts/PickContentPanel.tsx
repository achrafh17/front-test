import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import useStore from "../../../store/store";
import useAuth from "../../../hooks/useAuth";
import ContentIcon from "../../Common/ContentIcon";

const PickContentPanel = () => {
  const setIsPanelOpen = useStore((state) => state.setIsPanelOpen);
  const panelCallback = useStore((state) => state.panelCallback);
  const { userInfo } = useAuth();
  const [contents, setContents] = React.useState<{ [key: string]: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    fetch(`https://www.powersmartscreen.com/get-contents?sessionId=${userInfo?.sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          setContents(resJson.result.filter((c) => c.type === "Image"));
        } else {
          //handle error
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [userInfo?.sessionId]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 60px)",
        width: 340,
        position: "absolute",
        right: 340,
        backgroundColor: "#FFF",
        borderLeft: "1px solid #e6e6e6",
        boxShadow: "-2px 0px 10px rgba(0, 0, 0, 0.2)",
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #CCC",
        }}
      >
        <Typography sx={{ fontSize: 16, color: "#575b5c", flex: 1 }}>
          Ajouter Contenu
        </Typography>
        <CloseIcon
          sx={{ fontSize: 16, cursor: "pointer" }}
          onClick={() => {
            setIsPanelOpen(false);
          }}
        />
      </Box>
      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            padding: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            px: 3,
            py: 2,
            height: "calc(100vh - 60px - 81px - 42px)",
            maxHeight: "calc(100vh - 60px - 81px - 42px)",
            overflowY: "scroll",
          }}
          className="hide-scrollbar"
        >
          {contents.map((contentInfo, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  height: 54,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (panelCallback) {
                    panelCallback(contentInfo?.previewPath);
                    setIsPanelOpen(false);
                  }
                }}
              >
                <Box
                  sx={{
                    height: 42,
                    width: 42,
                    borderRadius: 0.4,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ddd",
                  }}
                >
                  <ContentIcon
                  title={contentInfo.title}
                    type={contentInfo.type}
                    path={contentInfo?.previewPath}
                    appInfo={contentInfo?.appInfo}
                  />
                </Box>
                <Box sx={{ flex: 1, maxWidth: "65%" }}>
                  <Typography sx={{ fontSize: 14 }} noWrap>
                    {contentInfo.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#b2b7b8" }}>
                    {contentInfo.type}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default PickContentPanel;
