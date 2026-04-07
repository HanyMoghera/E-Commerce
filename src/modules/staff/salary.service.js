import Deduction from "../../database/models/deduction.model.js";
import { Staff } from "../../database/models/staff.model.js";

// Add a new deduction
export const addDeduction = async (req, res) => {
  try {
    const { amount, reason, month } = req.body;
    const { id } = req.params;

    // Make sure staff exists
    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Create deduction
    const deduction = await Deduction.create({
      staff: id,
      month,
      amount,
      reason,
    });

    res.status(201).json({
      message: "Deduction added successfully",
      deduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all deductions of a staff
export const getDeductions = async (req, res) => {
  try {
    const { id } = req.params;
    // Make sure staff exists
    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    const deductions = await Deduction.find({ staff: id }).sort({ date: -1 });
    res.json({ deductions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a deduction
export const updateDeduction = async (req, res) => {
  try {
    const { id, deductionId } = req.params;
    const { amount, reason, month } = req.body;

    // Make sure staff exists
    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Find deduction
    const deduction = await Deduction.findOne({ _id: deductionId, staff: id });
    if (!deduction)
      return res.status(404).json({ message: "Deduction not found" });

    if (amount !== undefined) deduction.amount = amount;
    if (reason !== undefined) deduction.reason = reason;
    if (month !== undefined) deduction.month = month;

    await deduction.save();

    res.json({
      message: "Deduction updated successfully",
      deduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a deduction
export const removeDeduction = async (req, res) => {
  try {
    const { id, deductionId } = req.params;

    // Make sure staff exists
    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const deduction = await Deduction.findOneAndDelete({
      _id: deductionId,
      staff: id,
    });
    if (!deduction)
      return res.status(404).json({ message: "Deduction not found" });

    res.json({ message: "Deduction removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
