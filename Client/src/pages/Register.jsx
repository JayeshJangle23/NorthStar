import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ userName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const { authenticate, loading } = useAuth();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError("");
    if (form.password.length < 6) return setError("Use a password with at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    try {
      const { confirmPassword, ...data } = form;
      await authenticate("register", data);
      navigate("/");
    } catch (err) { setError(getErrorMessage(err)); }
  }
  return <section className="auth-page"><div className="auth-art"><span className="eyebrow">A LITTLE MORE EVERYDAY</span><h2>Find your<br/><em>kind of good.</em></h2><p>Join us for thoughtfully picked essentials and everyday inspiration.</p><div className="auth-art-mark">✳</div></div><div className="auth-panel"><form className="auth-form" onSubmit={submit}><span className="eyebrow">LET'S GET STARTED</span><h1>Create account.</h1><p className="muted">A few details and you're in.</p>{error && <div className="alert alert-error">{error}</div>}
    <label>Your name<input required autoComplete="name" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} placeholder="What should we call you?"/></label>
    <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"/></label>
    <label>Password<input type="password" minLength="6" required autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters"/></label>
    <label>Confirm password<input type="password" required autoComplete="new-password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Enter it once more"/></label>
    <button className="button button-dark button-full" disabled={loading}>{loading ? "Creating account…" : "Create account ↗"}</button><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></form></div></section>;
}
