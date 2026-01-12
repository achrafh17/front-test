import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import {ReactComponent as AddTagSVG} from "../../../assets/svg/add-tag-btn.svg"
import CloseIcon from "@mui/icons-material/Close";


interface props {
    tags: string[];
    onAddTag: (newTags: string) => void;
    onDeleteTagByIdx: (idx: number) => void;
    limitedTo?: number;
}

const TagInput: React.FC<props> = ({ tags, limitedTo, onAddTag, onDeleteTagByIdx }) => {
  const [expanded, setExpanded] = React.useState(true);
  const [newTag, setNewTag] = React.useState("");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography sx={{ fontSize: 15, color: "#3f4242" }}>Tags</Typography>
        <Typography
          sx={{ fontSize: 13, color: "#797c7c", cursor: "pointer" }}
          onClick={() => {
            setExpanded((old) => !old);
          }}
        >
          {expanded ? "Masquer" : "Afficher"}
        </Typography>
      </Box>
      {expanded && (
        <Box>
          {tags.length !== 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 1,
              }}
            >
              {tags.map((tag, idx) => (
                <Box
                key={idx}
                  sx={{
                    display: "flex",
                    alignItems:"center",
                    px: 0.6,
                    py: 0.2,
                    maxWidth: "100%",
                    border: "1px solid #797c7c ",
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: "#797c7c", mr: .5 }}>
                    {tag}
                  </Typography>
                  <CloseIcon sx={{ fontSize: 12, color: "#797c7c", cursor:"pointer" }} onClick={()=>{
                    onDeleteTagByIdx(idx);
                  }} />
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              variant="standard"
              placeholder="Ajouter un nouveau tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              sx={{ flex: 1 }}
            />
            <AddTagSVG
              style={{ width: 26, height: 26, cursor: "pointer" }}
              onClick={() => {
                if(limitedTo !== undefined && tags.length >= limitedTo){
                  return;
                }
                if(!newTag){
                  return;
                }
                onAddTag(newTag);
                setNewTag("");
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TagInput;