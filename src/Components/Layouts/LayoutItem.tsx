import React from "react"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
//@ts-ignore
import {ReactComponent as LayoutPreviewSVG} from "../../assets/svg/no_preview_layout.svg"
import {useNavigate} from "react-router-dom";

interface props {
    layoutId: number;
    layoutName: string;
    layoutHashId: string;
    slideHashId: string;
    sliderValue: number;
    mainSlideState: string;
}

const LayoutItem: React.FC<props> = ({layoutId, layoutName, layoutHashId, slideHashId, sliderValue}) => {
    const navigate = useNavigate();

    const navigateToLayout = () => {
        navigate(`/layouts/${layoutHashId}/${slideHashId}`);
    }

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
            className={`content-entity size-${sliderValue}`}
            onClick={navigateToLayout}
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
                  backgroundColor: "#d9dfe0",
                  padding: "5px"
                }}
              >
                <LayoutPreviewSVG />
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
                  {layoutName}
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
                    blah blah
                  </Typography>
                </Box>
              </Box>
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
            className={`content-entity size-${sliderValue}`}
            onClick={navigateToLayout}
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
                  padding: 3
                }}
              >
                <LayoutPreviewSVG />
                <div className="content-shadow"></div>
              </Box>
              <Box
                sx={{
                  height: "25%",
                  py: ".5em",
                  px: ".75em",
                  width: "75%",
                  maxWidth: "75%",
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
                  {layoutName}
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
                    blah blah
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </>
    );
}

export default LayoutItem;