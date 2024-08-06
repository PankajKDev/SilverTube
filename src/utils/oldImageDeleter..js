import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const oldImageDeleter = async (user) => {
  try {
    const publicId = user?.avatar?.publicId;
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Image deletion result:", result);
    } else {
      console.log("No publicId found for the user avatar.");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export { oldImageDeleter };
