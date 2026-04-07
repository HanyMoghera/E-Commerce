import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["offer", "announcement"],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  discountCode: { type: String },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model("Message", messageSchema);
