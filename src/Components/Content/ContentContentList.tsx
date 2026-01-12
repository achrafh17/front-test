import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
//@ts-ignore
import { ReactComponent as FilterSvg } from "../../assets/svg/filter.svg";
import MoreHorizontalFilters from "../MoreHorizontalFilters";
import Content from "./Content";
import useRSB from "../../hooks/useRSB";
import SingleContentRSB from "../RightSideBars/SingleContentRSB";
import { IContent } from "../../types/api.types";

interface props {
  isLoading: boolean;
  sliderValue: number;
  contents: IContent[];
  handleContentDeletePress: (contentId: number) => void;
  searchTerm: string;
}

const ContentContentList: React.FC<props> = ({
  isLoading,
  sliderValue,
  contents,
  searchTerm,
  handleContentDeletePress,
}) => {
  const [selectedContentId, setSelectedContentId] = useState<number | null>(
    null
  );
  const { setRsbVariant } = useRSB();

  const handleContentClick = (contentInfo: IContent) => {
    setSelectedContentId(contentInfo.contentId);
    setRsbVariant({
      name: "SINGLE_CONTENT",
      renderComponent: () => <SingleContentRSB contentInfo={contentInfo} />,
    });
  };

  const handleContentDelete = (contentInfo: IContent) => {
    handleContentDeletePress(contentInfo.contentId);
  };

  return (
    <Box>
      <Grid
        container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        columnSpacing={1}
        sx={{ height: 32, my: 2, px: 3 }}
      >
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="h1">
            Contenu
            <Typography
              variant="body2"
              component="span"
              sx={{ marginLeft: 1, color: "#ccc" }}
            >
              {`${contents.length} sur ${contents.length}`}
            </Typography>
          </Typography>
        </Grid>
        {/* <Grid item>
          <FilterSvg
            style={{ width: "24px", height: "24px" }}
            className="hover-dark stroke"
          />
        </Grid> */}
        {/* <MoreHorizontalFilters /> */}
      </Grid>

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
        {isLoading ? (
          <>
            <Grid item sx={{ padding: "0 !important", mr: 3, mb: 3 }}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                className={`content-entity size-${sliderValue}`}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
            <Grid item sx={{ padding: "0 !important", mr: 3, mb: 3 }}>
              <Skeleton
                animation="wave"
                variant="rectangular"
                className={`content-entity size-${sliderValue}`}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          </>
        ) : (
          contents.map((contentInfo, idx) => {
            if(!contentInfo.title.toLowerCase().includes(searchTerm.toLowerCase())){
              return <div key={idx} ></div>
            }
            return (
              <Content
                key={idx}
                contentInfo={contentInfo}
                onContentClick={() => {
                  handleContentClick(contentInfo);
                }}
                highlighted={selectedContentId === contentInfo.contentId}
                sliderValue={sliderValue}
                withOptions={true}
                onDeletePress={() => {
                    handleContentDelete(contentInfo);
                }}
              />
            );
          })
        )}
      </Grid>
    </Box>
  );
};

export default ContentContentList;
