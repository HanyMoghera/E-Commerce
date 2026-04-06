import { Staff } from "../../database/models/staff.model.js";
import { User } from "../../database/models/user.model.js"; // assuming user exists

export const createStaff = async (req, res) => {
  try {
    const { user, dailySalary, joinDate, department } = req.body;

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if this user already has staff profile
    const existingStaff = await Staff.findOne({ user, isDeleted: false });
    if (existingStaff) {
      return res
        .status(400)
        .json({ message: "Staff profile already exists for this user" });
    }

    const staff = await Staff.create({
      user,
      dailySalary,
      joinDate,
      department,
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff,
    });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all staff
export const getStaff = async (req, res) => {
  try {
    let { page = 1, limit = 10, sort } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filter = { isDeleted: false };
    let sortOption = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortOption[field] = order === "asc" ? 1 : -1;
    }

    const staff = await Staff.find(filter)
      .populate("user")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Staff.countDocuments(filter);

    res.json({ page, limit, total, staff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get staff details
export const getStaffDetails = async (req, res) => {
  try {
    const staff = await Staff.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("user");
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff info
export const updateStaffInfo = async (req, res) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, isDeleted: false });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const { dailySalary, joinDate, department, isActive } = req.body;

    if (dailySalary !== undefined) staff.dailySalary = dailySalary;
    if (joinDate !== undefined) staff.joinDate = joinDate;
    if (department !== undefined) staff.department = department;
    if (isActive !== undefined) staff.isActive = isActive;

    await staff.save();

    res.json({
      message: "Staff updated successfully",
      staff,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft delete staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findOne({ _id: req.params.id, isDeleted: false });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.isDeleted = true;
    staff.deletedAt = new Date();
    await staff.save();

    res.json({ message: "Staff soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
