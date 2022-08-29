import { Outlet, NavLink } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/authContext';
import { UserIdProvider } from './context/authContext';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GlobalStyle from "./grobalStyles";
import Typography from '@mui/material/Typography';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f8b6b',
      light: '#60e4b3',
      dark: '#008056'
     }
  },
  components: {
    MuiButton: {
      styleOverrides: {
          root: {
              color: '#fff',
              fontSize: '16px',
              borderRadius: '25px',
          },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
            borderRadius: '20px',
            paddingLeft: '0.8rem',
            paddingRight: '0.8rem',
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
            padding: '0',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
            fontFamily: [
              'Poppins'
            ]
        },
        h1: {
          fontSize: '2.2rem',
          paddingTop: '1rem',
          paddingBottom: '2rem',
          fontWeight: '600',
        },
        h2: {
          fontSize: '2rem',
          paddingTop: '1rem',
          paddingBottom: '2rem',
          fontWeight: '600',
        },
        h3: {
          fontSize: '1.8rem',
          paddingTop: '1rem',
          paddingBottom: '2rem',
          fontWeight: '600',
        }
      },
    },
    
  },
  typography: {
    fontFamily: [
      'Noto Sans',
      'Helvetica Neue',
      'Helvetica',
      'Hiragino Sans',
      'Hiragino Kaku Gothic ProN',
      'Arial',
      'Yu Gothic',
      'Meiryo',
    ].join()
  }
})

export default function App() {
  return (
    <AuthProvider>
      <div className="bg">
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyle />
      <Container maxWidth="sm">


        <Typography variant="h1">Imaginous</Typography>

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
      </Container>
      </ThemeProvider>


      </div>

    </AuthProvider>
  );
}