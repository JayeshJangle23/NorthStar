// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import StateMessage from "../components/StateMessage";
// import { shopApi } from "../services/shopApi";
// import { getErrorMessage } from "../services/api";

// export default function Products() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const search = searchParams.get("search") || "";
//   const category = searchParams.get("category") || "";
//   const sort = searchParams.get("sort") || "newest";
//   useEffect(() => {
//     shopApi
//       .categories()
//       .then(setCategories)
//       .catch(() => {});
//   }, []);
//   useEffect(() => {
//     let active = true;
//     setLoading(true);
//     setError("");
//     shopApi
//       .products({ search, category, sort, page: 1, limit: 24 })
//       .then((result) => {
//         if (active) setProducts(result.items);
//       })
//       .catch((err) => {
//         if (active) setError(getErrorMessage(err));
//       })
//       .finally(() => {
//         if (active) setLoading(false);
//       });
//     return () => {
//       active = false;
//     };
//   }, [search, category, sort]);
//   const update = (key, value) => {
//     const next = new URLSearchParams(searchParams);
//     if (value) next.set(key, value);
//     else next.delete(key);
//     setSearchParams(next);
//   };
//   return (
//     <section className="container page-section">
//       <div className="page-intro">
//         <span className="eyebrow">THE COLLECTION</span>
//         <h1>
//           Shop <em>all.</em>
//         </h1>
//         <p>Useful things, beautiful details, everyday favorites.</p>
//       </div>
//       <div className="shop-toolbar">
//         <label className="search-box">
//           <span>⌕</span>
//           <input
//             value={search}
//             onChange={(e) => update("search", e.target.value)}
//             placeholder="Search the collection…"
//             aria-label="Search products"
//           />
//         </label>
//         <div className="filters">
//           <select
//             value={category}
//             onChange={(e) => update("category", e.target.value)}
//             aria-label="Filter by category"
//           >
//             <option value="">All categories</option>
//             {categories.map((c) => (
//               <option key={c._id || c.id || c.name} value={c._id || c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//           <select
//             value={sort}
//             onChange={(e) => update("sort", e.target.value)}
//             aria-label="Sort products"
//           >
//             <option value="newest">Newest first</option>
//             <option value="price-asc">Price: low to high</option>
//             <option value="price-desc">Price: high to low</option>
//             <option value="name-asc">Name: A–Z</option>
//           </select>
//         </div>
//       </div>
//       {loading ? (
//         <div className="loading-row">Loading the collection…</div>
//       ) : error ? (
//         <StateMessage title="We couldn't load the collection">
//           {error}
//           <br />
//           Check your API URL and product endpoint.
//         </StateMessage>
//       ) : products.length ? (
//         <>
//           <div className="results-label">
//             {products.length} {products.length === 1 ? "piece" : "pieces"} to
//             explore
//           </div>
//           <div className="product-grid">
//             {products.map((p) => (
//               <ProductCard key={p._id || p.id} product={p} />
//             ))}
//           </div>
//         </>
//       ) : (
//         <StateMessage title="Nothing found just yet">
//           Try another search or choose a different category.
//         </StateMessage>
//       )}
//     </section>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import StateMessage from "../components/StateMessage";
import { shopApi } from "../services/shopApi";
import { getErrorMessage } from "../services/api";

const PRODUCTS_CACHE_KEY = "shop_products_cache";
const CATEGORIES_CACHE_KEY = "shop_categories_cache";

const readCache = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch {
    return null;
  }
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState(
    () => readCache(PRODUCTS_CACHE_KEY) || [],
  );

  const [categories, setCategories] = useState(
    () => readCache(CATEGORIES_CACHE_KEY) || [],
  );

  const [loading, setLoading] = useState(
    () => readCache(PRODUCTS_CACHE_KEY) === null,
  );

  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  
  // Fetch products only if cache is not available.
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const cachedProducts = readCache(PRODUCTS_CACHE_KEY);

      if (cachedProducts !== null) {
        setAllProducts(cachedProducts);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const result = await shopApi.products({
          page: 1,
          limit: 1000,
        });

        if (!active) return;

        const data = result.items || [];

        setAllProducts(data);
        sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        if (active) setError(getErrorMessage(err));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

//   useEffect(() => {
//   let active = true;

//   async function loadProducts() {
//     try {
//       setLoading(true);
//       setError("");

//       const result = await shopApi.products({
//         page: 1,
//         limit: 1000,
//       });

//       if (!active) return;

//       const data = result.items || result.products || [];

//       setAllProducts(data);

//       sessionStorage.setItem(
//         PRODUCTS_CACHE_KEY,
//         JSON.stringify(data)
//       );

//     } catch (err) {
//       if (active) {
//         setError(getErrorMessage(err));
//       }
//     } finally {
//       if (active) setLoading(false);
//     }
//   }

//   loadProducts();

//   return () => {
//     active = false;
//   };
// }, []);

  // Fetch categories only if cache is not available.
  useEffect(() => {
    let active = true;

    async function loadCategories() {
      const cachedCategories = readCache(CATEGORIES_CACHE_KEY);

      if (cachedCategories !== null) {
        setCategories(cachedCategories);
        return;
      }

      try {
        const data = await shopApi.categories();

        if (!active) return;

        setCategories(data);

        sessionStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error("Category loading failed:", err);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => {
    let result = [...allProducts];

    if (category) {
      result = result.filter((product) => {
        const categoryId = product.category?._id || product.category;

        return String(categoryId) === String(category);
      });
    }

    if (search.trim()) {
      const term = search.toLowerCase();

      result = result.filter((product) =>
        `${product.name} ${product.description}`.toLowerCase().includes(term),
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [allProducts, category, search, sort]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordPerPage = 8;
  const lastRecordIdx = recordPerPage * currentPage;
  const firstRecordIdx = lastRecordIdx - recordPerPage;

  const currentRecord = products.slice(firstRecordIdx, lastRecordIdx);

  const totalPage = Math.ceil(products.length / recordPerPage);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  

  return (
    <section className="container page-section">
      <div className="page-intro">
        <span className="eyebrow">THE COLLECTION</span>

        <h1>
          Shop <em>all.</em>
        </h1>

        <p>Useful things, beautiful details, everyday favorites.</p>
      </div>

      <div className="shop-toolbar">
        <label className="search-box">
          <span>⌕</span>

          <input
            value={search}
            onChange={(e) => update("search", e.target.value)}
            placeholder="Search the collection…"
            aria-label="Search products"
          />
        </label>

        <div className="filters">
          <select
            value={category}
            onChange={(e) => update("category", e.target.value)}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>

            {categories.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
            aria-label="Sort products"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name-asc">Name: A–Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-row">Loading the collection…</div>
      ) : error ? (
        <StateMessage title="We couldn't load the collection">
          {error}
        </StateMessage>
      ) : products.length ? (
        <>
          <div className="results-label">
            {products.length} {products.length === 1 ? "piece" : "pieces"} to
            explore
          </div>

          <div className="product-grid">
  {currentRecord.map((p) => (
    <ProductCard key={p._id || p.id} product={p} />
  ))}
</div>

{totalPage > 1 && (
  <div className="pagination-div">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
    >
      Previous
    </button>

    {Array.from({ length: totalPage }, (_, i) => (
      <button
        key={i}
        className={currentPage === i + 1 ? "active" : ""}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPage}
      onClick={() => setCurrentPage((prev) => prev + 1)}
    >
      Next
    </button>

  </div>
)}

        </>
      ) : (
        <StateMessage title="Nothing found just yet">
          Try another search or choose a different category.
        </StateMessage>
      )}
    </section>
  );
}
