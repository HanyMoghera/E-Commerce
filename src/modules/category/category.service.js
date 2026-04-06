import { Category } from "../../database/models/categories.model.js";
import { Subcategory } from "../../database/models/subcategory.model.js";
import { uploadCloudinary } from "../../utils/uploadClodinary.util.js";
import cloudinary from "cloudinary";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { url, public_id } = await uploadCloudinary(
      req.file.path,
      "categories",
    );

    const category = await Category.create({
      name,
      image: url,
      imagePublicId: public_id,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name) {
      const newCategoryName = req.body.name.trim();

      const existingCategory = await Category.findOne({
        name: newCategoryName,
        _id: { $ne: id },
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Category name already exists" });
      }

      category.name = newCategoryName;
    }

    if (req.file) {
      // delete old image from Cloudinary if exists
      if (category.imagePublicId) {
        await cloudinary.uploader.destroy(category.imagePublicId);
      }

      const { url, public_id } = await uploadCloudinary(
        req.file.path,
        "categories",
      );

      category.image = url;
      category.imagePublicId = public_id;
    }

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).json({
      message: "Category deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).lean();
    if (categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    if (req.user?.role === "admin") {
      const categoriesWithSub = await Promise.all(
        categories.map(async (category) => {
          const subcategories = await Subcategory.find({
            categoryId: category._id,
            isDeleted: false,
          }).lean();

          return { ...category, subcategories };
        }),
      );

      return res.status(200).json({
        results: categoriesWithSub.length,
        categories: categoriesWithSub,
      });
    }

    res.status(200).json({
      results: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subcategories = await Subcategory.find({
      categoryId: id,
      isDeleted: false,
    }).lean();

    if (subcategories.length === 0) {
      return res.status(404).json({ message: "No subcategories found" });
    }

    res.status(200).json({
      results: subcategories.length,
      subcategories,
    });
  } catch (error) {
    console.error("Get subcategories by category error:", error);
    res.status(500).json({ message: error.message });
  }
};
