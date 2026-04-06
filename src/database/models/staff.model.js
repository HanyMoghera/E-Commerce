import mongoose from "mongoose";

const monthlyReportSchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., "2024-03"
  totalDaysWorked: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  finalSalary: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
});

const staffSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dailySalary: { type: Number, required: true },
    joinDate: { type: Date, default: Date.now },
    department: { type: String },
    isActive: { type: Boolean, default: true },
    monthlyReports: [monthlyReportSchema],
    isDeleted: { type: Boolean, default: false }, // for soft delete
  },
  { timestamps: true },
);

export const Staff = mongoose.model("Staff", staffSchema);
