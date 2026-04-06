import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff", // reference to Staff collection
      required: true,
    },
    month: {
      type: String, // e.g., "2024-03"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, // record creation date
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

const Salary = mongoose.model("Salary", salarySchema);

export default Salary;
