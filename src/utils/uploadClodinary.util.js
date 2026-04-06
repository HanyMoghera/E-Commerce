import cloudinary from "cloudinary";

export const uploadCloudinary = async (localFilePath, folder = "uploads") => {
  if (!localFilePath) throw new Error("LocalFilePath is required");

  try {
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: "image",
    });

    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
