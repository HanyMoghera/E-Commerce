import { User } from "../../database/models/user.model.js";
import { uploadCloudinary } from "../../utils/uploadClodinary.util.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and phone if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle avatar upload if a new file is provided
    if (req.file) {
      const { url, public_id } = await uploadCloudinary(
        req.file.path,
        "avatars",
      );

      // delete old avatar from Cloudinary if exists
      if (user.avatarPublicId) {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      }

      user.avatar = url; // Save new avatar URL
      user.avatarPublicId = public_id; // Save public_id for future deletion
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Soft delete profile
export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has an avatar
    if (user.avatar) {
      return res.status(400).json({
        message:
          "You already have an avatar. Please update the existing one instead of uploading a new one.",
      });
    }

    // Upload new avatar to Cloudinary
    const { url, public_id } = await uploadCloudinary(req.file.path, "avatars");

    // Save avatar info to user
    user.avatar = url;
    user.avatarPublicId = public_id;

    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: error.message });
  }
};
