import { Link } from "react-router-dom";
import { imageOf, money } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const id = product?._id ?? product?.id;
  const image = imageOf(product);
  return (
    <article className="product-card">
      <Link to={`/products/${id}`} className="product-image-wrap">
        {image ? (
          <img src={image} alt={product.name || "Product"} loading="lazy" />
        ) : (
          <div className="image-placeholder">N.</div>
        )}
        {Number(product.stock) === 0 && (
          <span className="image-badge">Sold out</span>
        )}
      </Link>
      <div className="product-card-info">
        <div>
          <Link className="product-name" to={`/products/${id}`}>
            {product.name || "Untitled product"}
          </Link>
          <p className="product-category">
            {typeof product.category === "object"
              ? product.category?.name
              : product.category || "Everyday essential"}
          </p>
        </div>
        <div className="product-card-bottom">
          <strong>{money(product.price)}</strong>
          <button
            className="add-mini"
            disabled={Number(product.stock) === 0}
            onClick={() => add(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
