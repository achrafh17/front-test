import "../styles/LeftSideBar.css";

// Icons
import { ReactComponent as UserSvg } from "../assets/svg/user.svg";
import { ReactComponent as DeviceSvg } from "../assets/svg/device.svg";
import { ReactComponent as DeviceActiveSvg } from "../assets/svg/device-active.svg";
import { ReactComponent as ContentSvg } from "../assets/svg/content.svg";
import { ReactComponent as ContentActiveSvg } from "../assets/svg/content-active.svg";
import { ReactComponent as PlaylistSvg } from "../assets/svg/playlist.svg";
import { ReactComponent as PlaylistActiveSvg } from "../assets/svg/playlist-active.svg";
import { ReactComponent as AppSvg } from "../assets/svg/apps.svg";
import { ReactComponent as AppActiveSvg } from "../assets/svg/apps-active.svg";
import { ReactComponent as LayoutsSvg } from "../assets/svg/layouts.svg";
import { ReactComponent as LayoutsActiveSvg } from "../assets/svg/layouts-active.svg";

// 🔥 nouveaux imports pour Schedule/Calendar
import { ReactComponent as CalendarSvg } from "../assets/svg/calendar.svg";
import { ReactComponent as CalendarActiveSvg } from "../assets/svg/calendar-active.svg";

import { Tooltip, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import useStore from "../store/store";
import useAuth from "../hooks/useAuth";

export default function LeftSideBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserInfo } = useAuth();

  const setInitialState = useStore((state) => state.setInitialState);

  useEffect(() => {
    setInitialState(null);
  }, [location, setInitialState]);

  const signout = () => {
    localStorage.clear();
    setUserInfo(null);
    navigate("/signin");
  };

  const isPath = (path) => location.pathname === path;
  const matchPath = (regex) => regex.test(location.pathname);

  return (
    <div className="left-sidebar">

      <Tooltip title={<Typography fontSize={15}>Profil</Typography>} placement="right" arrow>
        <div className="avatar-container" onClick={() => navigate("/me")}>
          <UserSvg />
        </div>
      </Tooltip>

      <p className="signout" onClick={signout}>Déconnexion</p>

      <Tooltip title={<Typography fontSize={15}>Écrans</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${matchPath(/^\/device(.)*$/) ? "selected" : ""}`} to="/devices">
          {matchPath(/^\/device(.)*$/) ? <DeviceActiveSvg /> : <DeviceSvg />}
        </Link>
      </Tooltip>

      <Tooltip title={<Typography fontSize={15}>Contenu</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${isPath("/content") ? "selected" : ""}`} to="/content">
          {isPath("/content") ? <ContentActiveSvg /> : <ContentSvg />}
        </Link>
      </Tooltip>

      <Tooltip title={<Typography fontSize={15}>Playlists</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${isPath("/playlists") ? "selected" : ""}`} to="/playlists">
          {isPath("/playlists") ? <PlaylistActiveSvg /> : <PlaylistSvg />}
        </Link>
      </Tooltip>

      <Tooltip title={<Typography fontSize={15}>Applications</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${isPath("/apps") ? "selected" : ""}`} to="/apps">
          {isPath("/apps") ? <AppActiveSvg /> : <AppSvg />}
        </Link>
      </Tooltip>

      <Tooltip title={<Typography fontSize={15}>Calques</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${matchPath(/^\/layouts(.*)/) ? "selected" : ""}`} to="/layouts">
          {matchPath(/^\/layouts(.*)/) ? <LayoutsActiveSvg /> : <LayoutsSvg />}
        </Link>
      </Tooltip>

     {/* 🆕 CALENDAR / SCHEDULE */}
       <Tooltip title={<Typography fontSize={15}>Schedule</Typography>} placement="right" arrow>
        <Link className={`navigation-btn ${isPath("/schedule") ? "selected" : ""}`} to="/schedule">
          {isPath("/schedule") ? <CalendarActiveSvg /> : <CalendarSvg />}
        </Link>
      </Tooltip>



    </div>
  );
}
