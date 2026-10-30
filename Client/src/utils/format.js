export const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 2
}).format(Number(value) || 0);

export const idOf = (item) => String(item?._id ?? item?.id ?? "");
export const imageOf = (product) => {
  const first = Array.isArray(product?.images) ? product.images[0] : null;
  if (typeof first === "string") return first;
  return first?.url || product?.image || product?.imageUrl || "";
};
export const categoryName = (product) =>
  typeof product?.category === "object" ? product.category?.name : product?.category;
