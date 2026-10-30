
const mongoose = require("mongoose");
const Cart = require("../model/cartSchema.js");
const Product = require("../model/productSchema.js");
const Order = require("../model/orderSchema.js");

const getUserId = (req) => req.user?.userId;

const validId = (id) => mongoose.isValidObjectId(id);

const allowedStatuses = [
  "confirmed",
  "shipped",
  "delivered",
];

// // POST /api/orders
// const createOrder = async (req, res) => {
//   const reservedItems = [];
//   console.log("✅ createOrder controller started");

//   try {
//     const userId = getUserId(req);
//     const { shippingAddress, paymentMethod = "COD" } = req.body || {};

//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (!shippingAddress) {
//       return res.status(400).json({
//         message: "Shipping address is required",
//       });
//     }

//     const requiredFields = [
//       "fullName",
//       "phone",
//       "addressLine",
//       "city",
//       "state",
//       "postalCode",
//       "country",
//     ];

//     for (const field of requiredFields) {
//       if (
//         typeof shippingAddress[field] !== "string" ||
//         !shippingAddress[field].trim()
//       ) {
//         return res.status(400).json({
//           message: `${field} is required`,
//         });
//       }
//     }

//     if (paymentMethod !== "COD") {
//       return res.status(400).json({
//         message: "Currently only cash on delivery is supported",
//       });
//     }

//     const cart = await Cart.findOne({ user: userId })
    
//     // const cart = await Cart.findOne({ user: userId });

// console.log("Raw cart from MongoDB:");
// console.dir(cart?.toObject(), { depth: null });

// if (!cart) {
//   return res.status(404).json({ message: "Cart not found" });
// }

// const populatedCart = await Cart.findById(cart._id)
//   .populate("items.product");

// console.log("Populated cart:");
// console.dir(populatedCart?.toObject(), { depth: null });

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         message: "Your cart is empty",
//       });
//     }

//     // Validate all products before changing inventory.
//     for (const item of cart.items) {
//   const product = item.product;

//   console.log("\n========== ORDER DEBUG ==========");
//   console.log("Product reference:", item.product);
//   console.log("Product populated:", Boolean(product));
//   console.log("Product ID:", product?._id);
//   console.log("Product name:", product?.name);
//   console.log("Product status:", product?.status);
//   console.log("Product stock:", product?.stock);
//   console.log("Cart quantity:", item.quantity);
//   console.log("=================================\n");

//   if (!product || product.status !== "active") {
//     return res.status(400).json({
//       message: "A product in your cart is unavailable",
//       debug: {
//         productId: product?._id ?? item.product,
//         productName: product?.name ?? null,
//         productStatus: product?.status ?? null,
//         productMissing: !product,
//       },
//     });
//   }
// }

//     const orderItems = [];
//     let subtotal = 0;

//     // Reserve stock with a conditional update.
//     // This helps prevent overselling when requests overlap.
//     // for (const item of cart.items) {
//     //   const product = item.product;
//     //   const quantity = item.quantity;

//     //   const result = await Product.updateOne(
//     //     {
//     //       _id: product._id,
//     //       status: "active",
//     //       stock: { $gte: quantity },
//     //     },
//     //     {
//     //       $inc: { stock: -quantity },
//     //     }
//     //   );

//     //   if (result.modifiedCount !== 1) {
//     //     // Restore any stock reserved earlier in this request.
//     //     for (const reserved of reservedItems) {
//     //       await Product.updateOne(
//     //         { _id: reserved.productId },
//     //         { $inc: { stock: reserved.quantity } }
//     //       );
//     //     }

//     //     reservedItems.length = 0;

//     //     return res.status(409).json({
//     //       message: `Stock changed or is insufficient for ${product.name}. Please refresh your cart.`,
//     //     });
//     //   }

//     //   reservedItems.push({
//     //     productId: product._id,
//     //     quantity,
//     //   });

//     //   const itemSubtotal = product.price * quantity;
//     //   subtotal += itemSubtotal;

//     //   orderItems.push({
//     //     product: product._id,
//     //     name: product.name,
//     //     price: product.price,
//     //     quantity,
//     //     image: product.image || "",
//     //   });
//     // }

//     for (const item of cart.items) {
//   const product = item.product;

//   console.log("Cart item:", {
//     product: product?._id ?? item.product,
//     name: product?.name,
//     status: product?.status,
//     stock: product?.stock,
//     quantity: item.quantity,
//     productMissing: !product,
//   });

