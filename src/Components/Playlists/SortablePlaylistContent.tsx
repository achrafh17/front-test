import React from "react";
import { PlaylistContent } from "../../types/api.types";
import Content from "../Content/Content";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface props {
    id: number;
    contentInfo: PlaylistContent;
    sliderValue: number;
    highlighted: boolean;
    isEditable: boolean;
    onContentClick: () => void;
    onDeletePress: () => void;
    onLinkDurationChange: (newDuration: Date) => void;
}


const SortablePlaylistContent: React.FC<props> = ({
    id,
    contentInfo,
    onContentClick,
    highlighted,
    sliderValue,
    isEditable,
    onDeletePress,
    onLinkDurationChange
}) => {

    const {
        attributes,
        listeners,
        isDragging,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: id });

    if (!isEditable) {
        // disable sorting playlist contents using drag & drop
        return <Content
            contentInfo={contentInfo}
            onContentClick={onContentClick}
            highlighted={highlighted}
            sliderValue={sliderValue}
            withOptions={isEditable}
            onDeletePress={onDeletePress}
            isLinkDurationEditable={isEditable}
            linkDuration={contentInfo.linkDuration}
            onLinkDurationChange={onLinkDurationChange}
        />
    }


    return <div
        ref={setNodeRef}
        {...attributes}
        style={{
            backgroundColor: "white",
            transform: CSS.Transform.toString(transform),
            display: "flex",
            alignItems: "center",
            marginBottom: 8,
            opacity: isDragging ? 0.5 : undefined,
            transition,
        }}
    >

        <div
            {...listeners}
            style={{
                cursor: "move !important",
                flex: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Content
                contentInfo={contentInfo}
                onContentClick={onContentClick}
                highlighted={highlighted}
                sliderValue={sliderValue}
                withOptions={isEditable}
                onDeletePress={onDeletePress}
                isLinkDurationEditable={isEditable}
                linkDuration={contentInfo.linkDuration}
                onLinkDurationChange={onLinkDurationChange}
            />
        </div>
    </div>
}

export default SortablePlaylistContent;