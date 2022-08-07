import { Outlet, NavLink } from "react-router-dom";
import './App.css';
import { AuthProvider } from './context/authContext';



export default function App() {
  return (
    <AuthProvider>
      <div>
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

      </div>
    </AuthProvider>
  );
}