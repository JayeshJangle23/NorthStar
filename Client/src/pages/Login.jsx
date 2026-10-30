import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { authenticate, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(e) {
    e.preventDefault(); setError("");
    try { await authenticate("login", form); navigate(location.state?.from || "/", { replace: true }); }
    catch (err) { setError(getErrorMessage(err)); }
  }
  return <section className="auth-page"><div className="auth-art"><span className="eyebrow">WELCOME BACK</span><h2>Your everyday<br/><em>starts here.</em></h2><p>Good to see you again. Your next favorite is waiting.</p><div className="auth-art-mark">N.</div></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><span className="eyebrow">YOUR ACCOUNT</span><h1>Log in.</h1><p className="muted">Pick up right where you left off.</p>{error && <div className="alert alert-error">{error}</div>}
    <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"/></label>
    <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password"/></label>
    <button className="button button-dark button-full" disabled={loading}>{loading ? "Logging in…" : "Log in ↗"}</button><p className="auth-switch">New around here? <Link to="/register">Create an account</Link></p></form></div></section>;
}
