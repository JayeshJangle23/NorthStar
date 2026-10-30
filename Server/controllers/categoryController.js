const mongoose = require("mongoose");
const Category = require("../model/categorySchema.js");
const Product = require("../model/productSchema.js");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("getCategories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    console.error("getCategoryDetail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      _id: id,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({
      category: id,
      status: "active",
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("getCategoryProducts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const createCategories = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }
    const cleanName = name.trim();

    const slug = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const category = await Category.create({
      name: name,
      description: description.trim(),
      slug,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("createCategories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "Invalid category name" });
      }

      const cleanName = name.trim();
      const slug = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      if (!slug) {
        return res.status(400).json({
          message: "Category name must contain letters or numbers",
        });
      }

      updates.name = cleanName;
      updates.slug = slug;
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({ message: "Invalid description" });
      }

      updates.description = description.trim();
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ message: "isActive must be a boolean" });
      }

      // Don't deactivate a category while it still has active products.
      if (isActive === false) {
        const hasActiveProducts = await Product.exists({
          category: id,
          status: "active",
        });

        if (hasActiveProducts) {
          return res.status(409).json({
            message: "Deactivate or reassign its products first",
          });
        }
      }

      updates.isActive = isActive;
    }

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("updateCategory:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category name or slug already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const hasProducts = await Product.exists({ category: id });

    if (hasProducts) {
      return res.status(409).json({
        message:
          "This category has products. Reassign or remove those products first.",
      });
    }

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("deleteCategory:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCategories,
  getCategoryDetail,
  getCategoryProducts,
  createCategories,
  updateCategory,
  deleteCategory,
};
