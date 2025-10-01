import { NavLink } from "react-router"

function NavBar() {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/aboutus">About Us</NavLink>
      <NavLink to="/login">Login</NavLink>
    </div>
  )
}

export default NavBar
