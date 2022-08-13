import { Outlet, NavLink } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/authContext';
import FeelingDial from './components/feeling/feelingDial';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1eb183',
      light: '#60e4b3',
      dark: '#008056'
     }
  }
})

export default function App() {
  return (
    <AuthProvider>
      <div>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">


        <h1>IMAGINOUS</h1>
        <nav
          style={{
            borderBottom: "solid 1px",
            paddingBottom: "1rem",
          }}
        >
          <NavLink className={({ isActive }) => isActive ? "activeLink" : ""} to="/top">Top</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "activeLink" : ""} to="/mypage">Mypage</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "activeLink" : ""} to="/chat">Chat</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "activeLink" : ""} to="/login">Login</NavLink> |{" "}
          <NavLink className={({ isActive }) => isActive ? "activeLink" : ""} to="/signup">signup</NavLink> |{" "}
        </nav>
        <Outlet />
        <FeelingDial/>
        </Container>
        </ThemeProvider>


      </div>

    </AuthProvider>
  );
}