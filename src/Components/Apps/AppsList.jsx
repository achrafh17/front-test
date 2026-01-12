import Box from "@mui/system/Box";
import Grid from "@mui/material/Grid";
import SingleApp from "./SingleApp"

import YoutubeIMG from "../../assets/images/youtube.png";
import  EuronewsIMG from "../../assets/svg/euronews.svg";
import FbVideoIMG from "../../assets/svg/fb_video.svg";
import TV5MondeIMG from "../../assets/svg/tv5monde.svg";
import France24IMG from "../../assets/images/france24.png"
import ODJIMG from "../../assets/images/odj.png";
import RSSIMG from "../../assets/images/rss.png";
import SliderIMG from "../../assets/images/slider.png";
import ClockIMG from "../../assets/images/clock.png";
import WeatherIMG from "../../assets/images/weather.png"
import EmbedIMG from "../../assets/images/embed.png";
import TwitterIMG from "../../assets/images/twitter.png";
import InstagramIMG from "../../assets/images/instagram.png";
import GamesIMG from "../../assets/images/games.png";
import RingoverIMG from "../../assets/svg/ringover.svg";


const APPS = [
  {
    name: "Youtube",
    id: "youtube",
    type: "Appli",
    imageSrc: YoutubeIMG,
  },
  {
    name: "Euronews",
    id: "euronews",
    type: "Appli",
    imageSrc: EuronewsIMG,
  },
  {
    name: "Facebook Video",
    id: "fb_video",
    type: "Appli",
    imageSrc: FbVideoIMG,
  },
  {
    name: "TV5 Monde",
    id: "tv5",
    type: "Appli",
    imageSrc: TV5MondeIMG,
  },
  {
    name: "France24",
    id: "france24",
    type: "Appli",
    imageSrc: France24IMG,
  },
  {
    name:"ODJ",
    id:"odj",
    "type": "appli",
    imageSrc: ODJIMG
  }, 
  {
    name:"RSS",
    id:"rss",
    "type": "appli",
    imageSrc: RSSIMG
  }, 
  {
    name:"Slider",
    id:"slider",
    "type": "appli",
    imageSrc: SliderIMG
  }, 
  {
    name: "Horloge",
    id: "clock",
    type: "Appli",
    imageSrc: ClockIMG,
  },
  {
    name: "Météo",
    id: "meteo",
    type: "Appli",
    imageSrc: WeatherIMG,
  },
  {
    name: "Embeddable Code",
    id: "embed",
    type: "Appli",
    imageSrc: EmbedIMG,
  },
  // {
  //   name: "Twitter",
  //   id: "twitter",
  //   type: "Appli",
  //   imageSrc: TwitterIMG,
  // },
  {
    name: "Jeux",
    id: "games",
    type: "Jeux",
    imageSrc: GamesIMG,
  },
  {
    name: "Stats Ringover",
    id: "ringover",
    type: "Appli",
    imageSrc: RingoverIMG,
  }
  // {
  //   name: "Instagram",
  //   id: "instagram",
  //   type: "Appli",
  //   imageSrc: InstagramIMG,
  // }
];

export default function AppsList({ sliderValue }) {

  return (
    <Box sx={{ px: 3 }}>
      <Grid
        container
        flexDirection="row"
        spacing={2}
        sx={{
          ml: 0,
          pt: 2,
          overflowY: "scroll",
          maxHeight: "calc(100vh - 80px - 60px - (24px * 2) - 32px)",
        }}
        className="hide-scrollbar"
      >
        {APPS.map((app, idx) => {
          return (
            <SingleApp key={idx} app={app} sliderValue={sliderValue} />
          );
        })}
      </Grid>
    </Box>
  );
}
