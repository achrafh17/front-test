import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
//@ts-ignore
import { ReactComponent as FilterSvg } from "../../assets/svg/filter.svg";
import UploadIcon from "@mui/icons-material/Upload";
import useAuth from "../../hooks/useAuth";
import { CircularProgress, Checkbox, Switch, Button } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentIcon from "../Common/ContentIcon";
import { IContent } from "../../types/api.types";

interface props {
  onNewContents: (newContents: (IContent & { linkDuration: number })[]) => void;
}

const PlaylistAddContentRSB: React.FC<props> = ({ onNewContents }) => {
  const { userInfo } = useAuth();

  const [searchValue, setSearchValue] = useState("");
  const [contents, setContents] = useState<IContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      setSelectedContentIds(contents.map((item) => item.contentId));
    } else {
      setSelectedContentIds([]);
    }
  }, [selectAll, contents]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://www.powersmartscreen.com/get-contents?sessionId=${userInfo?.sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        setIsLoading(false);
        if (resJson.success) {
          setContents(resJson.result as IContent[]);
        } else {
          //handle error
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }, [userInfo?.sessionId]);

  // gets called when user clicks on "Enregistrer" to commit changes
  const save = () => {
    var newContents = contents
      .filter((item) => selectedContentIds.includes(item.contentId))
      .map((c) => {
        console.log(c.type, c.duration)
        if(c.type === "Video"){
          return {
            ...c,
            linkDuration:
              c.duration !== null && Number.isInteger(c.duration)
                ? c.duration
                : 30,
          };
        }else if(c.type==="Slider"){
          let appInfo = JSON.parse(c.appInfo ?? "{}");
          let numberOfSlides = appInfo?.contents?.length || 1 
          let interval = appInfo?.autoloop?.interval || 3
          return {
            ...c,
            linkDuration: numberOfSlides * interval,
          };
        }else{
          return {
            ...c,
            linkDuration: 30,
          };
        }
      });
    onNewContents(newContents);
    setSelectAll(false);
    setSelectedContentIds([]);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "#575b5c",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 80,
          borderBottom: "1px solid #d9dfe0",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400, fontSize: 18 }}>
          Ajouter un Contenu
        </Typography>
      </Box>
      <Box
        sx={{
          height: 41,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: "1px solid #d9dfe0",
          py: 1,
          px: 2,
        }}
      >
        <FilterSvg
          style={{
            width: 24,
            height: 24,
            minWidth: 24,
            maxWidth: 24,
            minHeight: 24,
            maxHeight: 24,
            cursor: "pointer",
          }}
        />
        <input
          type="text"
          style={{
            border: "none",
            outline: "none",
            height: "100%",
            flex: 1,
            maxWidth: "75%",
          }}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          placeholder="Rechercher..."
        />
        <UploadIcon
          sx={{
            fontSize: 24,
            cursor: "pointer",
            color: "#bec4c4",
            "&:hover": {
              color: "#666",
            },
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Switch
              sx={{ marginLeft: -1 }}
              value={selectAll}
              onChange={() => {
                setSelectAll((old) => !old);
              }}
            />
            <Typography variant="body1">Sélectionner tout</Typography>
          </Box>
          {contents.map((contentInfo, idx) => {
            if (
              !contentInfo.title
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            ) {
              return <div key={idx}></div>;
            }
            return (
              <Box
                key={idx}
                sx={{
                  height: 54,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
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
                    appInfo={contentInfo.appInfo}
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
                <Checkbox
                  icon={<RadioButtonUncheckedIcon sx={{ fontSize: 24 }} />}
                  checkedIcon={
                    <CheckCircleIcon sx={{ color: "#F00020", fontSize: 24 }} />
                  }
                  checked={selectedContentIds.includes(contentInfo.contentId)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedContentIds((old) => [
                        ...old,
                        contentInfo.contentId,
                      ]);
                    } else {
                      setSelectedContentIds((old) => {
                        var newSelectedContentIds = old.filter(
                          (item) => item !== contentInfo.contentId
                        );
                        return newSelectedContentIds;
                      });
                    }
                  }}
                />
              </Box>
            );
          })}
        </Box>
      )}
      <Box
        className={` ${
          selectedContentIds.length !== 0 ? "slide-top" : "slide-bottom"
        }`}
        sx={{
          width: "100%",
          padding: 2,
          backgroundColor: "white",
          boxShadow: "0px 3px 15px 6px rgba(0,0,0,0.3)",
        }}
      >
        <Button variant="contained" fullWidth onClick={save}>
          Ajouter
        </Button>
      </Box>
    </Box>
  );
};

export default PlaylistAddContentRSB;
