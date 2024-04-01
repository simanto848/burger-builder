import { Navbar, NavItem } from "reactstrap";
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
    <Navbar
      className="Navigation"
      style={{ backgroundColor: "#d6770f", height: "70px" }}
    >
      <Link to="/home" className="mr-auto ml-md-5 Brand">
        <img src={Logo} alt="Logo" width="100px" />
        Home
      </Link>
      <div className="NavLinks">
        {currentUser && (
          <NavItem>
            <Link to="/orders">Orders</Link>
          </NavItem>
        )}
        {currentUser && currentUser.role === "admin" && (
          <NavItem>
            <Link to="/add-burger">Add Burger</Link>
            <Link to="/orders">Orders</Link>
          </NavItem>
        )}
        {currentUser && (
          <NavItem>
            <button className="LogoutButton" onClick={handleLogout}>
              Logout
            </button>
          </NavItem>
        )}
      </div>
    </Navbar>
  );
}
