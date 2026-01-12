import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useRSB from "../../hooks/useRSB";
import React, { useEffect, useState } from "react";
import { VariantName } from "../../types/rsb.types";
import YoutubeRSB from "../RightSideBars/Apps/YoutubeRSB"
import EuronewsRSB from "../RightSideBars/Apps/EuronewsRSB"
import FbVideoRSB from "../RightSideBars/Apps/FbVideoRSB"
import TV5MondeRSB from "../RightSideBars/Apps/TV5MondeRSB"
import ClockRSB from "../RightSideBars/Apps/ClockRSB"
import France24RSB from "../RightSideBars/Apps/France24RSB"
import WeatherRSB from "../RightSideBars/Apps/WeatherRSB"
import ODJRSB from "../RightSideBars/Apps/ODJRSB";
import RSSRSB from "../RightSideBars/Apps/RSSRSB";
import SliderRSB from "../RightSideBars/Apps/SliderRSB"
import TwitterRSB from "../RightSideBars/Apps/TwitterRSB"
import EmbeddableCodeRSB from "../RightSideBars/Apps/EmbeddableCodeRSB";
import InstagramRSB from "../RightSideBars/Apps/InstagramRSB"
import GamesRSB from "../RightSideBars/Apps/GamesRSB";
import RingoverRSB from "../RightSideBars/Apps/RingoverRSB";

interface props {
  app: {
    name: string;
    id: string;
    type: string;
    imageSrc: string;
  };
  sliderValue: number;
}

const SingleApp: React.FC<props> = ({ app, sliderValue }) => {
  const { rsbVariant, setRsbVariant } = useRSB();

  const [highlighted, setHighlighted] = useState(false);

  useEffect(()=>{
    if (rsbVariant.name === `apps_${app.id}`) {
      setHighlighted(true);
    } else {
      setHighlighted(false);
    }
  }, [rsbVariant, app.id])

  const renderRSB = (rsbVariantName: VariantName) => {
    switch (rsbVariantName) {
      case "APPS_YOUTUBE":
        return <YoutubeRSB />
      case "APPS_EURONEWS":
        return <EuronewsRSB />
      case "APPS_FB_VIDEO":
        return <FbVideoRSB />
      case "APPS_TV5":
        return <TV5MondeRSB />
      case "APPS_CLOCK":
        return <ClockRSB />
      case "APPS_FRANCE24":
        return <France24RSB />
      case "APPS_METEO":
        return <WeatherRSB />
      case "APPS_ODJ":
        return <ODJRSB />;
      case "APPS_RSS":
        return <RSSRSB />;
      case "APPS_SLIDER":
        return <SliderRSB />;
      case "APPS_EMBED":
        return <EmbeddableCodeRSB />;
      case "APPS_TWITTER":
        return <TwitterRSB />;
      case "APPS_GAMES":
        return <GamesRSB />;
      case "APPS_INSTAGRAM":
        return <InstagramRSB />;
      case "APPS_RINGOVER":
        return <RingoverRSB />;
      default:
        return <></>;
    }
  }

  return (
    <>
      {sliderValue === 1 ? (
        <Grid
          item
          xs={12}
          sx={{
            pl: "0 !important",
            pt: "0 !important",
            pb: 1,
            height: 68,
            width: "100%",
            mr: 2,
            mb: 1,
            borderBottom: "1px solid #eee",
            borderRadius: 1,
            position: "relative",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
          className={`content-entity size-${sliderValue} `}
        >
          <Box
            sx={{
              height: 60,
              width: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 1.2,
            }}
          >
            <img
              src={app.imageSrc}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: "1.1em" }}>{app.name}</Typography>
            <Typography sx={{ fontSize: "0.9em" }}>{app.type}</Typography>
          </Box>
        </Grid>
      ) : (
        <Grid
          item
          sx={{
            padding: "0 !important",
            mr: 3,
            mb: 3,
            borderRadius: 1.2,
            position: "relative",
            cursor: "pointer",
            backgroundColor: "#f3f5f5",
            overflow: "hidden",
            border: "1px solid #ddd",
            boxShadow: highlighted ? 5 : 0,
            transition: ".3s box-shadow ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          className={`content-entity size-${sliderValue}`}
          onClick={() => {
            setRsbVariant({
              name: `APP_${app.id.toUpperCase()}` as VariantName,
              renderComponent: () => {
                return renderRSB(`APPS_${app.id.toUpperCase()}` as VariantName)
              }
            });
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "70%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              className="app-img"
              src={app.imageSrc}
              alt=""
              style={{ objectFit: "cover", width: "100%" }}
            />
            <div className="app-img-overlay" />
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "30%",
              backgroundColor: "transparent",
              p: 0.8,
              px: 1.2,
            }}
          >
            <Typography sx={{ fontSize: "1.25em" }}>{app.name}</Typography>
            <Typography sx={{ fontSize: "1em" }}>{app.type}</Typography>
          </Box>
        </Grid>
      )}
    </>
  );
}

export default SingleApp;