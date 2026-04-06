import { Subcategory } from "../../database/models/subcategory.model.js";
import { Category } from "../../database/models/categories.model.js";
import { uploadCloudinary } from "../../utils/uploadClodinary.util.js";
import cloudinary from "cloudinary";

export const createSubcategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const category = await Category.findById(categoryId);
    if (!category || category.isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingSubcategory = await Subcategory.findOne({ name, categoryId });
    if (existingSubcategory) {
      return res.status(400).json({
        message: "Subcategory already exists for this category",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const { url, public_id } = await uploadCloudinary(
      req.file.path,
      "subcategories",
    );

    const subcategory = await Subcategory.create({
      name,
      image: url,
      imagePublicId: public_id,
      categoryId,
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Create subcategory error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Subcategory name must be unique" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findById(id);
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (req.body.name) {
      const newSubcategoryName = req.body.name.trim();

      const existingSubcategory = await Subcategory.findOne({
        name: newSubcategoryName,
        _id: { $ne: id },
      });

      if (existingSubcategory) {
        return res
          .status(400)
          .json({ message: "Subcategory name already exists" });
      }

      subcategory.name = newSubcategoryName;
    }

    if (req.body.categoryId) {
      const newCategoryId = req.body.categoryId;
      const category = await Category.findById(newCategoryId);
      if (!category || category.isDeleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      subcategory.categoryId = newCategoryId;
    }

    if (req.file) {
      if (subcategory.imagePublicId) {
        await cloudinary.uploader.destroy(subcategory.imagePublicId);
      }

      const { url, public_id } = await uploadCloudinary(
        req.file.path,
        "subcategories",
      );

      subcategory.image = url;
      subcategory.imagePublicId = public_id;
    }

    await subcategory.save();

    res.status(200).json({
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (error) {
    console.error("Update subcategory error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Subcategory name must be unique" });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findById(id);
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.isDeleted = true;
    await subcategory.save();

    res.status(200).json({
      message: "Subcategory deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Delete subcategory error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);
    if (!subcategory || subcategory.isDeleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.status(200).json({
      message: "Subcategory found",
      subcategory,
    });
  } catch (error) {
    console.error("Get subcategory by ID error:", error);
    res.status(500).json({ message: error.message });
  }
};
