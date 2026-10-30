// import { useEffect, useState } from "react";
// import { shopApi } from "../../services/shopApi";
// import { getErrorMessage } from "../../services/api";
// import { money } from "../../utils/format";

// const empty = {
//   name: "",
//   description: "",
//   price: "",
//   stock: "",
//   image: "",
//   category: "",
// };
// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState(empty);
//   const [editing, setEditing] = useState("");
//   const [error, setError] = useState("");
//   const [notice, setNotice] = useState("");
//   const [loading, setLoading] = useState(true);
//   async function load() {
//     setLoading(true);
//     try {
//       const [result, cats] = await Promise.all([
//         shopApi.products({ limit: 100, page: 1 }),
//         shopApi.categories(),
//       ]);
//       setProducts(result.items);
//       setCategories(cats);
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setLoading(false);
//     }
//   }
//   useEffect(() => {
//     load();
//   }, []);
//   function startEdit(p) {
//     setEditing(p._id || p.id);
//     setForm({
//       name: p.name || "",
//       description: p.description || "",
//       price: p.price ?? "",
//       stock: p.stock ?? "",
//       image: Array.isArray(p.images)
//         ? typeof p.images[0] === "string"
//           ? p.images[0]
//           : p.images[0]?.url || ""
//         : p.image || p.imageUrl || "",
//       category:
//         typeof p.category === "object"
//           ? p.category?._id || ""
//           : p.category || "",
//     });
//     setNotice("");
//     setError("");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }
//   function reset() {
//     setEditing("");
//     setForm(empty);
//   }
//   async function submit(e) {
//     e.preventDefault();
//     setError("");
//     setNotice("");
//     const payload = {
//       name: form.name.trim(),
//       description: form.description.trim(),
//       price: Number(form.price),
//       stock: Number(form.stock),
//       category: form.category || undefined,
//       images: form.image.trim() ? [form.image.trim()] : [],
//     };
//     try {
//       if (editing) await shopApi.adminUpdateProduct(editing, payload);
//       else await shopApi.adminCreateProduct(payload);
//       setNotice(editing ? "Product updated." : "Product created.");
//       reset();
//       await load();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }
//   async function remove(id) {
//     if (!window.confirm("Delete this product?")) return;
//     setError("");
//     setNotice("");
//     try {
//       await shopApi.adminDeleteProduct(id);
//       setNotice("Product deleted.");
//       await load();
//     } catch (err) {
//       setError(getErrorMessage(err));
//     }
//   }
//   return (
//     <section className="container page-section">
//       <div className="page-intro">
//         <span className="eyebrow">ADMIN / CATALOGUE</span>
//         <h1>
//           Manage <em>products.</em>
//         </h1>
//         <p>Keep your collection fresh and accurate.</p>
//       </div>
//       {error && <div className="alert alert-error">{error}</div>}
//       {notice && <div className="alert alert-success">{notice}</div>}
//       <form className="admin-form" onSubmit={submit}>
//         <h2>{editing ? "Edit product" : "Add a product"}</h2>
//         <div className="form-grid">
//           <label>
//             Product name
//             <input
//               required
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />
//           </label>
//           <label>
//             Price (₹)
//             <input
//               required
//               min="0"
//               type="number"
//               step="0.01"
//               value={form.price}
//               onChange={(e) => setForm({ ...form, price: e.target.value })}
//             />
//           </label>
//           <label>
//             Stock
//             <input
//               required
//               min="0"
//               type="number"
//               value={form.stock}
//               onChange={(e) => setForm({ ...form, stock: e.target.value })}
//             />
//           </label>
//           <label>
//             Category
//             <select
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//             >
//               <option value="">Choose category (optional)</option>
//               {categories.map((c) => (
//                 <option key={c._id || c.id || c.name} value={c._id || c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </label>
//           <label className="span-two">
//             Image URL
//             <input
//               type="url"
//               value={form.image}
//               onChange={(e) => setForm({ ...form, image: e.target.value })}
//               placeholder="https://…"
//             />
//           </label>
//           <label className="span-two">
//             Description
//             <textarea
//               rows="3"
//               value={form.description}
//               onChange={(e) =>
//                 setForm({ ...form, description: e.target.value })
//               }
//             />
//           </label>
//         </div>
//         <div className="form-actions">
//           <button className="button button-dark">
//             {editing ? "Save changes ↗" : "Create product ↗"}
//           </button>
//           {editing && (
//             <button
//               type="button"
//               className="button button-outline"
//               onClick={reset}
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>
//       <div className="admin-table-wrap">
//         <div className="table-heading">
//           <h2>Products</h2>
//           <span>{products.length} items</span>
//         </div>
//         {loading ? (
//           <p className="muted">Loading products…</p>
//         ) : (
//           <table className="admin-table">
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Price</th>
//                 <th>Stock</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p) => (
//                 <tr key={p._id || p.id}>
//                   <td>
//                     <strong>{p.name}</strong>
//                     <small>
//                       {p.category?.name ||
//                         (typeof p.category === "string"
//                           ? p.category
//                           : "Uncategorised")}
//                     </small>
//                   </td>
//                   <td>{money(p.price)}</td>
//                   <td>{p.stock ?? "—"}</td>
//                   <td>
//                     <div className="table-actions">
//                       <button
//                         className="button button-outline button-small"
//                         onClick={() => startEdit(p)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="button button-danger button-small"
//                         onClick={() => remove(p._id || p.id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </section>
//   );
// }



