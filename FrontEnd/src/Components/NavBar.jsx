import { NavLink } from "react-router"
import "../App.css"
import GameSearchTool from "./GameSearchTool.jsx"

function NavBar() {
  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <GameSearchTool/>
      <NavLink to="/aboutus">About Us</NavLink>
      <NavLink to="/user">User</NavLink>
    </div>
  )
}

export default NavBar
  