import "../styles/Nav.css";
import logoWhite from "../assets/images/logoWhite.png";
import { ReactComponent as AdjustmentsSvg } from "../assets/svg/adjustments.svg";
import { ReactComponent as ChartPieSvg } from "../assets/svg/chart-pie.svg";
import { ReactComponent as UsersSvg } from "../assets/svg/users.svg";
import useAuth from "../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";

export default function Nav() {
  const { userInfo } = useAuth();
  const location = useLocation();
  let profileName = userInfo?.company ?? userInfo?.userName ?? "Company";



  return (
    <nav className="top-bar">
      <div className="flex-1">
        <div className="logo-container">
          <img src={logoWhite} alt="" />
        </div>
      </div>
      {userInfo?.privileges.stats === true && (
        <Link
          to="/statistics"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {location.pathname === "/statistics" ? (
            <ChartPieSvg stroke="#F00020" />
          ) : (
            <ChartPieSvg stroke="#FFF" />
          )}
        </Link>
      )}
      {userInfo?.parentId === null && (
        <Link
          to="/users"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {location.pathname === "/users" ? (
            <UsersSvg stroke="#F00020" />
          ) : (
            <UsersSvg stroke="#FFF" />
          )}
        </Link>
      )}

      <AdjustmentsSvg />
      <div className="company-info">
        <Typography className="company-name" sx={{ maxWidth: 150 }} noWrap>
          {profileName}
        </Typography>
        <p>Société</p>
      </div>
    </nav>
  );
}
