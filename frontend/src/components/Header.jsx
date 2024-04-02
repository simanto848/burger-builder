import { Navbar, Nav, NavItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { signOutSuccess } from "../redux/user/userSlice";
import "./Header.css";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      localStorage.clear();

      const res = await fetch(`/api/auth/logout`, {
        method: "GET",
      });
      if (res.ok) {
        dispatch(signOutSuccess());
        navigate("/");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Navbar expand="md" className="Navigation">
      <Link to="/home" className="Brand">
        <img src={Logo} alt="Logo" className="Logo" />
        Home
      </Link>
      <Nav className="NavLinks">
        {currentUser && (
          <NavItem>
            <Link to="/orders" className="NavLink">
              Orders
            </Link>
            <Link to="/profile" className="NavLink">
              Profile
            </Link>
          </NavItem>
        )}
        {currentUser && currentUser.role === "admin" && (
          <NavItem>
            <Link to="/add-burger" className="NavLink">
              Add Burger
            </Link>
          </NavItem>
        )}
        {currentUser && (
          <NavItem>
            <button className="LogoutButton" onClick={handleLogout}>
              Logout
            </button>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
}
