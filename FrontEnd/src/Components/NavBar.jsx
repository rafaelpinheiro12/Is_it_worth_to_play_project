import { NavLink } from "react-router"
import "../App.css"

function NavBar() {
  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/aboutus">About Us</NavLink>
      <NavLink to="/user">Login</NavLink>
    </div>
  )
}

export default NavBar
