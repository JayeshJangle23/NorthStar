import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { shopApi } from "../services/shopApi";
import { getErrorMessage } from "../services/api";
import { money } from "../utils/format";
import StateMessage from "../components/StateMessage";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  useEffect(() => { shopApi.myOrders().then(setOrders).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false)); }, []);
  return <section className="container page-section"><div className="page-intro"><span className="eyebrow">YOUR NORTHSTAR</span><h1>Your <em>orders.</em></h1><p>Every order, all in one place.</p></div>{location.state?.message && <div className="alert alert-success">{location.state.message}</div>}{loading ? <div className="loading-row">Loading your orders…</div> : error ? <StateMessage title="Orders couldn't load">{error}</StateMessage> : orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id || order.id}><div className="order-card-head"><div><span className="eyebrow">ORDER</span><strong>#{String(order._id || order.id).slice(-8).toUpperCase()}</strong></div><span className={`status-pill status-${String(order.orderStatus || order.status || "pending").toLowerCase().replace(/\s/g, "-")}`}>{order.orderStatus || order.status || "Pending"}</span></div><div className="order-card-foot"><span>{new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><strong>{money(order.totalAmount ?? order.total ?? order.totalPrice)}</strong></div><div className="order-product-list">{(order.items || []).map((item, i) => <span key={item._id || item.product?._id || i}>{item.name || item.product?.name || "Product"} × {item.quantity}</span>)}</div></article>)}</div> : <StateMessage title="Your story starts here">Your orders will show up here once you've found something you love.<Link className="text-link" to="/products">Start exploring ↗</Link></StateMessage>}</section>;
}
