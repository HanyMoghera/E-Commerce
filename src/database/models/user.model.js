import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    phone: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "staff"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    avatar: String,
    avatarPublicId: String, // Cloudinary public_id to detect if the user already has an avatar and delete it when uploading a new one
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre(/^find/, function () {
  this.find({ isDeleted: { $ne: true } });
});

export const User = mongoose.model("User", userSchema);
