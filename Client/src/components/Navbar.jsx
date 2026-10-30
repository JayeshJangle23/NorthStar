import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const admin = user?.role === "admin";
  async function handleLogout() { await logout(); navigate("/"); }
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="Northstar home"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/products">Shop all</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
          {admin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          {user ? <>
          <Link className="nav-icon-link" to="/cart" aria-label={`Cart, ${count} items`}>Bag <span className="cart-count">{count}</span></Link>
            <Link className="nav-user" to="/profile">{user.userName || user.name || "Account"}</Link>
            <button className="button button-quiet button-small" onClick={handleLogout}>Log out</button>
          </> : <><Link className="nav-login" to="/login">Log in</Link><Link className="button button-dark button-small" to="/register">Join us</Link></>}
        </div>
      </div>
    </header>
  );
}
