import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {IContentLite} from "./index"
import { IContent } from "../../../../types/api.types";
import useAuth from "../../../../hooks/useAuth";

interface props {
onClose: () => void;
onAddContents: (newContents: IContentLite[]) => void;
}

const PickContentPanel : React.FC<props> = ({onClose, onAddContents}) => {
  const { userInfo } = useAuth();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [contents, setContents] = React.useState<IContent[]>([]);
  const [selectedContentIds, setSelectedContentIds] = React.useState<
    Record<number, boolean>
  >({});

  
  React.useEffect(() => {
    fetch(`https://www.powersmartscreen.com/get-contents?sessionId=${userInfo?.sessionId}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          var result = resJson.result as IContent[];
          result = result.filter((content) => content.type === "Image");
          setContents(result as IContent[]);
        } else {
          //handle error
        }
      })
      .catch((e) => {});
  }, [userInfo?.sessionId]);

  const handleAddSelectedContent = () => {
    var selectedContents = contents
      .filter((c) => selectedContentIds[c.contentId] === true)
      .map(({ contentId, title, path }) => ({ contentId, title, path }));
    onAddContents(selectedContents);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        height: "100%",
        width: 340,
        right: 340,
        backgroundColor: "white",
        borderLeft: "1px solid #ccc",
        boxShadow: "-2px 0px 5px rgba(0,0,0,0.2)",
      }}
    >
      <Box
        sx={{
          height: 78,
          width: "100%",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography sx={{ flex: 1 }}>Ajouter contenu</Typography>
        <CloseIcon
          sx={{ color: "#aaa", cursor: "pointer" }}
          onClick={onClose}
        />
      </Box>
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        style={{
          width: "100%",
          border: "none",
          borderBottom: "1px solid #ccc",
          height: 30,
          padding: 16,
          outline: "none",
        }}
      />
      <Box
        sx={{
          p: 2,
          maxHeight: "calc(100vh - 80px - 78px - 30px - 36px)",
          overflowY: "scroll",
        }}
        className="hide-scrollbar"
      >
        {contents.map((content, idx) => {
          if (!content.title.includes(searchTerm)) return <Box key={idx}></Box>;
          return (
            <Box
              key={idx}
              sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 0.5,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`https://www.powersmartscreen.com/storage/${content.path!}`}
                  style={{ objectFit: "cover" }}
                  width="100%"
                  height="100%"
                  alt=""
                />
              </Box>
              <Box sx={{ flex: 1, maxWidth: "75%" }}>
                <Typography noWrap sx={{ fontSize: 13 }}>
                  {content.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  ml: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {selectedContentIds[content.contentId] === true ? (
                  <CheckCircleIcon
                    sx={{ cursor: "pointer", color: "#ff0020", fontSize: 18 }}
                    onClick={() => {
                      setSelectedContentIds((old) => {
                        var newSelectedContentIds = { ...old };
                        delete newSelectedContentIds[content.contentId];
                        return newSelectedContentIds;
                      });
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ cursor: "pointer", fontSize: 18 }}
                    onClick={() => {
                      setSelectedContentIds((old) => ({
                        ...old,
                        [content.contentId]: true,
                      }));
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ px: 2, pb: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleAddSelectedContent}
          sx={{ py: 0.2 }}
        >
          Ajouter
        </Button>
      </Box>
    </Box>
  );
}

export default PickContentPanel;
