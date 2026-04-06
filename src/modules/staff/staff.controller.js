import { Router } from "express";

// Staff Service
import {
  createStaff,
  getStaff,
  getStaffDetails,
  updateStaffInfo,
  deleteStaff,
} from "./staff.service.js";

// Salary Service (Deductions)
import {
  addDeduction,
  getDeductions,
  updateDeduction,
  removeDeduction,
} from "./salary.service.js";

// Monthly Salary Service
import {
  calculateMonthlySalary,
  paySalary,
  adjustSalary,
} from "./monthlySalary.service.js";


// Middleware
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

// Apply auth + admin role on all routes
router.use(auth, allowRoles("admin"));

  //  4.1 Staff Management

// Add staff
router.post("/", createStaff);

// Get all staff
router.get("/", getStaff);

// Get staff details
router.get("/:id", getStaffDetails);

// Update staff
router.put("/:id", updateStaffInfo);

// Soft delete staff
router.delete("/:id", deleteStaff);

  //  4.3 Deductions APIs

// Add deduction
router.post("/:id/deductions", addDeduction);

// Get deductions
router.get("/:id/deductions", getDeductions);

// Update deduction
router.put("/:id/deductions/:deductionId", updateDeduction);

// Remove deduction
router.delete("/:id/deductions/:deductionId", removeDeduction);

  //  4.4 Monthly Salary APIs

// Calculate salary
router.get("/:id/salary/:month", calculateMonthlySalary);

// Mark as paid
router.post("/:id/salary/:month/pay", paySalary);

// Adjust salary
router.put("/:id/salary/:month/adjust", adjustSalary);

export default router;