import { useEffect, useState } from "react";
import { shopApi } from "../../services/shopApi";
import { getErrorMessage } from "../../services/api";
import { money } from "../../utils/format";

const empty = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  category: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);

  const [editing, setEditing] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image states
  const [imageMode, setImageMode] = useState("upload");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageChanged, setImageChanged] = useState(false);

  // Clean up temporary image preview
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function load() {
    setLoading(true);

    try {
      const [result, cats] = await Promise.all([
        shopApi.products({ limit: 100, page: 1 }),
        shopApi.categories(),
      ]);

      setProducts(result.items || []);
      setCategories(cats || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Handle file selection
  function handleFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP and AVIF images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError("Image size must be below 1 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setImageChanged(true);
  }

  // Handle image URL
  function handleImageUrl(e) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      image: value,
    }));

    setPreview(value);
    setImageFile(null);
    setImageChanged(true);
  }

  // Switch image source
  function changeImageMode(mode) {
    setImageMode(mode);
    setImageFile(null);
    setPreview("");
    setForm((prev) => ({
      ...prev,
      image: "",
    }));
    setImageChanged(true);
    setError("");
  }

  // Start editing
  function startEdit(p) {
    const currentImage = Array.isArray(p.images)
      ? typeof p.images[0] === "string"
        ? p.images[0]
        : p.images[0]?.url || ""
      : p.image || p.imageUrl || "";

    setEditing(p._id || p.id);

    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price ?? "",
      stock: p.stock ?? "",
      image: currentImage,
      category:
        typeof p.category === "object"
          ? p.category?._id || ""
          : p.category || "",
    });

    // Preserve the existing image until the user changes it.
    setImageMode("url");
    setImageFile(null);
    setPreview(currentImage);
    setImageChanged(false);

    setNotice("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Reset form
  function reset() {
    setEditing("");
    setForm(empty);
    setImageMode("upload");
    setImageFile(null);
    setPreview("");
    setImageChanged(false);
    setError("");
  }

  // Submit product
  async function submit(e) {
    e.preventDefault();

    setError("");
    setNotice("");

    if (!editing || imageChanged) {
      if (imageMode === "upload" && !imageFile) {
        setError("Please select an image.");
        return;
      }

      if (imageMode === "url" && !form.image.trim()) {
        setError("Please enter an image URL.");
        return;
      }
    }

    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    try {
      setSaving(true);

      const payload = new FormData();

      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("stock", form.stock);
      payload.append("category", form.category);

      // Only send image if creating or changing the existing image.
      if (!editing || imageChanged) {
        if (imageMode === "upload") {
          payload.append("image", imageFile);
        } else {
          payload.append("image", form.image.trim());
        }
      }

      if (editing) {
        await shopApi.adminUpdateProduct(editing, payload);
        sessionStorage.removeItem("shop_products_cache");
        setNotice("Product updated successfully.");
      } else {
        await shopApi.adminCreateProduct(payload);
        sessionStorage.removeItem("shop_products_cache");
        setNotice("Product created successfully.");
      }
      

      reset();
      await load();

    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  // Delete product
  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;

    setError("");
    setNotice("");

    try {
      await shopApi.adminDeleteProduct(id);

      setNotice("Product deleted successfully.");
      await load();

    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="container page-section">

      <div className="page-intro">
        <span className="eyebrow">ADMIN / CATALOGUE</span>

        <h1>
          Manage <em>products.</em>
        </h1>

        <p>Keep your collection fresh and accurate.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {notice && (
        <div className="alert alert-success">
          {notice}
        </div>
      )}

      <form className="admin-form" onSubmit={submit}>

        <h2>{editing ? "Edit product" : "Add a product"}</h2>

        <div className="form-grid">

          {/* Product name */}
          <label>
            Product name

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </label>

          {/* Price */}
          <label>
            Price (₹)

            <input
              required
              min="0"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </label>

          {/* Stock */}
          <label>
            Stock

            <input
              required
              min="0"
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />
          </label>

          {/* Category */}
          <label>
            Category

            <select
              required
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Choose category</option>

              {categories.map((c) => (
                <option
                  key={c._id || c.id || c.name}
                  value={c._id || c.id}
                >
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Image selection */}
          <div className="span-two">

            <label>
              Product Image
            </label>

            <div className="image-options">

              <button
                type="button"
                className={`button ${
                  imageMode === "upload"
                    ? "button-dark"
                    : "button-outline"
                }`}
                onClick={() => changeImageMode("upload")}
              >
                Upload Image
              </button>

              <button
                type="button"
                className={`button ${
                  imageMode === "url"
                    ? "button-dark"
                    : "button-outline"
                }`}
                onClick={() => changeImageMode("url")}
              >
                Image URL
              </button>

            </div>

            {/* File upload */}
            {imageMode === "upload" && (
              <div className="image-upload-box">

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                />

                <small className="muted">
                  JPG, PNG, WebP or AVIF. Maximum size 1 MB.
                </small>

              </div>
            )}

            {/* URL input */}
            {imageMode === "url" && (
              <input
                type="url"
                value={form.image}
                onChange={handleImageUrl}
                placeholder="https://example.com/image.jpg"
              />
            )}

            {/* Image preview */}
            {preview && (
              <div className="image-preview">

                <p>Image Preview</p>

                <img
                  src={preview}
                  alt="Product preview"
                  width="180"
                  height="180"
                  style={{
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  onLoad={(e) => {
                    e.currentTarget.style.display = "block";
                  }}
                />

              </div>
            )}

          </div>

          {/* Description */}
          <label className="span-two">
            Description

            <textarea
              required
              rows="3"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </label>

        </div>

        {/* Form buttons */}
        <div className="form-actions">

          <button
            type="submit"
            className="button button-dark"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editing
                ? "Save changes ↗"
                : "Create product ↗"}
          </button>

          {editing && (
            <button
              type="button"
              className="button button-outline"
              onClick={reset}
              disabled={saving}
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* Product table */}
      <div className="admin-table-wrap">

        <div className="table-heading">
          <h2>Products</h2>
          <span>{products.length} items</span>
        </div>

        {loading ? (
          <p className="muted">Loading products…</p>
        ) : (
          <table className="admin-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {products.map((p) => (
                <tr key={p._id || p.id}>

                  <td>
                    <strong>{p.name}</strong>

                    <small>
                      {p.category?.name ||
                        (typeof p.category === "string"
                          ? p.category
                          : "Uncategorised")}
                    </small>
                  </td>

                  <td>{money(p.price)}</td>

                  <td>{p.stock ?? "—"}</td>

                  <td>
                    <div className="table-actions">

                      <button
                        type="button"
                        className="button button-outline button-small"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="button button-danger button-small"
                        onClick={() => remove(p._id || p.id)}
                      >
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        )}

      </div>

    </section>
  );
}
