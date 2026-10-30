import { Link } from "react-router-dom";
export default function Footer() {
  return <footer className="site-footer"><div className="container footer-inner"><div><Link className="brand footer-brand" to="/"><span className="brand-mark">N</span><span>northstar<span className="brand-dot">.</span></span></Link><p>Thoughtful essentials for everyday living.</p></div><div className="footer-links"><Link to="/products">Shop</Link><Link to="/profile">Account</Link><Link to="/orders">Orders</Link></div><small>© {new Date().getFullYear()} Northstar. Built for your capstone.</small></div></footer>;
}
