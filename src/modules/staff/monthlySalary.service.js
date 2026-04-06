import { Staff } from "../../database/models/staff.model.js";
import Deduction from "../../database/models/deduction.model.js";

// Calculate monthly salary
export const calculateMonthlySalary = async (req, res) => {
  try {
    const { id, month } = req.params;

    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    // Get or create monthly report
    let report = staff.monthlyReports.find((r) => r.month === month);
    if (!report) {
      report = {
        month,
        totalDaysWorked: 0,
        totalDeductions: 0,
        finalSalary: 0,
        isPaid: false,
        paidAt: null,
      };
      staff.monthlyReports.push(report);
    }

    const workedDays = report.totalDaysWorked || 0;
    const baseSalary = staff.dailySalary * workedDays;

    // Get manual deductions for this staff and month
    const manualDeductions = await Deduction.aggregate([
      { $match: { staff: staff._id, month } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const manualDeductionAmount =
      manualDeductions.length > 0 ? manualDeductions[0].total : 0;

    // Here, you could add logic for late or absent deductions if needed
    const totalDeductions = manualDeductionAmount; // only manual deductions for now
    const finalSalary = baseSalary - totalDeductions;

    // Update report
    report.totalDeductions = totalDeductions;
    report.finalSalary = finalSalary;

    await staff.save();

    res.json({
      message: "Salary calculated successfully",
      month,
      workedDays,
      baseSalary,
      manualDeductionAmount,
      totalDeductions,
      finalSalary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark salary as paid
export const paySalary = async (req, res) => {
  try {
    const { id, month } = req.params;

    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const report = staff.monthlyReports.find((r) => r.month === month);
    if (!report)
      return res.status(404).json({ message: "Monthly report not found" });

    if (report.isPaid)
      return res.status(400).json({ message: "Salary already paid" });

    report.isPaid = true;
    report.paidAt = new Date();

    await staff.save();

    res.json({
      message: "Salary marked as paid",
      paidAt: report.paidAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Adjust salary (bonus or excuse)
export const adjustSalary = async (req, res) => {
  try {
    const { id, month } = req.params;
    const { amount } = req.body;

    const staff = await Staff.findOne({ _id: id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const report = staff.monthlyReports.find((r) => r.month === month);
    if (!report)
      return res.status(404).json({ message: "Monthly report not found" });

    report.finalSalary += amount;

    await staff.save();

    res.json({
      message: "Salary adjusted successfully",
      finalSalary: report.finalSalary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
