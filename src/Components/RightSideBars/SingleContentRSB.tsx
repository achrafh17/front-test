import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
// @ts-ignore
import { ReactComponent as PreviewFullscreenSVG } from "../../assets/svg/preview-fullscreen.svg";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { TimeInput, DatePicker } from "@mantine/dates";
// @ts-ignore
import { ReactComponent as VideoPreviewSVG } from "../../assets/svg/video-preview.svg";
import dayjs from "dayjs";
import Backdrop from "@mui/material/Backdrop";
import { formatBytes } from "../../utils/utils";
import {IContent} from "../../types/api.types"
import ContentIcon from "../Common/ContentIcon";

interface props {
  contentInfo: IContent
}
const SingleContentRSB: React.FC<props> = ({ contentInfo }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);

  let isMedia = contentInfo.type === "Image" || contentInfo.type === "Video";
 
  return (
    <>
      <Box sx={{ height: "100%", width: "100%" }}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            maxHeight: 222,
            height: 222,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxHeight: 222,
              height: 222,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
            }}
          >
            {contentInfo.type === "Video" ? (
              <VideoPreviewSVG fill="#aaa" width="50%" height="50%" />
            ) : contentInfo.type === "Image" ? (
              <img
                src={`https://www.powersmartscreen.com/storage/${contentInfo.previewPath}`}
                alt=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              <ContentIcon
                appInfo={contentInfo.appInfo}
                type={contentInfo.type}
                path={contentInfo.path}
                title={contentInfo.title}
              />
            )}
          </Box>
          {isMedia && <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              padding: 2,
              zIndex: 3,
              cursor: "pointer",
              "&::after": {
                content: "''",
                width: "110%",
                height: "110%",
                backgroundColor: "rgba(0,0,0, 0.6)",
                filter: "blur(16px)",
                position: "absolute",
                left: -5,
                bottom: -5,
                zIndex: 3,
              },
            }}
            onClick={() => {
              setIsPreviewOpen(true);
            }}
          >
            <PreviewFullscreenSVG
              style={{ zIndex: 555, position: "relative" }}
            />
          </Box>}
        </Box>
        <Box sx={{ padding: 3 }}>
        <Typography sx={{ fontSize: 13, color: "#797c7c" }}>Nom</Typography>
          <Typography sx={{fontSize: 16, color: "black", pt: 1, pb: .5, borderBottom:"1px solid #797c7c"}}>
          {contentInfo.title}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Box
              sx={{
                mt: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: 400, fontSize: 16 }}
              >
                Info
              </Typography>
              <Typography
                className="show-info"
                variant="subtitle1"
                sx={{
                  color: "#9ca0a1",
                  cursor: "pointer",
                  fontSize: 12,
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setIsInfoExpanded((old) => !old);
                }}
              >
                {isInfoExpanded ? "Masquer" : "Afficher"}
              </Typography>
            </Box>
            {isInfoExpanded && (
              <>
                <p className="info-label">
                  Type: <span className="info-value">{contentInfo.type}</span>
                </p>
                {isMedia &&
                  contentInfo.filesize !== null && (
                    <p className="info-label">
                      Taille:{" "}
                      <span className="info-value">
                        {formatBytes(contentInfo.filesize)}
                      </span>
                    </p>
                  )}
                {isMedia && (
                  <p className="info-label">
                    Résolution:{" "}
                    <span className="info-value">
                      {`${contentInfo.originalWidth}x${contentInfo.originalHeight}`}
                    </span>
                  </p>
                )}
                <p className="info-label">
                  Créé le:{" "}
                  <span className="info-value">
                    {dayjs(contentInfo.createdAt).format("DD MMMM YYYY, HH:mm")}
                  </span>
                </p>
                <p className="info-label">
                  Nombre de visualisations:{" "}
                  <span className="info-value">{contentInfo.showTotal}</span>
                </p>
                <p className="info-label">
                  Durée totale de visualisations:{" "}
                  <span className="info-value">
                    {dayjs(contentInfo.showTime * 1000).format("HH:mm:ss")}
                  </span>
                </p>
              </>
            )}
          </Box>
          {/* <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Switch
              sx={{ ml: -1 }}
              checked={contentInfo.blocked}
              onChange={(e) => {
                setcontentInfo((old) => {
                  return { ...old, blocked: !!e.target.checked };
                });
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>Bloquer</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Switch
              sx={{ ml: -1 }}
              checked={contentInfo.validateTime}
              onChange={(e) => {
                setcontentInfo((old) => {
                  return { ...old, validateTime: !!e.target.checked };
                });
              }}
            />
            <Typography sx={{ color: "#9ca0a1" }}>Durée de vie</Typography>
          </Box>
          {contentInfo.validateTime && (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <DatePicker
                  label="Jour de début:"
                  labelProps={{
                    style: {
                      color: "#9ca0a1",
                      fontSize: 12,
                      fontWeight: 400,
                    },
                  }}
                  inputFormat="DD/MM/YYYY"
                  value={validateTimeFields.startDate}
                  onChange={(newStartDate) => {
                    setValidateTimeFields((old) => {
                      return { ...old, startDate: newStartDate };
                    });
                  }}
                  className="border-color-primary"
                />
              </Grid>
              <Grid item xs={6}>
                <TimeInput
                  variant="default"
                  label="Heure de début:"
                  withSeconds
                  labelProps={{
                    style: {
                      color: "#9ca0a1",
                      fontSize: 12,
                      fontWeight: 400,
                    },
                  }}
                  value={validateTimeFields.startTime}
                  onChange={(newStartTime) => {
                    setValidateTimeFields((old) => {
                      return { ...old, startTime: newStartTime };
                    });
                  }}
                  className="border-color-primary"
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Jour de début:"
                  labelProps={{
                    style: {
                      color: "#9ca0a1",
                      fontSize: 12,
                      fontWeight: 400,
                    },
                  }}
                  inputFormat="DD/MM/YYYY"
                  value={validateTimeFields.endDate}
                  onChange={(newEndDate) => {
                    setValidateTimeFields((old) => {
                      return { ...old, endDate: newEndDate };
                    });
                  }}
                  className="border-color-primary"
                />
              </Grid>
              <Grid item xs={6}>
                <TimeInput
                  variant="default"
                  label="Heure de fin:"
                  withSeconds
                  labelProps={{
                    style: {
                      color: "#9ca0a1",
                      fontSize: 12,
                      fontWeight: 400,
                    },
                  }}
                  value={validateTimeFields.endTime}
                  onChange={(newEndTime) => {
                    setValidateTimeFields((old) => {
                      return { ...old, endTime: newEndTime };
                    });
                  }}
                  className="border-color-primary"
                />
              </Grid>
            </Grid>
          )} */}
        </Box>
      </Box>
      {isPreviewOpen && (
        <Backdrop
          sx={{ zIndex: 1000 }}
          open={isPreviewOpen}
          onClick={(e) => {
            //@ts-ignore
            if (e.target.id !== "video-preview") {
              setIsPreviewOpen(false);
            }
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 3,
            }}
          >
            {contentInfo.type === "Image" ? (
              <img
                src={`https://www.powersmartscreen.com/storage/${contentInfo.previewPath}`}
                alt=""
                style={{
                  maxHeight: "calc(100vh - 100px)",
                  maxWidth: "calc(100vw - 200px)",
                  objectFit: "cover",
                  height: "100%",
                }}
              />
            ) : (
              <video
                id="video-preview"
                src={`https://www.powersmartscreen.com/storage/${contentInfo.path}`}
                controls
                style={{
                  maxHeight: "calc(100vh - 100px)",
                  maxWidth: "calc(100vw - 200px)",
                  height: "100%",
                }}
                onClick={() => {}}
              />
            )}
          </Box>
        </Backdrop>
      )}
    </>
  );
}

export default SingleContentRSB;