import Box from "@mui/material/Box";
import {useState, useEffect} from "react";
import useAuth from "../../../hooks/useAuth";
import SingleScreenStat from "./SingleScreenStat";

export default function StatsScreens({searchTerm}) {
  const [deviceStats, setDeviceStats] = useState([]);
  const [actualStats, setActualStats] = useState([])
  const {userInfo} = useAuth();

  useEffect(()=>{
    fetch(
      `https://www.powersmartscreen.com/get-device-stats?sessionId=${userInfo?.sessionId}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success === true) {
          setDeviceStats(resJson.result);
        }
      })
      .catch((e) => {});
  }, [userInfo?.sessionId])

  useEffect(()=>{
    setActualStats(deviceStats);
  }, [deviceStats])
  
  useEffect(() => {
    if(!!searchTerm){
      setActualStats(deviceStats.filter((d) => d?.name.includes(searchTerm)));
    }else{
      setActualStats(deviceStats)
    }
  }, [searchTerm, deviceStats])

  return <Box sx={{ py: 4, px: 2 }}>
    {actualStats.map((stat, idx) => {
      return <SingleScreenStat stat={stat} key={idx} />;
    })}
  </Box>;
}