//   if (!product || product.status !== "active") {
//     return res.status(400).json({
//       message: "A product in your cart is unavailable",
//       productId: product?._id ?? item.product,
//       productName: product?.name ?? null,
//       status: product?.status ?? null,
//       reason: !product
//         ? "Product no longer exists"
//         : "Product is not active",
//     });
//   }
// }

//     const shippingFee = 0;

//     const order = await Order.create({
//       user: userId,
//       items: orderItems,
//       shippingAddress,
//       subtotal,
//       shippingFee,
//       totalAmount: subtotal + shippingFee,
//       paymentMethod: "COD",
//       paymentStatus: "pending",
//       status: "placed",
//     });

//     // Empty the cart only after the order is saved.
//     cart.items = [];
//     await cart.save();

//     return res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     // Roll back stock reservations if order creation fails.
//     for (const reserved of reservedItems) {
//       try {
//         await Product.updateOne(
//           { _id: reserved.productId },
//           { $inc: { stock: reserved.quantity } }
//         );
//       } catch (rollbackError) {
//         console.error("Stock rollback failed:", rollbackError);
//       }
//     }

//     console.error("createOrder:", error);

//     return res.status(500).json({
//       message: "Unable to place order",
//     });
//   }
// };

const createOrder = async (req, res) => {
  const userId = req.user?.userId;
  const reservedProducts = [];

  try {
    // console.log("Creating order for user:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in again.",
      });
    }

    const { shippingAddress, paymentMethod } = req.body;

    const requiredFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    if (
      !shippingAddress ||
      requiredFields.some(
        (field) =>
          typeof shippingAddress[field] !== "string" ||
          !shippingAddress[field].trim()
      )
    ) {
      return res.status(400).json({
        message: "Please provide a complete shipping address.",
      });
    }

    // 2. Currently, only Cash on Delivery is supported
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is supported.",
      });
    }

    // 3. Fetch the cart WITH populated products.
    // IMPORTANT: Use this same `cart` variable below.
    // const cart = await Cart.findOne({ user: userId }).populate({
    //   path: "items.product",
    //   model: Product,
    // });

    // console.log("Logged in user ID:", userId);

    const cart = await Cart.findOne({ user: userId });

if (!cart || cart.items.length === 0) {
  return res.status(400).json({
    message: "Your cart is empty.",
  });
}

const orderItems = [];

for (const item of cart.items) {
  const product = await Product.findById(item.product);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      productId: item.product.toString(),
    });
  }

  if (product.status !== "active") {
    return res.status(400).json({
      message: `${product.name} is unavailable`,
    });
  }

  if (item.quantity > product.stock) {
    return res.status(400).json({
      message: `Insufficient stock for ${product.name}`,
    });
  }

  orderItems.push({
    product: product._id,
    name: product.name,
    price: product.price,
    quantity: item.quantity,
    image: product.image || "",
  });
}
// const cart = await Cart.findOne({
//   user: userId,
// });

// console.log("Cart from database:");
// console.dir(cart?.toObject(), { depth: null });

//     if (!cart) {
//       return res.status(404).json({
//         message: "Cart not found.",
//       });
//     }

//     if (!cart.items || cart.items.length === 0) {
//       return res.status(400).json({
//         message: "Your cart is empty.",
//       });
//     }

//     console.log("Populated cart items:", cart.items.length);

//     // 4. Validate products and quantities before reserving stock
//     const orderItems = [];

//     for (const item of cart.items) {
//       const product = item.product;

//       console.log("Checking product:", {
//         productId: product?._id ?? item.product,
//         productName: product?.name,
//         status: product?.status,
//         stock: product?.stock,
//         quantity: item.quantity,
//         isPopulated: Boolean(product?._id && product?.name),
//       });

//       // A missing product or unpopulated ObjectId is invalid.
//       if (
//         !product ||
//         !product._id ||
//         typeof product.name !== "string"
//       ) {
//         return res.status(400).json({
//           message: "A product in your cart no longer exists.",
//           productId: String(item.product?._id ?? item.product),
//           action: "Remove this item from your cart and try again.",
//         });
//       }

//       if (product.status !== "active") {
//         return res.status(400).json({
//           message: `${product.name} is currently unavailable.`,
//           productId: String(product._id),
//         });
//       }

//       const quantity = item.quantity;

//       if (
//         !Number.isInteger(quantity) ||
//         quantity < 1
//       ) {
//         return res.status(400).json({
//           message: `Invalid quantity for ${product.name}.`,
//         });
//       }

