import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { shopApi } from "../services/shopApi";
import ProductCard from "../components/ProductCard";
import StateMessage from "../components/StateMessage";
import { getErrorMessage } from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    shopApi
      .products({ limit: 4, page: 1 })
      .then((result) => setProducts(result.items.slice(0, 4)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" /> THE EVERYDAY EDIT
            </span>
            <h1>
              Good things.
              <br />
              <em>Better living.</em>
            </h1>
            <p>
              Considered essentials, made to bring a little more joy to your
              everyday.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" to="/products">
                Explore the collection <span>↗</span>
              </Link>
              <span className="hero-note">
                Thoughtfully picked. Made to last.
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>
            <div className="art-sun"></div>
            <div className="art-card art-card-one">
              <span>THE DAILY</span>
              <strong>Rituals</strong>
              <small>01 / 04</small>
            </div>
            <div className="art-card art-card-two">
              <span>LESS, BUT</span>
              <strong>Lovely.</strong>
              <small>OBJECTS FOR LIFE</small>
            </div>
            <div className="art-star">✳</div>
          </div>
        </div>
      </section>
      <section className="container trust-strip">
        <div>
          <span>✳</span>
          <strong>Curated with care</strong>
          <small>Everyday things, elevated</small>
        </div>
        <div>
          <span>↗</span>
          <strong>Simple shopping</strong>
          <small>Easy from start to finish</small>
        </div>
        <div>
          <span>◇</span>
          <strong>Made for real life</strong>
          <small>Useful, beautiful essentials</small>
        </div>
      </section>
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A FEW FAVORITES</span>
            <h2>
              Little things, <em>big joy.</em>
            </h2>
          </div>
          <Link className="text-link" to="/products">
            View all products ↗
          </Link>
        </div>
        {loading ? (
          <div className="loading-row">Finding your favorites…</div>
        ) : error ? (
          <StateMessage title="Products couldn't load">{error}</StateMessage>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        ) : (
          <StateMessage title="Your collection is waiting">
            Add products in your backend to see them here.
          </StateMessage>
        )}
      </section>
      <section className="feature-banner">
        <div className="container feature-inner">
          <div>
            <span className="eyebrow">THE NORTHSTAR WAY</span>
            <h2>
              Less noise.
              <br />
              <em>More meaning.</em>
            </h2>
          </div>
          <p>
            We believe the best everyday things are the ones you reach for again
            and again. Find your next favorite.
          </p>
          <Link className="button button-dark" to="/products">
            Find your favorite ↗
          </Link>
        </div>
      </section>
    </div>
  );
}
