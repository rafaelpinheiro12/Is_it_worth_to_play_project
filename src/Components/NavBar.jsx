import { NavLink } from "react-router"
import "../App.css"
import GameSearchTool from "./GameSearchTool.jsx"

function NavBar() {
  return (
    <div className="navbar">
      <button>
      <NavLink to="/">Home</NavLink>
      </button>
      <GameSearchTool/>
      <button>
      <NavLink to="/aboutus">About Us</NavLink>
      </button>
     {/*<NavLink to="/user">User</NavLink> */}
    </div>
  )
}

export default NavBar
