import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentIcon from "../Common/ContentIcon";
import { IContent } from "../../types/api.types";
import { Tooltip } from "@mui/material";
import LinkDurationView from "./LinkDurationView";

interface props {
  contentInfo: IContent;
  sliderValue: number;
  highlighted: boolean;
  withOptions: boolean;
  linkDuration?: number;
  isLinkDurationEditable?: boolean;
  onContentClick: () => void;
  onDeletePress: () => void;
  onLinkDurationChange?: (newDuration: Date) => void;
}

const Content: React.FC<props> = ({
  contentInfo,
  sliderValue,
  highlighted,
  withOptions,
  onContentClick,
  onDeletePress,
  linkDuration,
  isLinkDurationEditable,
  onLinkDurationChange,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <>
      {sliderValue === 1 ? (
        <Grid
          item
          xs={12}
          sx={{
            padding: "0 !important",
            height: 64,
            mr: 2,
            mb: 1,
            borderBottom: "1px solid #eee",
            borderRadius: 1,
            position: "relative",
            cursor: "pointer",
          }}
          className={`content-entity size-${sliderValue} ${
            highlighted ? "active" : ""
          }`}
          onClick={onContentClick}
          onMouseEnter={() => {
            setShowOptions(true);
          }}
          onMouseLeave={() => {
            setShowOptions(false);
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: 1.5,
              height: "100%",
              width: "100%",
              gap: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "40px !important",
                height: "40px !important",
                borderRadius: 1,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: "#f0f0f0",
              }}
            >
              <ContentIcon
              title={contentInfo.title}
                type={contentInfo.type}
                path={contentInfo?.previewPath}
                appInfo={contentInfo?.appInfo}
              />
              <div className="content-shadow"></div>
            </Box>
            <Box
              sx={{
                height: 40,
                flex: 1,
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: 16,
                  lineHeight: 1.4,
                  color: "#3f4242",
                  maxWidth: "70%",
                }}
                noWrap
              >
                {contentInfo.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: 12,
                    lineHeight: 1.2,
                    color: "#b2b7b8",
                    mr: 3,
                  }}
                >
                  {contentInfo.type}
                </Typography>
                {linkDuration !== undefined && (
                  <LinkDurationView
                    isEditable={isLinkDurationEditable}
                    linkDuration={linkDuration}
                    onLinkDurationChange={onLinkDurationChange}
                  />
                )}
              </Box>
            </Box>
            {showOptions && withOptions && (
              <Box
                sx={{
                  minWidth: 80,
                  width: 80,
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  py: 0.5,
                  px: 1,
                }}
                className="content-options"
              >
                {/* {selected ? (
                  <CheckCircleIcon
                    sx={{
                      color: "#f00020",
                      cursor: "pointer",
                      fontSize: "180%",
                    }}
                    onClick={() => {
                      setSelected((old) => !old);
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{
                      color: "#bec4c4",
                      cursor: "pointer",
                      fontSize: "180%",
                    }}
                    onClick={() => {
                      setSelected((old) => !old);
                    }}
                  />
                )} */}

                <DeleteOutlineIcon
                  sx={{
                    color: "#bec4c4",
                    cursor: "pointer",
                    fontSize: "180%",
                  }}
                  onClick={onDeletePress}
                />
              </Box>
            )}
          </Box>
        </Grid>
      ) : (
        <Grid
          item
          sx={{
            padding: "0 !important",
            mr: 3,
            mb: 3,
            borderRadius: 1,
            position: "relative",
            cursor: "pointer",
          }}
          className={`content-entity size-${sliderValue} ${
            highlighted ? "active" : ""
          }`}
          onClick={onContentClick}
          onMouseEnter={() => {
            setShowOptions(true);
          }}
          onMouseLeave={() => {
            setShowOptions(false);
          }}
        >
          <Box
            sx={{
              overflow: "hidden",
              width: "100%",
              height: "100%",
              borderRadius: 1,
              backgroundColor: "#f0f0f0",
            }}
          >
            {showOptions && withOptions && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 3,
                  width: "100%",
                  height: "25%",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  py: 0.5,
                  px: 1,
                }}
                className="content-options"
              >
                {/* {selected ? (
                  <CheckCircleIcon
                    sx={{
                      color: "#f00020",
                      cursor: "pointer",
                      fontSize: "180%",
                    }}
                    onClick={() => {
                      setSelected((old) => !old);
                    }}
                  />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{
                      color: "#bec4c4",
                      cursor: "pointer",
                      fontSize: "180%",
                    }}
                    onClick={() => {
                      setSelected((old) => !old);
                    }}
                  />
                )} */}

                <Tooltip title="Supprimer" arrow placement="top">
                  <DeleteOutlineIcon
                    sx={{
                      color: "#bec4c4",
                      cursor: "pointer",
                      fontSize: "180%",
                    }}
                    onClick={onDeletePress}
                  />
                </Tooltip>
              </Box>
            )}
            <Box
              sx={{
                width: "100%",
                height: "75%",
                overflow: "hidden",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <ContentIcon
              title={contentInfo.title}

                type={contentInfo.type}
                path={contentInfo?.previewPath}
                appInfo={contentInfo?.appInfo}
              />
              <div className="content-shadow"></div>
            </Box>
            <Box
              sx={{
                height: "25%",
                py: ".5em",
                px: ".75em",
                width: !!linkDuration ? "100%" : "75%",
                maxWidth: !!linkDuration ? "100%" : "75%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  fontSize: "100%",
                  fontWeight: 500,
                }}
              >
                {contentInfo.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "86%",
                  }}
                >
                  {contentInfo.type}
                </Typography>
                {linkDuration !== undefined && (
                  <LinkDurationView
                    isEditable={isLinkDurationEditable}
                    linkDuration={linkDuration}
                    onLinkDurationChange={onLinkDurationChange}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default Content;
