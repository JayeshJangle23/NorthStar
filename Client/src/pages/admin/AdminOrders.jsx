import { useEffect, useState } from "react";
import { shopApi } from "../../services/shopApi";
import { getErrorMessage } from "../../services/api";
import { money } from "../../utils/format";

// const statuses = [
//   "pending",
//   "confirmed",
//   "processing",
//   "shipped",
//   "delivered",
//   "cancelled",
// ];
const statuses = [
  "placed",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true);
    try {
      setOrders(await shopApi.adminOrders());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function changeStatus(id, status) {
    setError("");
    setNotice("");
    try {
      await shopApi.adminUpdateOrderStatus(id, status);
      setNotice("Order status updated.");
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }
  return (
    <section className="container page-section">
      <div className="page-intro">
        <span className="eyebrow">ADMIN / FULFILMENT</span>
        <h1>
          Manage <em>orders.</em>
        </h1>
        <p>Review orders and keep customers informed.</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {notice && <div className="alert alert-success">{notice}</div>}
      {loading ? (
        <div className="loading-row">Loading orders…</div>
      ) : orders.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id || o.id}>
                  <td>
                    <strong>
                      #
                      {String(o._id || o.id)
                        .slice(-8)
                        .toUpperCase()}
                    </strong>
                    <small>
                      {new Date(o.createdAt || Date.now()).toLocaleDateString(
                        "en-IN",
                      )}
                    </small>
                  </td>
                  <td>
                    {o.user?.userName ||
                      o.user?.name ||
                      o.user?.email ||
                      "Customer"}
                  </td>
                  <td>{money(o.totalAmount ?? o.total ?? o.totalPrice)}</td>
                  <td>
                    <select
                      className="status-select"
                      value={o.status || "placed"}
                      onChange={(e) =>
                        changeStatus(o._id || o.id, e.target.value)
                      }
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-admin">
          <h2>No orders yet</h2>
          <p>New customer orders will appear here.</p>
        </div>
      )}
    </section>
  );
}