//       if (
//         !Number.isFinite(product.stock) ||
//         product.stock < quantity
//       ) {
//         return res.status(400).json({
//           message: `Insufficient stock for ${product.name}.`,
//           availableStock: product.stock,
//           requestedQuantity: quantity,
//         });
//       }

//       if (
//         !Number.isFinite(product.price) ||
//         product.price < 0
//       ) {
//         return res.status(400).json({
//           message: `Invalid price for ${product.name}.`,
//         });
//       }

//       // Save a snapshot of the product details in the order.
//       orderItems.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         quantity,
//         image: product.image || "",
//       });
//     }

    // 5. Calculate totals from database prices, not client input.
    const subtotal = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Replace this with your existing shipping-fee business rule if needed.
    const shippingFee = 0;
    const totalAmount = subtotal + shippingFee;

    // 6. Reserve stock using a conditional update.
    // This helps prevent orders from overselling the available stock.
    for (const item of orderItems) {
      const result = await Product.updateOne(
        {
          _id: item.product,
          status: "active",
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        }
      );

      if (result.modifiedCount !== 1) {
        // Restore stock already reserved for earlier items.
        for (const reserved of reservedProducts) {
          await Product.updateOne(
            { _id: reserved.product },
            { $inc: { stock: reserved.quantity } }
          );
        }

        reservedProducts.length = 0;

        return res.status(400).json({
          message:
            "Product stock changed while processing your order. Please refresh your cart and try again.",
          productId: String(item.product),
        });
      }

      reservedProducts.push({
        product: item.product,
        quantity: item.quantity,
      });
    }

    // 7. Create the order.
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine: shippingAddress.addressLine.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country.trim(),
      },
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "pending",
      status: "placed",
    });

    // 8. Clear the cart only after order creation succeeds.
    cart.items = [];
    await cart.save();

    // 9. Return the created order.
    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    // Restore reserved stock if order processing fails.
    for (const reserved of reservedProducts) {
      try {
        await Product.updateOne(
          { _id: reserved.product },
          { $inc: { stock: reserved.quantity } }
        );
      } catch (rollbackError) {
        console.error(
          "Stock rollback failed:",
          reserved.product,
          rollbackError
        );
      }
    }

    return res.status(500).json({
      message: "Failed to create order.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getMyOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
//     console.log("Decoded JWT:", req.user);
// console.log("User ID:", req.user?.userId);
// console.log("User role:", req.user?.role);
    const userId = getUserId(req);
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === userId;
    const isAdmin = req.user?.role === "admin";

    // console.log("Order User ID:", order.user.toString());
    // console.log("Logged User ID:", userId.toString());
    // console.log("User Role:", req.user.role);
    // console.log("Is Owner:", isOwner);
    // console.log("Is Admin:", isAdmin);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You cannot access this order",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("getOrderById:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Only an owner's placed or confirmed order can be cancelled.
    const order = await Order.findOneAndUpdate(
      {
        _id: id,
        user: userId,
        status: { $in: ["placed", "confirmed"] },
      },
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found or can no longer be cancelled",
      });
    }

    // Restore stock after successfully changing the order status.
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("cancelOrder:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "userName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("getAllOrders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// PATCH /api/orders/admin/:id/status
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body || {};

//     if (!validId(id)) {
//       return res.status(400).json({ message: "Invalid order ID" });
//     }

//     if (!allowedStatuses.includes(status)) {
//       return res.status(400).json({
//         message: "Status must be confirmed, shipped, or delivered",
//       });
//     }

//     // Only permit forward transitions; cancelled orders cannot be revived.
//     const allowedPreviousStatuses = {
//       confirmed: ["placed"],
//       shipped: ["confirmed"],
//       delivered: ["shipped"],
//     };

//     const order = await Order.findOneAndUpdate(
//       {
//         _id: id,
//         status: { $in: allowedPreviousStatuses[status] },
//       },
//       { $set: { status } },
//       { new: true, runValidators: true }
//     );

//     if (!order) {
//       return res.status(409).json({
//         message: "Order not found or invalid status transition",
//       });
//     }

//     if (status === "delivered" && order.paymentMethod === "COD") {
//       order.paymentStatus = "paid";
//       await order.save();
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Order status updated",
//       order,
//     });
//   } catch (error) {
//     console.error("updateOrderStatus:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "placed",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be ${allowedStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};
