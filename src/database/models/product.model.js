import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    autoDeletedAt: { type: Date },
  },
  { timestamps: true },
);

// Middleware for auto soft-delete
productSchema.pre("save", function (next) {
  if (this.stock === 0 && !this.isDeleted) {
    this.isDeleted = true;
    this.autoDeletedAt = new Date();
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
