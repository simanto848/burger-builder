import { Navbar, Nav, NavItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { signOutSuccess } from "../redux/user/userSlice";
import { handleLogout } from "../services/authService";
import "./Header.css";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    const result = await handleLogout();
    if (result.success) {
      dispatch(signOutSuccess());
      navigate("/");
    } else {
      console.error("Failed to logout");
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
            <Link to="/profile" className="NavLink">
              Profile
            </Link>
          </NavItem>
        )}
        {currentUser && currentUser.role === "admin" && (
          <NavItem>
            <Link to="/admin-orders" className="NavLink">
              Orders
            </Link>
            <Link to="/add-burger" className="NavLink">
              Add Burger
            </Link>
            <Link
              to="/coupons"
              className="NavLink"
              style={{
                marginRight: "10px",
              }}
            >
              Coupons
            </Link>
            <button className="LogoutButton" onClick={logout}>
              Logout
            </button>
          </NavItem>
        )}
        {currentUser && currentUser.role !== "admin" && (
          <NavItem>
            <Link
              to="/orders"
              className="NavLink"
              style={{
                marginRight: "10px",
              }}
            >
              Orders
            </Link>
            <button className="LogoutButton" onClick={logout}>
              Logout
            </button>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
}
