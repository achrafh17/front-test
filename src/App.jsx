import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import ForgottenPassword from "./routes/ForgottenPassword";
import ResetPassword from "./routes/ResetPassword";
import Devices from "./routes/Devices";
import DevicePage from "./routes/DevicePage";
import Content from "./routes/Content";
import Playlists from "./routes/Playlists";
import Apps from "./routes/Apps";
import Statistics from "./routes/Statistics";
import Layouts from "./routes/Layouts";
import Users from "./routes/Users"
import AppLayout from "./Components/AppLayout"
import Admin from "./Components/Admin"
import Profile from "./Components/Profile"
import Schedule from "./routes/Schedule";


import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./Components/auth/AuthProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import LayoutEditor from "./Components/Layouts/LayoutEditor";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#F00020",
      },
      secondary: {
        main: "#2C2C2C",
      },
    },
  });

  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgotten-password" element={<ForgottenPassword />} />
            <Route path="/admin" element={<Admin />} />
            <Route element={<AppLayout />}>
              <Route path="me" element={<Profile />}></Route>
              <Route path="devices" element={<Devices />}></Route>
              <Route
                path="device"
                element={<Navigate to="/devices" replace />}
              />
              <Route path="device/:deviceHashId" element={<DevicePage />} />
              <Route path="content" element={<Content />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="apps" element={<Apps />} />
              <Route path="layouts" element={<Layouts />} />
              <Route path="schedule" element={<Schedule />} />
              <Route
                path="layouts/:layoutId/:slideId"
                element={<LayoutEditor />}
              />
              <Route path="statistics" element={<Statistics />} />
              <Route path="users" element={<Users />} />
            </Route>
            {/* handle not recognized routes */}
            <Route path="*" element={<Navigate to="/devices" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
