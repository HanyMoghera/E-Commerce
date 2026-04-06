import { Product } from "../../database/models/product.model.js";
import { Category } from "../../database/models/categories.model.js";
import { Subcategory } from "../../database/models/subcategory.model.js";
import { uploadCloudinary } from "../../utils/uploadClodinary.util.js";
import cloudinary from "cloudinary";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, subcategory } = req.body;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const existingSubcategory = await Subcategory.findById(subcategory);
    if (!existingSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (existingSubcategory.categoryId.toString() !== category) {
      return res.status(400).json({
        message: "Subcategory does not belong to this category",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadCloudinary(file.path, "products")),
    );

    const images = uploadedImages.map((img) => ({
      url: img.url,
      public_id: img.public_id,
    }));

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      images,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.name) {
      product.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body.price !== undefined) {
      product.price = req.body.price;
    }

    if (req.body.stock !== undefined) {
      product.stock = req.body.stock;
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
      product.category = req.body.category;
    }

    if (req.body.subcategory) {
      const subcategoryExists = await Subcategory.findById(
        req.body.subcategory,
      );
      if (!subcategoryExists) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      if (
        req.body.category &&
        subcategoryExists.categoryId.toString() !== req.body.category
      ) {
        return res.status(400).json({
          message: "Subcategory does not belong to this category",
        });
      }

      product.subcategory = req.body.subcategory;
    }

    if (req.files) {
      console.log("Uploading new images...");

      // delete old images safely
      if (product.images?.length > 0) {
        await Promise.all(
          product.images.map((img) => {
            if (img?.public_id) {
              return cloudinary.uploader.destroy(img.public_id);
            }
          }),
        );
      }

      // upload new images
      const uploadedImages = await Promise.all(
        req.files.map((file) => uploadCloudinary(file.path, "products")),
      );

      product.images = uploadedImages.map((img) => ({
        url: img.url,
        public_id: img.public_id,
      }));
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();

    await product.save();

    res.json({ message: "Product soft deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stock = stock;

    await product.save();

    res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, minPrice, maxPrice, sort } = req.query;

    page = Number(page);
    limit = Number(limit);

    let filter = { isDeleted: false };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOption[field] = order === "asc" ? 1 : -1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter by Category
export const getByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isDeleted: false,
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filter by Subcategory
export const getBySubcategory = async (req, res) => {
  try {
    const products = await Product.find({
      subcategory: req.params.subcategoryId,
      isDeleted: false,
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
