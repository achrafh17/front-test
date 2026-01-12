import { ReactComponent as VideoPreviewSVG } from "../../assets/svg/video-preview.svg";
import YoutubeIMG from "../../assets/images/youtube.png";
import EuronewsIMG from "../../assets/svg/euronews.svg";
import FbVideoIMG from "../../assets/svg/fb_video.svg";
import TV5MondeIMG from "../../assets/svg/tv5monde.svg";
import France24IMG from "../../assets/images/france24.png";
import ODJIMG from "../../assets/images/odj.png";
import ClockIMG from "../../assets/images/clock.png";
import WeatherIMG from "../../assets/images/weather.png";
import RSSIMG from "../../assets/images/rss.png";
import TicTacToeIMG from "../../assets/images/tic-tac-toe.png";
import HiddenWordsIMG from "../../assets/svg/hidden-words.svg";
import WordleIMG from "../../assets/svg/wordle.svg";
import SliderIMG from "../../assets/images/slider.png";
import EmbedIMG from "../../assets/images/embed.png";
import TwitterIMG from "../../assets/images/twitter.png";
import RingoverIMG from "../../assets/svg/ringover.svg"

export default function ContentIcon({ type, path, title, appInfo }) {
  if (type === "Video") {
    return <VideoPreviewSVG height="50%" width="50%" fill="#aaa" />;
  }

  if (type === "Image") {
    return (
      <img
        src={`https://www.powersmartscreen.com/storage/${path}`}
        alt=""
        style={{
          objectFit: "cover",
          objectPosition: "center",
          height: "100%",
          width: "100%",
          minWidth: 40,
          aspectRatio: 1,
        }}
      />
    );
  }

  var logos = {
    Youtube: YoutubeIMG,
    Euronews: EuronewsIMG,
    "Facebook Video": FbVideoIMG,
    "TV5 Monde": TV5MondeIMG,
    France24: France24IMG,
    ODJ: ODJIMG,
    RSS: RSSIMG,
    Horloge: ClockIMG,
    Météo: WeatherIMG,
    "Tic Tac Toe": TicTacToeIMG,
    Wordle: WordleIMG,
    "Mots Cachés": HiddenWordsIMG,
    Slider: SliderIMG,
    "Embeddable code": EmbedIMG,
    "Twitter": TwitterIMG,
    "Stats Ringover": RingoverIMG,
  };

  return (
    <img
      src={type === "Jeu" ? logos[JSON.parse(appInfo ?? '{}')?.type] ?? logos[title] : logos[type]}
      alt=""
      style={{
        objectFit: type==="Jeu" ? "contain":"cover",
        objectPosition: "center",
        height: "100%",
        width: "100%",
        minWidth: 40,
        aspectRatio: 1,
      }}
    />
  );
}
