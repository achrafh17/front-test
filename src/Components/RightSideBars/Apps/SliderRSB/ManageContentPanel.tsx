import React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import CloseIcon from "@mui/icons-material/Close";
import PickContentPanel from "./PickContentPanel";
import { Button } from "@mui/material";
import { IContentLite } from "./index";
import SortableContentItem from "./SortableContentItem";

// Drag and drop
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface props {
  onClose: () => void;
  contents: IContentLite[];
  onAddContents: (newContents: IContentLite[]) => void;
  onDeleteContent: (contentIdx: number) => void;
  setContents: React.Dispatch<React.SetStateAction<IContentLite[]>>;
}

const ManageContentPanel : React.FC<props> = ({contents, onClose, onAddContents, onDeleteContent, setContents}) => {

    const [isPickContentPanelOpen, setIsPickContentPanelOpen] = React.useState(false);

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );
  


    if(contents.length === 0){
        return <PickContentPanel 
        onClose={onClose}
        onAddContents={onAddContents} />
    }

    if(isPickContentPanelOpen){
        // contents.length != 0
        return <PickContentPanel 
        onClose={()=>{
            setIsPickContentPanelOpen(false);
        }}
        onAddContents={(newContents) => {
          onAddContents(newContents)
          setIsPickContentPanelOpen(false);
        }} /> 
    }

    function handleDragEnd(event: DragEndEvent) {
      const {active, over} = event;
      if(!over) return;
      
      if (active.id !== over.id) {
        setContents((oldContents) => {
          // we do index minus 1 to correct for the 1 we added in the list 
          const oldIndex = parseInt(active.id + "") - 1;
          const newIndex = parseInt(over.id + "") - 1;

          
          return arrayMove(oldContents, oldIndex, newIndex);
        });
      }
    }

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
          <Typography sx={{ flex: 1 }}>Diapos</Typography>
          <CloseIcon
            sx={{ color: "#aaa", cursor: "pointer" }}
            onClick={onClose}
          />
        </Box>
        <Box sx={{ p: 2, mb: 2 }}>
          <Button
            fullWidth
            sx={{ py: 0.5 }}
            variant="outlined"
            onClick={() => {
              setIsPickContentPanelOpen(true);
            }}
            disabled={contents.length >= 50}
          >
            Ajouter Contenu
          </Button>
        </Box>
        <Box
          sx={{
            p: 2,
            maxHeight: "calc(100vh - 80px - 78px - 46px)",
            overflowY: "scroll",
          }}
          className="hide-scrollbar"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            autoScroll={true}
          >
            <SortableContext
              // we put idx+1 because items shouldn't be zero, otherwise the item who has the id 0 won't be dragged
              items={contents.map((_c, idx) => idx + 1)}
              strategy={verticalListSortingStrategy}
            >
              {contents.map((content, idx) => {
                return (
                  <SortableContentItem
                    key={idx}
                    id={idx + 1}
                    content={content}
                    onDelete={() => {
                      onDeleteContent(idx);
                    }}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </Box>
      </Box>
    );
}

export default ManageContentPanel;

