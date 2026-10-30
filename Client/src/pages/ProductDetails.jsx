import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { shopApi } from "../services/shopApi";
import { getErrorMessage } from "../services/api";
import { categoryName, imageOf, money } from "../utils/format";
import { useCart } from "../context/CartContext";
import StateMessage from "../components/StateMessage";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  useEffect(() => { shopApi.product(id).then(setProduct).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="container page-section"><div className="loading-row">Loading product…</div></div>;
  if (error || !product) return <div className="container page-section"><StateMessage title="Product unavailable">{error || "This product could not be found."}<Link className="text-link" to="/products">Back to shop ↗</Link></StateMessage></div>;
  const image = imageOf(product);
  const stock = Number(product.stock ?? 99);
  return <section className="container page-section">
    <div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/products">Shop</Link><span>/</span><span>{product.name}</span></div>
    <div className="detail-grid"><div className="detail-image">{image ? <img src={image} alt={product.name}/> : <div className="image-placeholder">N.</div>}</div>
      <div className="detail-copy"><span className="eyebrow">{categoryName(product) || "THE EVERYDAY EDIT"}</span><h1>{product.name}</h1><div className="detail-price">{money(product.price)}</div><p className="detail-description">{product.description || "A considered essential for your everyday routine. Simple, useful, and ready to become a favorite."}</p>
        <div className={`stock-line ${stock > 0 ? "in-stock" : "out-stock"}`}><span className="stock-dot"/> {stock > 0 ? `${stock} available` : "Currently sold out"}</div>
        <div className="purchase-row"><div className="quantity-control"><button disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)} aria-label="Decrease quantity">−</button><span>{quantity}</span><button disabled={quantity >= stock} onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button></div><button className="button button-dark add-to-cart" disabled={stock < 1} onClick={() => { add(product, quantity); setAdded(true); }}>Add to bag — {money(Number(product.price) * quantity)}</button></div>
        {added && <p className="success-note">Added to your bag. <Link to="/cart">View bag ↗</Link></p>}
        <div className="detail-perks"><div><span>↗</span><div><strong>Simple checkout</strong><small>Clear order summary</small></div></div><div><span>◇</span><div><strong>Made for everyday</strong><small>Thoughtful essentials</small></div></div></div>
      </div></div>
  </section>;
}
