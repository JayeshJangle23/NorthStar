import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { shopApi } from "../services/shopApi";
import { getErrorMessage } from "../services/api";

export default function Profile() {
  const { user, syncUser } = useAuth();
  const [form, setForm] = useState({ userName: user?.userName || user?.name || "", email: user?.email || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => setForm({ userName: user?.userName || user?.name || "", email: user?.email || "" }), [user]);
  async function submit(e) {
    e.preventDefault(); setMessage(""); setError(""); setLoading(true);
    try { await shopApi.updateProfile({ userName: form.userName }); await syncUser(); setMessage("Profile updated."); }
    catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  }
  return <section className="container page-section narrow-page"><div className="page-intro"><span className="eyebrow">YOUR DETAILS</span><h1>Your <em>profile.</em></h1></div><form className="profile-card" onSubmit={submit}>{message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-error">{error}</div>}<label>Your name<input required value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })}/></label><label>Email address<input type="email" value={form.email} disabled/><small className="field-hint">Email editing is disabled in this starter.</small></label><div className="profile-meta"><span>Account role</span><strong>{user?.role || "customer"}</strong></div><button className="button button-dark" disabled={loading}>{loading ? "Saving…" : "Save changes ↗"}</button></form></section>;
}
