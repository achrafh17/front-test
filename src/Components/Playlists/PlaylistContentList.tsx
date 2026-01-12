import React from "react";
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import Content from "../Content/Content";
import { PlaylistContent } from "../../types/api.types"
//@ts-ignore
import { ReactComponent as AddSvg } from "../../assets/svg/add-active.svg";
import useRsb from "../../hooks/useRSB"
import SingleContentRSB from "../RightSideBars/SingleContentRSB"
import {
  DndContext,
  DragCancelEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import SortablePlaylistContent from "./SortablePlaylistContent";

interface props {
  contents: PlaylistContent[];
  sliderValue: number;
  isEditable: boolean;
  onSortContents: (contents: PlaylistContent[]) => void;
  onContentDeletePress?: (contentIdx: number) => void;
  onContentDurationChange?: (newDuration: Date, contentIdx: number) => void;
  handleAddContent?: () => void;
}

const PlaylistContentList: React.FC<props> = ({
  contents,
  sliderValue,
  isEditable,
  onSortContents,
  onContentDeletePress,
  onContentDurationChange,
  handleAddContent,
}) => {
  const { setRsbVariant } = useRsb()
  const [selectedContentId, setSelectedContentId] = React.useState<number | null>(null) //content id to show in RSB
  const [draggedContentIndex, setDraggedContentIndex] = React.useState<number | null>(null) // content index that's being dragged

  const handleContentClick = (contentInfo: PlaylistContent) => {
    setSelectedContentId(contentInfo.contentId)
    setRsbVariant({
      name: "SINGLE_CONTENT",
      renderComponent: () => <SingleContentRSB contentInfo={contentInfo} />
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragCancelEvent) {
    const { active, over } = event;
    if (!over) return;
    
    if (active.id !== over.id) {
      let contents_copy = contents.concat();
      let oldIndex = -1, newIndex = -1;
      for(let i=0; i<contents_copy.length; i++){
        let currContent = contents_copy[i];
        if(currContent.linkId === active.id){
          oldIndex = i;
        }

        if(currContent.linkId === over.id){
          newIndex = i;
        }

        if(oldIndex !== -1 && newIndex !== -1){
          break;
        }
      } 

      setDraggedContentIndex(null)
      onSortContents(
        arrayMove(contents_copy, oldIndex, newIndex)
        );
    }
  }

  function handleDragStart(event: DragStartEvent) {
    // @ts-ignore
    let index = -1;
    for(let i=0; i<contents.length; i++){
      let currContent = contents[i];
      if(currContent.linkId === event.active.id){
        index = i;
        break;
      }
    } 
    setDraggedContentIndex(index)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        flexDirection="row"
        spacing={2}
        sx={{
          ml: 0,
          px: 3,
          pt: 2,
          overflowY: "scroll",
          maxHeight: "calc(100vh - 80px - 60px - (24px * 2) - 32px)",
        }}
        className="hide-scrollbar"
      >
        <DndContext sensors={sensors} onDragEnd={isEditable ? handleDragEnd: ()=>{}}
          onDragCancel={isEditable ? handleDragEnd: ()=>{}}
          onDragStart={isEditable ? handleDragStart: () => {}}
        >
          <SortableContext items={contents.map((c) => c.linkId)}>

            {contents.map((contentInfo, idx) => {
              return (
                <SortablePlaylistContent
                  key={contentInfo.linkId}
                  id={contentInfo.linkId}
                  contentInfo={contentInfo}
                  sliderValue={sliderValue}
                  highlighted={selectedContentId === contentInfo.contentId}
                  isEditable={isEditable}
                  onContentClick={() => {
                    handleContentClick(contentInfo);
                  }}
                  onDeletePress={() => {
                    if (isEditable && onContentDeletePress !== undefined) {
                      onContentDeletePress(idx);
                    }
                  }}
                  onLinkDurationChange={(newDuration: Date) => {
                    if (isEditable && onContentDurationChange !== undefined) {
                      onContentDurationChange(newDuration, idx);
                    }
                  }}
                />

              )
            })}
          </SortableContext>
          <DragOverlay>
            {draggedContentIndex !== null ?
              <Content contentInfo={contents[draggedContentIndex]}
                highlighted={false}
                onContentClick={() => { }}
                onDeletePress={() => { }}
                sliderValue={sliderValue}
                withOptions={false}
                isLinkDurationEditable={false}
                linkDuration={contents[draggedContentIndex].linkDuration}
                onLinkDurationChange={() => { }}
              /> 
              : null
            }
          </DragOverlay>
        </DndContext>
        {Boolean(handleAddContent) && <Grid
          item
          sx={{
            padding: "0 !important",
            mr: 2,
            mb: 2,
            width: sliderValue === 1 ? "100%" : undefined,
          }}
          onClick={handleAddContent}
        >
          <Box
            className={`add-entity content-entity size-${sliderValue}`}
            sx={{ borderRadius: 1 }}
          >
            <AddSvg />
          </Box>
        </Grid>}
      </Grid>
    </Box>
  );
};

/* <Content
                  key={idx}
                  contentInfo={contentInfo}
                  onContentClick={() => {
                    if (
                      contentInfo.type === "Image" ||
                      contentInfo.type === "Video"
                    ) {
                      handleContentClick(contentInfo);
                    }
                  }}
                  onDeletePress={() => {
                    if (isEditable && onContentDeletePress !== undefined) {
                      onContentDeletePress(idx);
                    }
                  }}
                  isLinkDurationEditable={isEditable}
                  linkDuration={contentInfo.linkDuration}
                  onLinkDurationChange={(newDuration: Date) => {
                    if (isEditable && onContentDurationChange !== undefined) {
                      onContentDurationChange(newDuration, idx);
                    }
                  }}
                /> */

export default PlaylistContentList

