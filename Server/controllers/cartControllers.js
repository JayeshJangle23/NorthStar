const mongoose = require("mongoose");
const Cart = require("../model/cartSchema.js");
const Product = require("../model/productSchema.js");

// Change this if your auth middleware uses another property.
const getUserId = (req) => req.user?.userId;

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Ignore products that have been deleted from the database.
    const items = cart.items
      .filter((item) => item.product)
      .map((item) => {
        const product = item.product;
        const quantity = item.quantity;

        return {
          product: product,
          quantity,
          subtotal: product.price * quantity,
        };
      });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items,
        total,
      },
    });
  } catch (error) {
    console.error("getCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/cart/items
const addToCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity = 1 } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({
        message: "Active product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Requested quantity exceeds available stock",
        });
      }

      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("addToCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/cart/items/:productId
const updateCartItem = async (req, res) => {
  try {
    
    const userId = getUserId(req);
    const { productId } = req.params;
    // console.log("Route params:", req.params);


// console.log("Product ID:", productId);
    const { quantity } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // console.log("Product ID:", req.params.productId);
    // console.log("ID type:", typeof req.params.productId);
    // console.log(
    //   "Valid ObjectId:",
    //   mongoose.isValidObjectId(req.params.productId),
    // );
    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a positive whole number",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({
        message: "Active product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Requested quantity exceeds available stock",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (entry) => entry.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product is not in your cart",
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    console.error("updateCartItem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/cart/items/:productId
const removeCartItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        message: "Product is not in your cart",
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("removeCartItem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true },
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("clearCart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
