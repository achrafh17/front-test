import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import TableHead from "./StatsContentTableHead";
import TableRow from "./StatsContentTableRow";

const sort = (arr, sortKey, sortOrder) => {
  var arr_copy = arr.concat();
  if(sortOrder === "asc"){
    arr_copy.sort((c1, c2) => {
      var k1 = c1[`${sortKey}`],
      k2 = c2[`${sortKey}`]; 
      if(typeof k2 === "string" && typeof k1 === "string"){
        k2 = k2.toLowerCase();
        k1 = k1.toLowerCase();
      }
      if (k1 > k2) {
        return 1;
      } else if (k1 === k2) {
        return 0;
      } else {
        return -1;
      }
    })
  }else{
    arr_copy.sort((c1, c2) => {
      var k1 = c1[`${sortKey}`],
      k2 = c2[`${sortKey}`]; 
      if(typeof k2 === "string" && typeof k1 === "string"){
        k2 = k2.toLowerCase();
        k1 = k1.toLowerCase();
      }
      if(k1>k2){
        return -1;
      }else if(k1===k2){
        return 0;
      }else {
        return 1;
      }
    })
  }
  return arr_copy;
}

const APPS = [
  "Youtube",
  "Euronews",
  "Facebook Video",
  "TV5 Monde",
  "France24",
  "ODJ",
  "RSS",
  "Slider",
  "Horloge",
  "Météo",
  "Embeddable Code",
  "Twitter",
];

export default function StatsContent({ searchTerm }) {
  const { userInfo } = useAuth();
  const [contentsStats, setContentsStats] = useState([]);
  const [sortedStats, setSortedStats] = useState([]);

  const [sorting, setSorting] = useState(["title", "asc"]);

  useEffect(() => {
    fetch(
      `https://www.powersmartscreen.com/get-contents-stats?sessionId=${userInfo?.sessionId}`
    )
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success) {
          setContentsStats(resJson.result);
        }
      })
      .catch((e) => {});
  }, [userInfo?.sessionId]);

  useEffect(()=>{
    if(!!searchTerm){
      setSortedStats(contentsStats.filter((c) => c.title.includes(searchTerm)));
    }else{
      setSortedStats(contentsStats)
    }
  }, [searchTerm, contentsStats])

  useEffect(() => {
    if (sorting[0] === "type") {
      console.log(sorting[1])
      if (sorting[1] === "Tous") {
        setSortedStats(contentsStats);
      } else if (sorting[1] === "App") {
        setSortedStats(contentsStats.filter((c) => APPS.includes(c.type)))
      } else {
        setSortedStats(contentsStats.filter((c) => c.type === sorting[1]));
      }
    } else {
      setSortedStats(sort(contentsStats, sorting[0], sorting[1]));
    }
  }, [contentsStats, sorting]);

  return (
    <Box sx={{ py: 4, px: 2 }}>
      <TableHead sorting={sorting} setSorting={setSorting} />
      {sortedStats.map((stat, idx) => {
        return <TableRow key={idx} stat={stat} />;
      })}
    </Box>
  );
}