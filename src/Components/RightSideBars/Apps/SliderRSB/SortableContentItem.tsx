import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { IContentLite } from ".";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface props {
  id: number;
  content: IContentLite;
  onDelete: () => void;
}

const DragHandle = () => (
  <svg
    width="8"
    height="10"
    viewBox="0 0 8 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{cursor:"move"}}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1C8 1.55228 7.55228 2 7 2H1C0.447715 2 0 1.55228 0 1ZM0 5C0 4.44772 0.447715 4 1 4H7C7.55228 4 8 4.44772 8 5C8 5.55228 7.55228 6 7 6H1C0.447715 6 0 5.55228 0 5ZM0 9C0 8.44772 0.447715 8 1 8H7C7.55228 8 8 8.44772 8 9C8 9.55229 7.55228 10 7 10H1C0.447715 10 0 9.55229 0 9Z"
      fill="#BEC4C4"
    ></path>
  </svg>
);

const SortableContentItem: React.FC<props> = ({ id, content, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform } =
    useSortable({ id: id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      className="draggable"
      style={{
        backgroundColor:"white",
        transform: CSS.Transform.toString(transform),
        display: "flex",
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      <div
        {...listeners}
        style={{
          cursor: "move",
          flex: 1,
          maxWidth: "90%",
        }}
      >
        {/* ... */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            backgroundColor: "white",
          }}
        >
          <Box sx={{ height: "100%" }}>
            <DragHandle />
          </Box>
          <Box
            sx={{
              width: 40,
              height: 40,
              minWidth: 40,
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
            <Typography sx={{ fontSize: 13 }} noWrap>
              {content.title}
            </Typography>
          </Box>
        </Box>
      </div>
      <DeleteIcon
        sx={{
          color: "#ccc",
          "&:hover": {
            color: "#888",
          },
          cursor: "pointer",
        }}
        onClick={(e) => {
          console.log("clicked");
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  );
};

export default SortableContentItem;
