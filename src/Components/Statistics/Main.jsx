import { useEffect, useState } from "react";
import { ReactComponent as SearchSvg } from "../../assets/svg/search.svg";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import useRSB from "../../hooks/useRSB";
import StatsScreens from "./Screens/StatsScreens";
import StatsContent from "./Contents/StatsContent";
import useStore from "../../store/store";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Main(){
    const {setRsbVariant} = useRSB();
    const {userInfo } = useAuth()
  const navigate = useNavigate();
    const [statsFor, setStatsFor] = useState("contents");
    const setErrorMsg = useStore(state => state.setErrorMsg)

    useEffect(()=>{
      if(!userInfo || userInfo.privileges.stats !== true){
        setErrorMsg("Vous n'avez pas les privilèges nécessaires pour visualiser les statistiques.")
        setTimeout(() => {
          navigate("/devices");
        }, 1000);
      }
    }, [userInfo, setErrorMsg, navigate])

    useEffect(()=>{
        setRsbVariant({
          name: "NULL",
          renderComponent : () => <></>,
        });

    }, [setRsbVariant]);

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(()=>{
      var t = setTimeout(()=>{
        setSearchTerm(searchInput);
      }, 500);
      return ()=>{
        clearTimeout(t);
      }
    }, [searchInput])


    return (
      <div
        className="main-screen hide-scrollbar"
        style={{
          overflowY: "scroll",
        }}
      >
        <div className="main-screen-top">
          <div className="search">
            <SearchSvg fill="none" stroke="#bec4c4" />
            <input type="text" placeholder="Chercher ..." value={searchInput} onChange={e => {
              setSearchInput(e.target.value);
            }} />
          </div>
          <ButtonGroup variant="outlined">
            <Button
              sx={{
                px: 3.6,
                py: 0.5,
                fontWeight: "400",
                backgroundColor:
                  statsFor === "contents" ? "#F00020" : "#f3f5f5",
                color: statsFor === "contents" ? "#FFF" : "#000",
                "&:hover": {
                  backgroundColor:
                    statsFor === "contents" ? "#F00020" : "#f3f5f5",
                  color: statsFor === "contents" ? "#FFF" : "#000",
                },
              }}
              onClick={
                statsFor === "contents"
                  ? null
                  : () => {
                      setStatsFor("contents");
                    }
              }
            >
              POUR CONTENUS
            </Button>
            <Button
              sx={{
                px: 3.6,
                py: 0.5,
                fontWeight: "400",
                backgroundColor: statsFor === "screens" ? "#F00020" : "#f3f5f5",
                color: statsFor === "screens" ? "#FFF" : "#000",
                "&:hover": {
                  backgroundColor:
                    statsFor === "screens" ? "#F00020" : "#f3f5f5",
                  color: statsFor === "screens" ? "#FFF" : "#000",
                },
              }}
              onClick={
                statsFor === "screens"
                  ? null
                  : () => {
                      setStatsFor("screens");
                    }
              }
            >
              POUR ÉCRANS
            </Button>
          </ButtonGroup>
        </div>
        {statsFor === "contents" ? (
          <StatsContent searchTerm={searchTerm} />
        ) : (
          <StatsScreens searchTerm={searchTerm} />
        )}
      </div>
    );
}