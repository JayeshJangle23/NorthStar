// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { shopApi } from "../services/shopApi";
// import { getErrorMessage } from "../services/api";
// import { money } from "../utils/format";

// export default function Checkout() {
//   const { items, subtotal, clear } = useCart();
//   const [form, setForm] = useState({
//     fullName: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     paymentMethod: "COD",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   async function submit(e) {
//     e.preventDefault();
//     setError("");
//     if (!items.length) return setError("Your bag is empty.");
//     setLoading(true);
//     try {
//       const payload = {
//         items: items.map(({ product, quantity }) => ({
//           product: product._id || product.id,
//           quantity,
//         })),
//         shippingAddress: {
//           fullName: form.fullName,
//           phone: form.phone,
//           address: form.address,
//           city: form.city,
//           state: form.state,
//           postalCode: form.postalCode,
//           country: "India",
//         },
//         paymentMethod: form.paymentMethod,
//       };
//       await shopApi.createOrder(payload);
//       clear();
//       navigate("/orders", {
//         replace: true,
//         state: { message: "Your order was submitted successfully." },
//       });
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }
//   if (!items.length)
//     return (
//       <section className="container page-section">
//         <div className="page-intro">
//           <h1>Checkout.</h1>
//         </div>
//         <p>
//           Your bag is empty. <Link to="/products">Browse products</Link>.
//         </p>
//       </section>
//     );
//   const field = (name, label, props = {}) => (
//     <label>
//       {label}
//       <input
//         required
//         value={form[name]}
//         onChange={(e) => setForm({ ...form, [name]: e.target.value })}
//         {...props}
//       />
//     </label>
//   );
//   return (
//     <section className="container page-section">
//       <div className="page-intro">
//         <span className="eyebrow">ALMOST YOURS</span>
//         <h1>
//           Check <em>out.</em>
//         </h1>
//         <p>Enter delivery details to place your order.</p>
//       </div>
//       <div className="checkout-layout">
//         <form className="checkout-form" onSubmit={submit}>
//           <h2>Delivery details</h2>
//           {error && <div className="alert alert-error">{error}</div>}
//           <div className="form-grid">
//             {field("fullName", "Full name", { autoComplete: "name" })}
//             {field("phone", "Phone number", {
//               type: "tel",
//               autoComplete: "tel",
//             })}
//             <label className="span-two">
//               Street address
//               <input
//                 required
//                 value={form.address}
//                 onChange={(e) => setForm({ ...form, address: e.target.value })}
//                 autoComplete="street-address"
//               />
//             </label>
//             {field("city", "City", { autoComplete: "address-level2" })}
//             {field("state", "State", { autoComplete: "address-level1" })}
//             {field("postalCode", "Postal code", {
//               autoComplete: "postal-code",
//             })}
//             <label>
//               Payment method
//               <select
//                 value={form.paymentMethod}
//                 onChange={(e) =>
//                   setForm({ ...form, paymentMethod: e.target.value })
//                 }
//               >
//                 <option value="COD">Cash on delivery</option>
//                 <option value="ONLINE">
//                   Online payment (requires backend integration)
//                 </option>
//               </select>
//             </label>
//           </div>
//           <button
//             className="button button-dark button-full checkout-submit"
//             disabled={loading}
//           >
//             {loading ? "Placing order…" : "Place order ↗"}
//           </button>
//           <p className="muted tiny">
//             Your backend must recalculate the total and verify current stock
//             before creating an order.
//           </p>
//         </form>
//         <aside className="order-summary">
//           <span className="eyebrow">YOUR BAG</span>
//           <h2>Order summary</h2>
//           {items.map(({ product, quantity }) => (
//             <div className="summary-row" key={product._id || product.id}>
//               <span>
//                 {product.name} × {quantity}
//               </span>
//               <strong>{money(Number(product.price) * quantity)}</strong>
//             </div>
//           ))}
//           <div className="summary-total">
//             <span>Estimated total</span>
//             <strong>{money(subtotal)}</strong>
//           </div>
//           <p className="muted tiny">
//             Taxes and shipping are determined by your backend if applicable.
//           </p>
//         </aside>
//       </div>
//     </section>
//   );
// }



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { shopApi } from "../services/shopApi";
import { getErrorMessage } from "../services/api";
import { money } from "../utils/format";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "COD",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!items.length) {
      return setError("Your bag is empty.");
    }

    // Backend currently supports COD only.
    if (form.paymentMethod !== "COD") {
      return setError("Only Cash on Delivery is currently supported.");
    }

    setLoading(true);

    try {
      const payload = {
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          addressLine: form.addressLine.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
        paymentMethod: form.paymentMethod,
      };

      const response = await shopApi.createOrder(payload);

      await clear();

      navigate("/orders", {
        replace: true,
        state: {
          message: "Your order was placed successfully.",
          orderId: response?.order?._id,
        },
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <section className="container page-section">
        <div className="page-intro">
          <h1>Checkout.</h1>
        </div>

        <p>
          Your bag is empty. <Link to="/products">Browse products</Link>.
        </p>
      </section>
    );
  }

  const field = (name, label, props = {}) => (
    <label>
      {label}
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        required
        {...props}
      />
    </label>
  );

  return (
    <section className="container page-section">
      <div className="page-intro">
        <span className="eyebrow">ALMOST YOURS</span>

        <h1>
          Check <em>out.</em>
        </h1>

        <p>Enter your complete delivery details to place your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h2>Delivery details</h2>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="form-grid">
            {field("fullName", "Full name", {
              autoComplete: "name",
              placeholder: "Enter your full name",
            })}

            {field("phone", "Phone number", {
              type: "tel",
              autoComplete: "tel",
              placeholder: "9876543210",
              pattern: "[0-9]{10}",
              title: "Enter a valid 10-digit Indian mobile number",
              maxLength: 10,
            })}

            <label className="span-two">
              Complete street address
              <textarea
                name="addressLine"
                value={form.addressLine}
                onChange={handleChange}
                required
                rows={3}
                autoComplete="street-address"
                placeholder="House number, street, area, landmark"
              />
            </label>

            {field("city", "City", {
              autoComplete: "address-level2",
              placeholder: "Indore",
            })}

            {field("state", "State", {
              autoComplete: "address-level1",
              placeholder: "Madhya Pradesh",
            })}

            {field("postalCode", "Postal code", {
              autoComplete: "postal-code",
              placeholder: "452010",
              pattern: "[0-9]{6}",
              maxLength: 6,
              title: "Enter a valid 6-digit PIN code",
            })}

            {field("country", "Country", {
              autoComplete: "country-name",
            })}

            <label className="span-two">
              Payment method
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
              >
                <option value="COD">Cash on delivery</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="button button-dark button-full checkout-submit"
            disabled={loading}
          >
            {loading ? "Placing order..." : "Place order ↗"}
          </button>

          <p className="muted tiny">
            Your order total and stock availability are verified by
            our backend before checkout.
          </p>
        </form>

        <aside className="order-summary">
          <span className="eyebrow">YOUR BAG</span>

          <h2>Order summary</h2>

          {items.map(({ product, quantity }) => (
            <div
              className="summary-row"
              key={product._id || product.id}
            >
              <span>
                {product.name} × {quantity}
              </span>

              <strong>
                {money(Number(product.price) * quantity)}
              </strong>
            </div>
          ))}

          <div className="summary-total">
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>

          <div className="summary-total">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>{money(subtotal)}</strong>
          </div>

          <p className="muted tiny">
            Payment method: Cash on delivery.
          </p>
        </aside>
      </div>
    </section>
  );
}
