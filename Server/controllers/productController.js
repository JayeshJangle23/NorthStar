const mongoose = require("mongoose");
const Product = require("../model/productSchema.js");
const Category = require("../model/categorySchema.js");
const cloudinary = require("../config/cloudinary.js");

// const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ status: "active" });
//     return res.status(200).json({ products });
//   } catch (error) {
//     console.error("getProducts:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    // console.log("ACTIVE PRODUCTS:", products.length);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    console.error("getProducts:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProductDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      status: "active",
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("getProductDetail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    // console.log("CREATE PRODUCT API HIT");

    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);
    const { name, description, price, stock, category, image } = req.body;

    if (
      !name || !description || price === undefined || stock === undefined || !category
    ){
      return res.status(400).json({
        message: "Provide valid name, description, price, stock and category",
      });
    }

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(400).json({
        message: "Category does not exist or is inactive",
      });
    }
//     console.log("Cloudinary loaded:", !!cloudinary);
// console.log("Cloudinary uploader:", !!cloudinary.uploader);
// console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);


    let finalImageUrl = "";
    let imagePublicId = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "mern_products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit" },
              { quality: "auto", fetch_format: "auto" }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      finalImageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    else if (image) {
      const parsedUrl = new URL(imageUrl);

      if (parsedUrl.protocol !== "https:") {
        return res.status(400).json({
          message: "Only HTTPS image URLs are allowed"
        });
      }

      finalImageUrl = imageUrl;
    }

    else {
      return res.status(400).json({
        message: "Please upload an image or provide an image URL"
      });
    }

    

    const product = await Product.create({
      name: name,
      description: description,
      price,
      stock,
      category,
      image:finalImageUrl,
      imagePublicId
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("createProduct:", error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, price, stock, category, image } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Invalid product name" });
      }
      updates.name = name.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ message: "Invalid description" });
      }
      updates.description = description.trim();
    }

    if (price !== undefined) {
      if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
        return res.status(400).json({ message: "Invalid price" });
      }
      updates.price = price;
    }

    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ message: "Invalid stock" });
      }
      updates.stock = stock;
    }

    if (category !== undefined) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const categoryExists = await Category.findOne({
        _id: category,
        isActive: true,
      });

      if (!categoryExists) {
        return res.status(400).json({
          message: "Category does not exist or is inactive",
        });
      }

      updates.category = category;
    }

    if (image !== undefined) {
      if (typeof image !== "string") {
        return res.status(400).json({ message: "Invalid image URL" });
      }
      updates.image = image;
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;


    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("deleteProduct:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status must be active or inactive",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product status updated successfully",
      product,
    });
  } catch (error) {
    console.error("updateProductStatus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
