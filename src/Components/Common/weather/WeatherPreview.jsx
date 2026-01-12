import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import  SVG_01 from "../../../assets/svg/01.svg";
import  SVG_02 from "../../../assets/svg/02.svg";
import  SVG_03 from "../../../assets/svg/03.svg";
import  SVG_04 from "../../../assets/svg/04.svg";
import  SVG_09 from "../../../assets/svg/09.svg";
import  SVG_10 from "../../../assets/svg/10.svg";
import  SVG_11 from "../../../assets/svg/11.svg";
import  SVG_13 from "../../../assets/svg/13.svg";
import  SVG_50 from "../../../assets/svg/50.svg";

import 'dayjs/locale/fr'
dayjs.locale("fr");

const ICONS = {
    "01": SVG_01,
    "02": SVG_02,
    "03": SVG_03,
    "04": SVG_04,
    "09": SVG_09,
    "10": SVG_10,
    "11": SVG_11,
    "13": SVG_13,
    "50": SVG_50,
}

const formatTemp = (temp) => {
    return parseInt(temp - 273.15) > 0
      ? `+${parseInt(temp - 273.15)}°`
      : `${parseInt(temp - 273.15)}°`;
}

export default function WeatherPreview({lat, lon}){

    const [isLoading, setIsLoading] = useState(false)
    const [forecast, setForecast] = useState([]);
    const [cityName, setCityName] = useState("");

    const getWeatherForecast = async (latitude, longitude) => {
        
        if (latitude && longitude) {
          try {
            var res = await fetch(
              `https://www.powersmartscreen.com/get-weather-forecast?lat=${latitude}&lon=${longitude}`
            );
            var resJson = await res.json();
            if (resJson.success && resJson.result?.code === "200") {
                setCityName(resJson.result.city.name)
              return resJson.result.list;
            }else{
                return [];
            }
          } catch (e) {
            return [];
          }
        } else {
          return [];
        }
    }

    useEffect(()=>{
        var t = null;
        
        (async () => {
          setIsLoading(true);
          var data = await getWeatherForecast(lat, lon);
          setForecast(data);
          setIsLoading(false);
        })();

        return ()=>{
            clearTimeout(t);
        }
    }, [lat, lon])

    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ color: "white" }} size={20} />
        ) : (
          <>
            {forecast.length > 0 && (
              <Box
                sx={{
                  background:
                    "linear-gradient(72.44deg, #317D9D 0%, #25789B 0.01%, #75B5CF 100%)",
                  width: "100%",
                  height: "100%",
                  padding: "5%",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent:"space-between"
                }}
              >
                <Box sx={{ flex: 1, display: "flex", maxHeight: "60%" }}>
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: 12, lineHeight: 1 }}>
                        {cityName}
                      </Typography>
                      <Typography sx={{ fontSize: 10, fontWeight: "light" }}>
                        {dayjs().format("dddd, DD MMMM")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        sx={{
                          fontSize: 34,
                          pr: 0.5,
                          borderRight: "1px solid rgba(255,255,255, 0.5)",
                        }}
                      >
                        {formatTemp(forecast[0].main.temp)}
                      </Typography>
                      <Box
                        sx={{
                          pl: 0.5,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ fontSize: 12 }}>
                          {forecast[0].weather[0].description}
                        </Typography>
                        <Typography sx={{ fontSize: 10 }}>
                          Il doit faire{" "}
                          {formatTemp(forecast[0].main.feels_like)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: "40%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <img
                      src={ICONS[forecast[0].weather[0].icon.substring(0, 2)]}
                      alt=""
                      style={{ width: "80%", maxHeight:"90%" }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: "30%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {forecast.slice(1, 5).map((item) => {
                    return (
                      <Box sx={{ width: "20%", height: "100%" }}>
                        <img
                          src={ICONS[item.weather[0].icon.substring(0, 2)]}
                          alt=""
                          style={{ height: "50%", width: "auto" }}
                        />
                        <Typography sx={{ fontSize: 10, lineHeight: 1.1 }}>
                          {formatTemp(item.main.temp_max)} |{" "}
                          {formatTemp(item.main.temp_min)}
                        </Typography>
                        <Typography sx={{ fontSize: 7 }}>
                          {dayjs(item.dt * 1000).format("DD MMM")}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    );
}
