import { Staff } from "../../database/models/staff.model.js";

export const checkIn = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user.id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const existingReport = staff.monthlyReports.find(
      (r) => r.month === today.slice(0, 7),
    );

    if (!existingReport) {
      staff.monthlyReports.push({
        month: today.slice(0, 7),
        totalDaysWorked: 0,
        totalDeductions: 0,
        finalSalary: 0,
      });
    }

    const monthReport = staff.monthlyReports.find(
      (r) => r.month === today.slice(0, 7),
    );

    if (monthReport.checkIns && monthReport.checkIns[today]) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const now = new Date();
    const isLate =
      now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);

    monthReport.checkIns = monthReport.checkIns || {};
    monthReport.checkIns[today] = { checkInTime: now, isLate };

    await staff.save();

    res.json({ message: "Checked in successfully", checkInTime: now, isLate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.user.id, isDeleted: false });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    const monthReport = staff.monthlyReports.find(
      (r) => r.month === today.slice(0, 7),
    );

    if (!monthReport?.checkIns?.[today]?.checkInTime) {
      return res
        .status(400)
        .json({ message: "Check-in first before check-out" });
    }

    if (monthReport.checkIns[today].checkOutTime) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    const now = new Date();
    const checkInTime = new Date(monthReport.checkIns[today].checkInTime);
    const hoursWorked = (now - checkInTime) / 1000 / 60 / 60; // in hours

    let deduction = 0;
    if (hoursWorked < 8) {
      deduction = (8 - hoursWorked) * staff.dailySalary; // simple deduction
    }

    monthReport.checkIns[today].checkOutTime = now;
    monthReport.checkIns[today].hoursWorked = hoursWorked;
    monthReport.checkIns[today].deduction = deduction;

    monthReport.totalDaysWorked += 1;
    monthReport.totalDeductions += deduction;
    monthReport.finalSalary =
      monthReport.totalDaysWorked * staff.dailySalary -
      monthReport.totalDeductions;

    await staff.save();

    res.json({
      message: "Checked out successfully",
      checkOutTime: now,
      hoursWorked,
      deduction,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
