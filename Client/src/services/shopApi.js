import api from "./api";

const unwrap = (response) => response?.data?.data ?? response?.data;
const listFrom = (payload, key) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const shopApi = {
  async products(params = {}) {
    const response = await api.get("/products", { params });
    const payload = unwrap(response);
    return { items: listFrom(payload, "products"), payload };
  },
  async product(id) {
    const response = await api.get(`/products/${id}`);
    const payload = unwrap(response);
    return payload?.product ?? payload;
  },
  async categories() {
    const response = await api.get("/categories");
    return listFrom(unwrap(response), "categories");
  },
  async register(data) {
    return unwrap(await api.post("/auth/register", data));
  },
  async login(data) {
    return unwrap(await api.post("/auth/login", data));
  },
  async me() {
    return unwrap(await api.get("/auth/me"));
  },
  async logout() {
    return unwrap(await api.post("/auth/logout"));
  },
  async createOrder(data) {
    return unwrap(await api.post("/orders", data));
  },
  async myOrders() {
    return listFrom(unwrap(await api.get("/orders/my-orders")), "orders");
  },
  async updateProfile(data) {
    return unwrap(await api.patch("/users/me", data));
  },
  async adminCreateProduct(data) {
    return unwrap(await api.post("/products", data));
  },
  async adminUpdateProduct(id, data) {
    return unwrap(await api.patch(`/products/${id}`, data));
  },
  async adminDeleteProduct(id) {
    return unwrap(await api.delete(`/products/${id}`));
  },
  async adminOrders() {
    return listFrom(unwrap(await api.get("/orders/admin/all")), "orders");
  },
  async adminUpdateOrderStatus(id, status) {
    return unwrap(await api.patch(`/orders/admin/${id}/status`, { status }));
  },

  getCart: async () => {
    const response = await api.get("/cart");
    return response.data;
  },

  addToCart: async (payload) => {
    const response = await api.post("/cart/items", payload);
    return response.data;
  },

  updateCartItem: async (productId, payload) => {
    const response = await api.patch(`/cart/items/${productId}`, payload);
    return response.data;
  },

  removeCartItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete("/cart");
    return response.data;
  },

  createOrder: async (payload) => {
    const response = await api.post("/orders", payload);
    return response.data;
  },
  // adminCreateProduct: (payload) => api.post("/products", payload),

  // adminUpdateProduct: (id, payload) => api.patch(`/products/${id}`, payload),
};
