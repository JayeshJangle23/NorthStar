// import { createContext, useContext, useEffect, useMemo, useState } from "react";

// const CartContext = createContext(null);
// const readCart = () => {
//   try { return JSON.parse(localStorage.getItem("shop_cart") || "[]"); }
//   catch { return []; }
// };
// const productId = (p) => String(p?._id ?? p?.id ?? "");

// export function CartProvider({ children }) {
//   const [items, setItems] = useState(readCart);
//   useEffect(() => { localStorage.setItem("shop_cart", JSON.stringify(items)); }, [items]);

//   const add = (product, quantity = 1) => setItems((old) => {
//     const id = productId(product);
//     const existing = old.find((item) => productId(item.product) === id);
//     if (existing) return old.map((item) => productId(item.product) === id
//       ? { ...item, quantity: Math.min(Number(item.quantity) + Number(quantity), Number(product.stock ?? 99)) } : item);
//     return [...old, { product, quantity: Math.max(1, Number(quantity) || 1) }];
//   });
//   const setQuantity = (id, quantity) => {
//     const amount = Number(quantity);
//     if (!Number.isFinite(amount) || amount < 1) return;
//     setItems((old) => old.map((item) => productId(item.product) === String(id)
//       ? { ...item, quantity: Math.min(amount, Number(item.product.stock ?? 99)) } : item));
//   };
//   const remove = (id) => setItems((old) => old.filter((item) => productId(item.product) !== String(id)));
//   const clear = () => setItems([]);
//   const count = items.reduce((sum, item) => sum + Number(item.quantity), 0);
//   const subtotal = items.reduce((sum, item) => sum + Number(item.product.price || 0) * Number(item.quantity), 0);
//   const value = useMemo(() => ({ items, add, setQuantity, remove, clear, count, subtotal }), [items, count, subtotal]);
//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }
// export function useCart() {
//   const value = useContext(CartContext);
//   if (!value) throw new Error("useCart must be used within CartProvider");
//   return value;
// }



import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { shopApi } from "../services/shopApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch cart from MongoDB
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await shopApi.getCart();

      setItems(response.cart?.items || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch cart"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load cart when application starts
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to backend cart
  const add = async (product, quantity = 1) => {
    try {
      const id = product?._id || product?.id;

      if (!id) throw new Error("Invalid product");

      await shopApi.addToCart({
        productId: id,
        quantity: Number(quantity),
      });

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to add product"
      );
      throw err;
    }
  };

  // Update quantity in backend
  const setQuantity = async (id, quantity) => {
    try {
      const amount = Number(quantity);

      if (!Number.isInteger(amount) || amount < 1) return;

      await shopApi.updateCartItem(id, {
        quantity: amount,
      });

      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update quantity"
      );
      throw err;
    }
  };

  // Remove product
  const remove = async (id) => {
    try {
      await shopApi.removeCartItem(id);
      await fetchCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to remove product"
      );
      throw err;
    }
  };

  // Clear backend cart
  const clear = async () => {
    try {
      await shopApi.clearCart();
      setItems([]);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to clear cart"
      );
      throw err;
    }
  };

  const count = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) *
      Number(item.quantity),
    0
  );

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      add,
      setQuantity,
      remove,
      clear,
      fetchCart,
      count,
      subtotal,
    }),
    [items, loading, error, count, subtotal, fetchCart]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return value;
}
