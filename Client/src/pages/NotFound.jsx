import { Link } from "react-router-dom";
export default function NotFound() {
  return <section className="container page-section"><div className="state-message"><div className="state-symbol">404</div><h2>Looks like a wrong turn.</h2><p>This page isn't part of the collection.</p><Link className="button button-dark" to="/">Back to home ↗</Link></div></section>;
}
